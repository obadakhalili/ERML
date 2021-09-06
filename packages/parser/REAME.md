# ERML Parser

Converts ERML code into an AST.

# Installation and Usage

You can install the ERML parser from [NPM](http://npmjs.org/package/erml-parser) or [yarn](https://classic.yarnpkg.com/en/package/erml-parser) via the commands

```sh
npm install erml-parser
yarn add erml-parser
```

After that, all you have to do is to execute the parsing function exported by the library

```js
const ERMLParser = require("erml-parser")
const ast = ERMLParser(`ENTITY Example_entity { SIMPLE "attribute_name" }`)
```
