import { Tokens } from "../lexer"
import {
  parseKeywordProcess,
  parseIdentifierProcess,
  parseBodyProcess,
  walkPipeline
} from "./pipeline"

export type Token = Tokens[0]

const enum Initializers {
  ENTITY = "ENTITY",
}

const enum Delimiters {
  OPENING_BRACE = "{",
  CLOSING_BRACE = "}",
  COMMA = ",",
}

function parseAttrs(
  tokens: Tokens,
  bodyStartAt: number,
  bodyEndAt: number,
  allowMultipleValuedAttrs = false
) {
  return [{ type: "simple", value: "name" }]
}

function parseEntity(tokens: Tokens, currentTokenIndex: number) {
  const parsingPipeline = [
    (token: Token) =>
      parseKeywordProcess(
        token,
        Initializers.ENTITY,
        () => ({ type: Initializers.ENTITY.toLocaleLowerCase() }),
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
        (bodyStart: number, bodyEnd: number) => ({
          attributes: parseAttrs(tokens, bodyStart, bodyEnd, true),
        })
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
