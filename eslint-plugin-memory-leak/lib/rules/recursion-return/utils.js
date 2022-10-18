
const {genTraverse} = require('../../utils');

const findReturnStatement = (root) => {
    const statementChildKeyEnum = {
      IfStatement: 'consequent',
      SwitchStatement: 'cases'
    }
    const childKey = (item)=> item[statementChildKeyEnum[item.type] || 'body'] || [];
    const ignoreFunc = (node) => !node.type.endsWith('Statement') && node !== root
    const findFunc = (node) => node.type === 'ReturnStatement'
    return genTraverse({
        childKey,
        ignoreFunc,
        findFunc
    })(root)
  }

  exports.findReturnStatement = findReturnStatement;