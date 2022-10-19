const {relationhandler} = require('../../utils');
const {funcTypeEnum} = require('./const')
let count = 0
class Diagraph {
    constructor() {
        this.map = new Map(); // node -> 有向图节点
        this.active = this.createNode(null, {type: 'root'});
        // node -> Set<referenceNode> 表示还有哪些referenceNode引用了node
        // 当node注册完毕的时候，需要给referenceNode注入其usedNodeSet
        this.todoMap = new Map();
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
    getNodeItem(node) {
        if(!this.map.has(node)) {
            this.map.set(node, this.createNode(node))
        }
        return this.map.get(node);
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
        const item = this.getNodeItem(node);
        const pItem = this.active;
        this.setRelation(item, pItem);
        this.active = item;
    }

    back() {
        this.active = this.active.parent;
    }

    getUsedNodeSet(node) {
        const st = new Set();
        const addRecursion = (nd) => {
            console.log(++count)
            // 这里st兼具banList的作用，不再次遍历已遍历过的node
            if(st.has(nd)) return;
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
        const st = this.getUsedNodeSet(node);
        st.forEach(nd=>{
            if(relationhandler.isContain(this.active.value, nd)) return;
            this.active.usedNodeSet.add(nd)
        })
    }

    registerTodoMap(node) {
        if(!this.todoMap.has(node)) {
            this.todoMap.set(node, new Set())
        }
        const registerRecursion = (nd, refNode) => {
            const st = this.todoMap.get(nd);
            if(!st) return;
            st.add(refNode);
            const item = this.getNodeItem(refNode);
            item.usedNodeSet.forEach(n=> {
                const s = this.todoMap.get(n);
                if(!s) return;
                const unionSet = new Set([...s, ...this.todoMap.get(nd)])
                this.todoMap.set(nd, unionSet);
                registerRecursion(nd, n)
            })
        }
        registerRecursion(node, this.active.value);
    }
    
    addFuncToNode(node) {
        this.checkValidate(node);
        if(relationhandler.isContain(this.active.value, node)) return;
        this.active.usedNodeSet.add(node);
        const item = this.map.get(node);
        if(!item) {
            this.registerTodoMap(node);
            return;
        }
        const st = item.usedNodeSet;
        st.forEach(nd=>{
            this.active.usedNodeSet.add(nd)
        })
    }
    createTodoNode(node) {
        this.todoMap.set(node, new Set())
    }
    updateTodoNode(node) {
        const st = this.todoMap.get(node);
        
    }
    clearTodoNode(node) {
        const clearItem = this.map.get(node);
        this.todoMap.delete(node);
        st.forEach((nd) => {
            const item = this.map.get(nd);
            if(!item) return;
            item.usedNodeSet = new Set([
                ...item.usedNodeSet,
                ...clearItem.usedNodeSet
            ])
        })
    }

    getActiveFunc() {
        return this.active.value;
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