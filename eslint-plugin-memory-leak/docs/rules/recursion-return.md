# 递归的没有return导致内存泄露的检测 (recursion-return)

Please describe the origin of the rule here.

## Rule Details

This rule aims to...
检测递归调用的函数是否有return，判断是否是死递归
+ gen-get-function-expression.js
    - 对于调用方法，获取其定义函数节点
+ 针对多个函数形成的环
    - 可以理解成在有向图中寻找环
    - 和常规有向图不同的是，需要在生产有向图的过程中寻找环
    - dfs生产有向图，且该深度优先不是沿着函数找，而是沿着ast结构进行dfs
    - 常规的有向图中找环的方法：如dfs+双array标记、dfs+三色标记、bfs+拓扑排序(不停移除入度为0的节点)等方法都不行
    - 此处以不停记录祖先节点引用函数的集合，作为判断条件
Examples of **incorrect** code for this rule:

```js

// fill me in

```

Examples of **correct** code for this rule:

```js

// fill me in

```

### Options

If there are any options, describe them here. Otherwise, delete this section.

## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
