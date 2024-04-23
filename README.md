## eslint学习笔记

### 文件夹描述

```txt
├── eslint-study-nodes
|   ├── eslint-plugin-memory-leak
|       └── lib/rules // 自定义规则
|           └── recursion-return // 递归调用时，递归环中必须有return
|   └── test-pkgs // 插件测试文件夹
```

### 目前已有内容
[eslint配置及踩坑](https://github.com/goblin-pitcher/eslint-study-notes/tree/main/vscode%E7%9B%B8%E5%85%B3lint%E9%85%8D%E7%BD%AE)，内容如下：
+ 不使用Prettier，仅配置eslint，使代码的自动format完全符合eslint规范
+ 新旧eslint规则集合的eslint-loader不兼容，导致规则无法解析的问题，以及解决方案
+ 踩坑记录

[eslint插件——内存泄漏代码检测工具](https://github.com/goblin-pitcher/eslint-study-notes/tree/main/eslint-plugin-memory-leak), 内容如下：
+ 前端内存泄漏场景及原因分析
+ 异步递归请求导致内存泄漏的排查插件开发

### 关于后续
最近入职新公司后，领导让我沿着之前eslint检测内存泄露的思路做下去，我这边将内存泄露场景分为了四类：
1. event-listener: 元素add/removeEventListener
2. setInterval
3. 第三方库，如mitt，`import mitt from 'mitt'; const bus = mitt();`，如果在组件里执行`bus.on`，那么需要执行对应的`bus.off`
4. 全局对象的挂载，如往一个全局数组里乱塞东西但是没有销毁

目前已经实现并测试了规则1、2、3，规则4开发中。
虽然大部分是在家用自己电脑开发，自己github私有仓在维护，但毕竟是公司项目，暂时不开源了...
