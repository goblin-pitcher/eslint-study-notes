module.exports = {
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es6: true,
      },
    plugins: ['memory-leak'],
    rules: {
        'memory-leak/recursion-return': 'warn'
    }
}