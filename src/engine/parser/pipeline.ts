import { Token, Tokens } from "../lexer"
import { Keyword } from "./"

const enum Delimiters {
  OPENING_BRACE = "{",
  CLOSING_BRACE = "}",
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
  callback?: () => void
) {
  assertToken(token, expectedKeyword)
  if (callback) {
    callback()
  }
}

export function parseIdentifierProcess(token: Token, callback: () => void) {
  if (/^[a-zA-Z_]\w{0,29}$/.test(token.value) === false) {
    throw new Error(
      `"${token.value}" at position ${token.position}, line ${token.line} is not a valid identifier`
    )
  }
  callback()
}

export function parseBodyProcess(
  tokens: Tokens,
  tokenIndex: number,
  callback: (bodyStart: number, bodyEnd: number) => void
) {
  const token = tokens[tokenIndex]
  assertToken(token, Delimiters.OPENING_BRACE)
  const closingBracePosition = bracesMatchAt(tokens, tokenIndex)

  if (closingBracePosition === null) {
    throw new Error(
      `Grouping symbols ("${Delimiters.OPENING_BRACE}" and "${Delimiters.CLOSING_BRACE}") don't match after "${Delimiters.OPENING_BRACE}" at position ${token.position}, line ${token.line}`
    )
  }
  callback(tokenIndex + 1, closingBracePosition - 1)
  return closingBracePosition + 1
}

export function walkPipeline(
  parsingPipeline: ParsingPipeline,
  tokens: Tokens,
  currentTokenIndex: number
): number {
  for (const process of parsingPipeline) {
    if (tokens[currentTokenIndex] === undefined) {
      const previousToken = tokens[currentTokenIndex - 1]
      throw new Error(
        `Didn't expect to reach the end after token "${previousToken.value}" at position ${previousToken.position}, line ${previousToken.line}`
      )
    }

    const nextTokenIndex = process(tokens[currentTokenIndex], currentTokenIndex)

    currentTokenIndex = nextTokenIndex ? nextTokenIndex : currentTokenIndex + 1
  }

  return currentTokenIndex
}

function assertToken(token: Token, expectedValue: string) {
  if (token.value !== expectedValue) {
    throw new Error(
      `Expected to find "${expectedValue}" at position ${token.position}, line ${token.line}. Instead found "${token.value}"`
    )
  }
}

function bracesMatchAt(tokens: Tokens, currentPosition: number) {
  let scales = 0

  do {
    scales +=
      tokens[currentPosition].value === Delimiters.OPENING_BRACE
        ? 1
        : tokens[currentPosition].value === Delimiters.CLOSING_BRACE
        ? -1
        : 0

    if (scales === 0) {
      return currentPosition
    }
  } while (++currentPosition < tokens.length)

  return null
}
