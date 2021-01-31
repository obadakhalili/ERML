import { Tokens } from "../lexer"
import { Token } from "."

function assertToken(token: Token, expectedValue: string) {
  if (token.value !== expectedValue) {
    throw new Error(
      `Expected to find "${expectedValue}" at at position ${token.position}, line ${token.line}. Instead found "${token.value}"`
    )
  }
}

function groupingSymbolsMatchAt(
  tokens: Tokens,
  currentPosition: number,
  openingSymbol: string,
  closingSymbol: string
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

export function parseKeywordProcess(
  token: Token,
  expectedKeyword: string,
  getNodeProp: () => object,
  silent = false
) {
  try {
    assertToken(token, expectedKeyword)
    return getNodeProp()
  } catch (e) {
    if (!silent) {
      throw e
    }
    return null
  }
}

export function parseIdentifierProcess(
  token: Token,
  getNodeProp: () => object
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
  openingSymbol: string,
  closingSymbol: string,
  bodyParser: (bodyStart: number, bodyEnd: number) => object
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
  parsingPipeline: any,
  tokens: Tokens,
  currentTokenIndex: number
) {
  let node = {}

  for (const process of parsingPipeline) {
    if (!tokens[currentTokenIndex]) {
      const previousToken = tokens[currentTokenIndex - 1]
      throw new Error(
        `Didn't expect to reach the end after token "${previousToken.value}" at position ${previousToken.position}, line ${previousToken.line}`
      )
    }

    const nodeProp = process(tokens[currentTokenIndex], currentTokenIndex++)

    if (!nodeProp) {
      return null
    }
    node = { ...node, ...nodeProp }
  }

  return node
}
