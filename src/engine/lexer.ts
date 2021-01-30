export type Tokens = { value: string; position: number; line: number }[]

export const tokensRegexs = {
  wordChar: "\\w+",
  openingBrace: "{",
  closingBrace: "}",
  openingBracket: "\\[",
  closingBracket: "\\]",
  openingAngle: "<",
  closingAngle: ">",
  openingParen: "\\(",
  closingParen: "\\)",
  comma: ",",
  string: `"(?:[^"\\\\]|\\\\.)*"`,
  comment: `#.*|\\/\\*[^]*?\\*\\/`,
}

export default function (ERML: string): Tokens {
  const tokenizerRegex = new RegExp(Object.values(tokensRegexs).join("|"), "g")
  const commentRegex = new RegExp(tokensRegexs.comment)
  const matches = ERML.matchAll(tokenizerRegex)
  return Array.from(matches)
    .map(({ 0: value, index: position }) => {
      const line = (ERML.slice(0, position).match(/\n/g)?.length || 0) + 1
      return { value, position, line }
    })
    .filter(({ value }) => commentRegex.test(value) === false)
}
