const {relationhandler} = require('../../utils');
const {findReturnStatement} = require('./utils');
const getFuncExpression = require('./get-func-expression');
const {funcTypeEnum} = require('./const')
const Diagraph = require('./Digraph');
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
    const diagraph = new Diagraph();
    const funcHandler = Object.values(funcTypeEnum).reduce((obj, key)=>{
      obj[key] = (node) => {
        diagraph.goDown(node)
      }
      obj[`${key}:exit`] = () => {
        diagraph.back();
      }
      return obj;
    }, {})
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------



    return {
      ...funcHandler,
      // visitor functions for different types of nodes
      CallExpression(node) {
        const findFuncNode = getFuncExpression(context, node);
        if(findFuncNode) {
          const returnStatement = findReturnStatement(diagraph.getActiveFunc());
          if(!returnStatement
            || !relationhandler.isPrev(returnStatement, node.callee)) {
            diagraph.addFuncNode(findFuncNode);
            const isCycle = diagraph.checkCycle();
            if(isCycle) {
              context.report({
                node,
                messageId: 'someMessageId'
              })
            }
          }
        }
      }
    };
  },
};
