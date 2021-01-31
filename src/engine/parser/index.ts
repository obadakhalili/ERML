import { Token, Tokens } from "../lexer"
import {
  parseKeywordProcess,
  parseIdentifierProcess,
  parseBodyProcess,
  walkPipeline,
  ParsingPipeline,
  Node,
  Keywords,
  Delimiters,
} from "./pipeline"

function parseAttrs(
  tokens: Tokens,
  bodyStartAt: number,
  bodyEndAt: number,
  allowMultipleValuedAttrs = false
): Node["attributes"] {
  return [{ type: "simple", value: "name" }]
}

function parseEntity(tokens: Tokens, currentTokenIndex: number) {
  const parsingPipeline: ParsingPipeline = [
    (token: Token) =>
      parseKeywordProcess(
        token,
        Keywords.ENTITY,
        () => ({ type: "entity" }),
        true
      ),
    (token: Token) =>
      parseIdentifierProcess(token, () => ({ name: token.value })),
    (token: Token, tokenIndex: number) =>
      parseBodyProcess(
        tokens,
        tokenIndex,
        Delimiters.OPENING_BRACE,
        Delimiters.CLOSING_BRACE,
        (bodyStart: number, bodyEnd: number) => [
          bodyEnd + 2,
          { attributes: parseAttrs(tokens, bodyStart, bodyEnd, true) },
        ]
      ),
  ]

  return walkPipeline(parsingPipeline, tokens, currentTokenIndex)
}

export default function (tokens: Tokens) {
  return parseEntity(tokens, 0)
  // Parse Entity
  // Parse Weak Entity
  // Parse Relatonship
  // Parse IDEN Relationship
}
