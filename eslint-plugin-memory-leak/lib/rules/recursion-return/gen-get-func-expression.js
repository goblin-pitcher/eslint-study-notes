/* eslint-disable */
const {genTraverse} = require('../../utils');
const {calleeTypeEnum, funcTypeEnum} = require('./const');

const findNodeByName = (root, name) => {
    const findFunc = (scope) => {
        const mp = scope.set || (new Map());
        const findVal = mp.get(name);
      	
        if(findVal) {
            return findVal.identifiers[0].parent.init || findVal.identifiers[0].parent;
        }
        return null;
    }
    const ignoreFunc = (scope) => scope && scope.type === 'global';
    return genTraverse({childKey: 'upper', findFunc, ignoreFunc, returnFindVal: true})(root);
}




const genGetFuncExpression = (context) => {
    const getObjectValue = (node, path = []) => {
        if(!node || node.type !== 'ObjectExpression') return null;
        let item = node;
        for(let i=0; i<path.length; i++) {
            const findKey = path[i];
            const findItem = item && (item.properties || []).find(n=>n.key && n.key.name === findKey)
            if(!findItem) return null;
            item = findItem.value;
        }
        return item;
    }
    const getNodeAndPath = (node) => {
        if(!node || node.type !== calleeTypeEnum.MemberExpression) return null;
        let path = []
        let item = node;
        while(item.type === calleeTypeEnum.MemberExpression) {
            path.unshift(item.property.name);
            item = item.object
        }
        if(item.type === calleeTypeEnum.Identifier) {
            return {
                id: item,
                path,
                thisExpression: false
            }
        }
        if(item.type === "ThisExpression") {
            return {
                id: item,
                path,
                thisExpression: true
            }
        }
        return null;
    }
    const findFuncHandler = {
        Identifier: (node) => {
            if(node && Object.values(funcTypeEnum).includes(node.type)) {
                return node;
            }
            if(!node || node.type !== calleeTypeEnum.Identifier) return null;

            const scope = context.getScope(node);
            const findNode = findNodeByName(scope, node.name);
            if(!findNode) {
                return null
            }
          return findFuncHandler.Identifier(findNode)||findFuncHandler.MemberExpression(findNode);
        },

        MemberExpression: (node) => {
            if(node && Object.values(funcTypeEnum).includes(node.type)) {
                return node;
            }
            if(!node || node.type !== calleeTypeEnum.MemberExpression) return null;

            const info = getNodeAndPath(node);
            const {id, path, thisExpression} = info;
            let findNode;
            if(thisExpression) {
                const classProperty = [...context.getAncestors()].reverse()
                    .find(item=>["ClassProperty", 'MethodDefinition'].includes(item.type) && item.key.name === path[0])
                findNode = classProperty.value;
              
            } else {
                const scope = context.getScope();
                findNode = findNodeByName(scope, id.name);
                if(!findNode) return null;
                if(findNode.type === calleeTypeEnum.MemberExpression) {
                    findNode = findFuncHandler.MemberExpression(findNode);

                }
            	if(findNode && path.length) {
               		findNode = getObjectValue(findNode, path)
              
            	}
            }
            return findFuncHandler.Identifier(findNode)||findFuncHandler.MemberExpression(findNode);
        }
    }

    return (node) => {
        const { callee } = node || {};
        if(!Object.values(calleeTypeEnum).includes(callee.type)) return null;
        const defineNode = findFuncHandler.Identifier(callee) || findFuncHandler.MemberExpression(callee)
        return defineNode
      }
}


  module.exports = genGetFuncExpression;