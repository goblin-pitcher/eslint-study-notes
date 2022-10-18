const {relationhandler} = require('../../utils');
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

    getSetRecursion(node) {
        const st = new Set();
        const addRecursion = (nd) => {
            st.add(nd);
            const item = this.map.get(nd);
            if(!item) return;
            item.usedNodeSet.forEach(n=>{
                addRecursion(n)
            })
        }
        addRecursion(node);
        return st;
    }
    addFuncNode(node) {
        this.checkValidate(node);
        const st = this.getSetRecursion(node);
        st.forEach(nd=>{
            if(relationhandler.isContain(this.active.value, nd)) return;
            this.active.usedNodeSet.add(nd)
        })
    }
    
    checkCycle() {
        // const path = []
        // const {active} = this
        // let checkNode = active;
        // while(checkNode.usedNodeSet.size && !checkNode.usedNodeSet.has(active.value)) {
        //     path.push(getName(checkNode.value))
        //     checkNode = checkNode.parent
        // }
        // return path.length ? path : null
        return this.active.usedNodeSet.has(this.active.value)
    }
}

module.exports = Diagraph;