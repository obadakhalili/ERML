export interface Token {
  value: string
  position: number
  line: number
}

export type Tokens = Token[]

const tokensRegexs = [
  "\\w+",
  "{",
  "}",
  "<",
  ">",
  "\\(",
  "\\)",
  ",",
  "(\\+|-)?(\\d+|Infinity)", // Numbers
  '"((?:[^"\\\\]|\\\\.)*)"', // Literal strings (allows escaping of quotes)
  "//.*|\\/\\*[^]*?\\*\\/|\\s", // Comments and whitespaces
  "[^]", // Everything else
]
const tokenizerRegex = new RegExp(tokensRegexs.join("|"), "g")
const newLineRegexp = /\n/g
const ignorablesRegex = /^\/\/.*|\/\*[^]*?\*\/|\s$/
export const stringLiteralRegexp = new RegExp(tokensRegexs[9])

export default function (ERML: string): Tokens {
  const matches = ERML.matchAll(tokenizerRegex)
  return (Array.from(matches) as { [index: number]: string; index: number }[])
    .map(({ 0: value, index: position }) => {
      const line =
        (ERML.slice(0, position).match(newLineRegexp)?.length || 0) + 1
      return { value, position, line }
    })
    .filter(({ value }) => ignorablesRegex.test(value) === false)
}
