const {genTraverse, relationhandler} = require('../../utils');
const genGetFuncExpression = require('./gen-get-func-expression');


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

/**
 * @fileoverview 递归的异步方法导致内存泄露的检测
 * @author xiao.wei
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "递归的异步方法导致内存泄露的检测",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      someMessageId: '检测到递归引用，且方法不包含return，可能会有内存泄漏风险',
    },
  },

  create(context) {
    const getFuncExpression = genGetFuncExpression(context);
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------



    return {
      // visitor functions for different types of nodes
      CallExpression(node) {
        const findFunc = getFuncExpression(node);
        if(findFunc && relationhandler.isContain(findFunc, node.callee)) {
          const returnStatement = findReturnStatement(findFunc);
          if(!(returnStatement && relationhandler.isPrev(returnStatement, node.callee))) {
            context.report({
              node,
              messageId: 'someMessageId'
            })
          }
        }
      }
    };
  },
};
