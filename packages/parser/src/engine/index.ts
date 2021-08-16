import { clearIdentifiers } from "./parser/identifiers"
import tokenize from "./lexer"
import parse, { API } from "./parser"

function ERMLParser(ERML: string) {
  if (typeof ERML !== "string") {
    throw new TypeError("Argument passed to parser must be of type string")
  }
  clearIdentifiers()
  const tokens = tokenize(ERML)
  return parse(tokens)
}

ERMLParser.API = API

export = ERMLParser
