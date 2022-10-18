const calleeTypeEnum = {
    Identifier: 'Identifier',
    MemberExpression: 'MemberExpression'
  }
  
const funcTypeEnum = {
    func: 'FunctionDeclaration',
    arrowFunc: 'ArrowFunctionExpression',
    funcExpression: 'FunctionExpression'
}

exports.calleeTypeEnum = calleeTypeEnum;
exports.funcTypeEnum = funcTypeEnum;