import type { languages } from "monaco-editor"

export const config: languages.LanguageConfiguration = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
  },

  brackets: [
    ["{", "}"],
    ["<", ">"],
    ["(", ")"],
  ],

  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "<", close: ">" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
  ],

  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "<", close: ">" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
  ],
}

export const lang: languages.IMonarchLanguage = {
  brackets: [
    { token: "delimiter.curly", open: "{", close: "}" },
    { token: "delimiter.square", open: "<", close: ">" },
    { token: "delimiter.parenthesis", open: "(", close: ")" },
  ],

  keywords: [
    "ENTITY",
    "WEAK",
    "OWNER",
    "REL",
    "IDEN",
    "PARTIAL",
    "TOTAL",
    "ATTRIBUTES",
    "SIMPLE",
    "ATOMIC",
    "PRIMARY",
    "DERIVED",
    "MULTIVALUED",
    "COMPOSITE",
    "N",
    "Infinity",
  ],

  tokenizer: {
    root: [
      { include: "@whitespace" },
      [/[a-zA-Z_]\w*/, { cases: { "@keywords": { token: "keyword.$0" } } }],
      [/(\+|-)?\d+/, "number"],
      [/"/, "string", "@string"],
    ],

    whitespace: [
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"],
    ],

    comment: [
      [/[^/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[/*]/, "comment"],
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"],
    ],
  },
}
