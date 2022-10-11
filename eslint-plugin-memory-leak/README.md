# eslint-plugin-memory-leak

内存泄露检测

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-memory-leak`:

```sh
npm install eslint-plugin-memory-leak --save-dev
```

## Usage

Add `memory-leak` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "memory-leak"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "memory-leak/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


