import { Token, Tokens } from "../lexer"
import {
  assertKeywordProcess,
  parseIdentifierProcess,
  parseBodyProcess,
  walkPipeline,
  ParsingPipeline,
  Node,
  Keywords,
  Keyword,
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

function parseParticipatingEntities(
  tokens: Tokens,
  bodyStartAt: number,
  bodyEndAt: number
): Node["participatingEntities"] {
  return [
    {
      name: "foo",
      "participation constraint": "total",
      "cardinality ratio": "N",
    },
  ]
}

function parseEntity(
  tokens: Tokens,
  currentTokenIndex: number
): [number, Node] {
  const parsingPipeline: ParsingPipeline = [
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
  const [nextTokenIndex, node] = walkPipeline(
    parsingPipeline,
    tokens,
    currentTokenIndex
  )
  node.type = "entity"

  return [nextTokenIndex, node]
}

function parseWeakEntity(tokens: Tokens, currentTokenIndex: number) {
  const parsingPipeline: ParsingPipeline = [
    (token: Token) =>
      assertKeywordProcess(token, Keywords.ENTITY, () => ({
        type: "weak entity",
      })),
    (token: Token) =>
      parseIdentifierProcess(token, () => ({ name: token.value })),
    (token: Token) => assertKeywordProcess(token, Keywords.OWNER, () => ({})),
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

function parseRelationship(
  tokens: Tokens,
  currentTokenIndex: number
): [number, Node] {
  const parsingPipeline: ParsingPipeline = [
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
          {
            participatingEntities: parseParticipatingEntities(
              tokens,
              bodyStart,
              bodyEnd
            ),
          },
        ]
      ),
  ]
  const [nextTokenIndex, node] = walkPipeline(
    parsingPipeline,
    tokens,
    currentTokenIndex
  )
  node.type = "relationship"

  return [nextTokenIndex, node]
}

function parseIdentifyingRelationship(
  tokens: Tokens,
  currentTokenIndex: number
) {
  const parsingPipeline: ParsingPipeline = [
    (token: Token) =>
      assertKeywordProcess(token, Keywords.RELATIONSHIP, () => ({
        type: "identifying relationship",
      })),
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
          {
            participatingEntities: parseParticipatingEntities(
              tokens,
              bodyStart,
              bodyEnd
            ),
          },
        ]
      ),
  ]

  return walkPipeline(parsingPipeline, tokens, currentTokenIndex)
}

export default function (tokens: Tokens) {
  const AST: Node[] = []
  const parsers = {
    [Keywords.ENTITY]: parseEntity,
    [Keywords.WEAK]: parseWeakEntity,
    [Keywords.RELATIONSHIP]: parseRelationship,
    [Keywords.IDENTIFYING_RELATIONSHIP]: parseIdentifyingRelationship,
  }
  const tokensCount = tokens.length
  let currentTokenIndex = 0

  while (currentTokenIndex < tokensCount) {
    const currentParser =
      parsers[
        tokens[currentTokenIndex].value as Exclude<Keyword, Keywords.OWNER>
      ]

    if (!currentParser) {
      throw new Error(
        `Couldn't parse token "${tokens[currentTokenIndex].value}" at position ${tokens[currentTokenIndex].position}, ${tokens[currentTokenIndex].line}`
      )
    }

    const [nextTokenIndex, node] = currentParser(tokens, ++currentTokenIndex)

    AST.push(node)
    currentTokenIndex = nextTokenIndex
  }

  return AST
}
