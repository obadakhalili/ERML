import tokenize from "./lexer"
import parse from "./parser"

export default function (ERML: string) {
  const tokens = tokenize(ERML)
  return tokens.length ? parse(tokens) : {}
}
