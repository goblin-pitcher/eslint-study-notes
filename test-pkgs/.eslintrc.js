module.exports = {
    plugins: ['memory-leak'],
    rules: {
        'memory-leak/async-recursion': 'warn'
    }
}