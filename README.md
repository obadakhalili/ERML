# ERML - Entity-Relationship Markup Language
ERML is a super easy-to-write DSL that represents conceptual data models using the Entity-Relationship modeling concepts.
What does that gibberish mean? read the [docs](https://erml.netlify.app/)

# Installation and Usage

You can install the ERML parser from [NPM](http://npmjs.org/package/erml) or [yarn](https://classic.yarnpkg.com/en/package/erml) via the commands

```sh
npm install erml # From NPM
yarn add erml # From yarn
```

After that all you have to do is to execute the parser function exported by the library

```js
const ERMLParser = require("erml");
const ast = ERMLParser(`ENTITY Example_entity { SIMPLE "attribute_name" }`);
```
