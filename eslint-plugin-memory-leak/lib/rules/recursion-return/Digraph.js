const {funcTypeEnum} = require('./const')

class Diagraph {
    constructor() {
        this.map = new Map(); // node -> 有向图节点
        this.active = this.createNode(null, {type: 'root'});
    }
    checkValidate(node) {
        if(!Object.values(funcTypeEnum).includes(node.type)) {
            throw new Error('必须是函数类型')
        }
    }
    createNode(node, extra = {}) {
        const item = {
            parent: null,
            children: [],
            value: node,
            // endLocation: loc,
            usedNodeSet: new Set(),
            ...extra
        }
        if(node) {
            this.checkValidate(node);
            this.map.set(node, item)
        }
        return item;
    }
    setRelation(item, pItem) {
        // 父子关系
        item.parent = pItem;
        pItem.children.push(item);
        // 复制引用集合
        item.usedNodeSet = new Set([...pItem.usedNodeSet])
        // 若该节点位置在其父节点return之前，则有判定为引用，即有可能形成环
        // if(relationhandler.isPrev(item, pItem.endLocation)) {
        //     item.usedNodeSet.add(item.value)
        // }
    }
    goDown(node) {
        const item = this.createNode(node);
        const pItem = this.active;
        this.setRelation(item, pItem);
        this.active = item;
    }

    back() {
        this.active = this.active.parent;
    }

    addFuncNode(node) {
        this.checkValidate(node);
        this.active.usedNodeSet.add(node);
    }
    
    getActiveFunc() {
        return this.active.value;
    }

    checkCycle() {
        const findNode = this.active.value;
        const banList = new Set();
        const findRecursion = (checkItem) => {
            if(!checkItem || banList.has(checkItem)) return false;
            banList.add(checkItem);
            if(checkItem.usedNodeSet.has(findNode)) return true;
            return [...checkItem.usedNodeSet].some(nd=>findRecursion(this.map.get(nd)))
        }
        return findRecursion(this.active)
    }
}

module.exports = Diagraph;