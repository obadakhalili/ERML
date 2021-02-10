import tokenize from "./lexer"
import parse from "./parser"

export = function (ERML: string) {
  if (typeof ERML !== "string") {
    throw new TypeError("Argument passed to parser must be of type string")
  }
  const tokens = tokenize(ERML)
  return parse(tokens)
}
