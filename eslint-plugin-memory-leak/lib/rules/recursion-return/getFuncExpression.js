const {genTraverse} = require('../../utils');

const calleeTypeEnum = {
  Identifier: 'Identifier',
  MemberExpression: 'MemberExpression'
}

const funcTypeEnum = {
    func: 'FunctionDeclaration',
    arrowFunc: 'ArrowFunctionExpression'
}

const findNodeByname = (root, name) => {
    const findFunc = (scope) => {
        const mp = scope.set || (new Map());
        const findVal = mp.get(name);
        if(findVal) {
            return findVal.identifers[0].parent.init;
        }
        return null;
    }
    const ignoreFunc = (scope) => scope.type === 'global';
    return genTraverse({childKey: 'upper', findFunc, ignoreFunc, returnFindVal: true})(root);
}

const findNodeByPath = (root, path) => {
    const findFunc = ()
}

const getFuncExpression = (context, path = []) => {
    const findFuncHandler = {
        Identifier: (node, path = []) => {
            if(node.type !== calleeTypeEnum.Identifier) return null;
            const scope = context.getScope(node);
            const findNode = findNodeByname(scope, node.name);
            if(findNode.type === "ObjectExpression" && path.length) {
                
            }
            if(findNode.type === calleeTypeEnum.Identifier) return findFuncHandler.Identifier(node);
            if(findNode.type === calleeTypeEnum.MemberExpression) return findFuncHandler.MemberExpression(node);
            if(Object.values(funcTypeEnum).includes(findNode.type)) return findNode;

            return null
        },
        MemberExpression: (node) => {
            // 只处理ThisExpression，普通对象赋值再进行方法调用，
            const getNodeAndPath = () => {
                if(node.type !== calleeTypeEnum.MemberExpression) return null;
                let path = []
                let item = node;
                while(item.type === calleeTypeEnum.MemberExpression) {
                    path.unshift(item.property.name);
                    item = node.Object
                }
                if(item.type === calleeTypeEnum.Identifier) {
                    return {
                        id: item,
                        path
                    }
                }

                return null;
            }
            const info = getNodeAndPath();
            if(!info) return null;
            const {id, path} = info;
            const scope = context.getScope(id);
            const findNode = findNodeByname(scope, id.name);
        }
    }
    return (node) => {
        const { callee } = node;
        if(!Object.values(calleeTypeEnum).includes(callee.type)) return null;
        const defineNode = Identifier(callee) || 
      
      }
}


  module.exports = getFuncExpression;