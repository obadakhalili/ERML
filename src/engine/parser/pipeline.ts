import { Token, Tokens } from "../lexer"

export type Keyword =
  | Keywords.ENTITY
  | Keywords.WEAK
  | Keywords.OWNER
  | Keywords.RELATIONSHIP
  | Keywords.IDENTIFYING_RELATIONSHIP
type OpeningSymbol = Delimiters.OPENING_BRACE
type ClosingSymbol = Delimiters.CLOSING_BRACE

export const enum Keywords {
  ENTITY = "ENTITY",
  WEAK = "WEAK",
  OWNER = "OWNER",
  RELATIONSHIP = "RELATIONSHIP",
  IDENTIFYING_RELATIONSHIP = "IDEN",
}

export const enum Delimiters {
  OPENING_BRACE = "{",
  CLOSING_BRACE = "}",
}

export interface Node {
  type: "entity" | "weak entity" | "relationship" | "identifying relationship"
  name: string
  owner?: string
  attributes?: unknown[]
  participatingEntities?: unknown[]
}

export type ParsingPipeline = ((
  token: Token,
  tokenIndex: number
) => ReturnType<
  | typeof assertKeywordProcess
  | typeof parseIdentifierProcess
  | typeof parseBodyProcess
>)[]

export function assertKeywordProcess(
  token: Token,
  expectedKeyword: Keyword,
  getNodeProp: () => Record<string, never> | { type: Node["type"] }
) {
  assertToken(token, expectedKeyword)
  return getNodeProp()
}

export function parseIdentifierProcess(
  token: Token,
  getNodeProp: () => { name: Node["name"] } | { owner: string }
) {
  if (!/^[a-zA-Z_]\w{0,29}$/.test(token.value)) {
    throw new Error(
      `"${token.value}" at position ${token.position}, line ${token.line} is not a valid identifier`
    )
  }
  return getNodeProp()
}

export function parseBodyProcess(
  tokens: Tokens,
  tokenIndex: number,
  openingSymbol: OpeningSymbol,
  closingSymbol: ClosingSymbol,
  bodyParser: (
    bodyStart: number,
    bodyEnd: number
  ) => [
    number,
    (
      | { attributes: Node["attributes"] }
      | { participatingEntities: Node["participatingEntities"] }
    )
  ]
) {
  const token = tokens[tokenIndex]
  assertToken(token, openingSymbol)
  const closingSymbolPosition = groupingSymbolsMatchAt(
    tokens,
    tokenIndex,
    openingSymbol,
    closingSymbol
  )

  if (!closingSymbolPosition) {
    throw new Error(
      `Grouping symbols ("${openingSymbol}" and "${closingSymbol}") don't match after "${openingSymbol}" at position ${token.position}, line ${token.line}`
    )
  }

  return bodyParser(tokenIndex + 1, closingSymbolPosition - 1)
}

export function walkPipeline(
  parsingPipeline: ParsingPipeline,
  tokens: Tokens,
  currentTokenIndex: number
): [number, Node] {
  let node = {} as Node

  for (const process of parsingPipeline) {
    if (!tokens[currentTokenIndex]) {
      const previousToken = tokens[currentTokenIndex - 1]
      throw new Error(
        `Didn't expect to reach the end after token "${previousToken.value}" at position ${previousToken.position}, line ${previousToken.line}`
      )
    }

    const processResult = process(
      tokens[currentTokenIndex],
      currentTokenIndex++
    )

    if (processResult.constructor === Array) {
      currentTokenIndex = processResult[0]
      node = { ...node, ...processResult[1] }
    } else {
      node = { ...node, ...processResult }
    }
  }

  return [currentTokenIndex, node]
}

function assertToken(token: Token, expectedValue: string) {
  if (token.value !== expectedValue) {
    throw new Error(
      `Expected to find "${expectedValue}" at position ${token.position}, line ${token.line}. Instead found "${token.value}"`
    )
  }
}

function groupingSymbolsMatchAt(
  tokens: Tokens,
  currentPosition: number,
  openingSymbol: OpeningSymbol,
  closingSymbol: ClosingSymbol
) {
  let groupingSymbolsScales = 0

  do {
    groupingSymbolsScales +=
      tokens[currentPosition].value === openingSymbol
        ? 1
        : tokens[currentPosition].value === closingSymbol
        ? -1
        : 0

    if (groupingSymbolsScales === 0) {
      return currentPosition
    }
  } while (++currentPosition < tokens.length)

  return null
}
