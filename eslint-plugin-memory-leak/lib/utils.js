const genTraverse = (options = {}) => (node) => {
    const {
        childKey = 'children',
        findFunc = () => false ,
        ignoreFunc = ()=>false,
        returnFindVal = false
    } = options;
    const getChildren = typeof childKey === 'function'
                        ? (item) => childKey(item) || []
                        : (item) => item[childKey] || [];

    const checkItems = [].concat(getChildren(node));
    while(checkItems.length) {
        const item = checkItems.shift();
        if(ignoreFunc(item)) continue;
        const findVal = findFunc(item);
        if(findVal) {
            return returnFindVal ? findVal : item;
        }
        checkItems.unshift(...([].concat(getChildren(item))))
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

const isDef = (val) => !!(val || val===0);
const getByPath = (obj, path = []) => {
    path = [].concat(path).filter(isDef);
    let findVal = obj;
    for(const key of path) {
        if(!findVal) return findVal;
        findVal = findVal[key]
    }
    return findVal
}

exports.genTraverse = genTraverse;
exports.relationhandler = relationhandler;
exports.isDef = isDef;
exports.getByPath = getByPath;