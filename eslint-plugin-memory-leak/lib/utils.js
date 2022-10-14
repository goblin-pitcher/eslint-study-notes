const traverse = (node, findFunc = () => false, ignoreFunc = ()=>false) => {
    const checkItems = [].concat(node.body||[]);
    while(checkItems.length) {
        const item = checkItems.shift();
        if(ignoreFunc(item)) continue;
        if(findFunc(item)) {
            return item
        }
        checkItems.unshift(...([].concat(item.body||[])))
    }
    return null;
}

const relationhandler = {
    isContain: (pNode, cNode) => {
        return pNode.start <= cNode.start && cNode.end <= pNode.end
    },
    isPrev: (aNode, bNode) => {
        return aNode.end < bNode.start
    }
}


exports.traverse = traverse;
exports.relationhandler = relationhandler