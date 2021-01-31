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
    (_: Token, tokenIndex: number) =>
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

function parseWeakEntity(tokens: Tokens, currentTokenIndex: number) {
  const parsingPipeline: ParsingPipeline = [
    (token: Token) =>
      parseKeywordProcess(token, Keywords.WEAK, () => ({}), true),
    (token: Token) =>
      parseKeywordProcess(token, Keywords.ENTITY, () => ({
        type: "weak entity",
      })),
    (token: Token) =>
      parseIdentifierProcess(token, () => ({ name: token.value })),
    (token: Token) => parseKeywordProcess(token, Keywords.OWNER, () => ({})),
    (token: Token) =>
      parseIdentifierProcess(token, () => ({ owner: token.value })),
    (_: Token, tokenIndex: number) =>
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
  const parsers = [parseEntity, parseWeakEntity]
  const AST: Node[] = []
  const tokensCount = tokens.length
  let currentTokenIndex = 0,
    currentParserIndex = 0

  while (currentTokenIndex < tokensCount) {
    const [nextTokenIndex, node] = parsers[currentParserIndex](
      tokens,
      currentTokenIndex
    )

    if (!node) {
      if (!parsers[++currentParserIndex]) {
        throw new Error(
          `Couldn't parse token "${tokens[currentTokenIndex].value}" at position ${tokens[currentTokenIndex].position}, ${tokens[currentTokenIndex].line}`
        )
      }
      continue
    }

    AST.push(node)
    currentTokenIndex = nextTokenIndex
  }

  return AST
}
