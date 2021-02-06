import { Token, Tokens } from "../lexer"
import {
  isValidIdentifier,
  isValidReference,
  isDuplicateIdentifier,
} from "./identifiers"
import { Delimiters } from "./"

export type PipelineFunction = (
  token: Token,
  tokenIndex: number
) => number | void

export type ParsingPipeline = PipelineFunction[]

export function assertToken(
  token: Token,
  expectedValues: readonly string[],
  callback?: (matchIndex: number) => void
) {
  const matchIndex = expectedValues.indexOf(token.value)

  if (matchIndex < 0) {
    throw new SyntaxError(
      `Expected to find ${expectedValues
        .map((value) => `'${value}'`)
        .join(", ")} at position ${token.position}, line ${
        token.line
      }. Instead found '${token.value}'`
    )
  }
  if (callback) {
    callback(matchIndex)
  }
}

export function processNumber(
  token: Token,
  range: [number, number],
  callback: (number: number) => void
) {
  const number = Number(token.value)

  if (isNaN(number)) {
    throw new TypeError(
      `'${token.value}' at position ${token.position}, line ${token.line} is not a valid number`
    )
  } else if (number < range[0] || number > range[1]) {
    throw new RangeError(
      `'${token.value}' at position ${token.position}, line ${token.line} doesn't fall in the range of [${range[0]}, ${range[1]}]`
    )
  }
  callback(number)
}

export function processIdentifier(
  token: Token,
  isReference: boolean,
  callback: () => void
) {
  if (isValidIdentifier(token.value) === false) {
    throw new SyntaxError(
      `'${token.value}' at position ${token.position}, line ${token.line} is not a valid identifier`
    )
  } else if (isReference && isValidReference(token.value) === false) {
    throw new ReferenceError(
      `'${token.value}' at position ${token.position}, line ${token.line} is not defined before`
    )
  } else if (isReference === false && isDuplicateIdentifier(token.value)) {
    throw new SyntaxError(
      `'${token.value}' at position ${token.position}, line ${token.line} is already defined`
    )
  }
  callback()
}

export function processBody(
  tokens: Tokens,
  tokenIndex: number,
  callback: (bodyStart: number, bodyEnd: number) => void
) {
  assertToken(tokens[tokenIndex], [Delimiters.OPENING_BRACE])
  const closingBracePosition = bracesMatchAt(tokens, tokenIndex)

  if (closingBracePosition === null) {
    throw new SyntaxError(
      `Grouping symbols ("${Delimiters.OPENING_BRACE}" and "${Delimiters.CLOSING_BRACE}") don't match after "${Delimiters.OPENING_BRACE}" at position ${tokens[tokenIndex].position}, line ${tokens[tokenIndex].line}`
    )
  }

  const bodyStart = tokenIndex + 1,
    bodyEnd = closingBracePosition - 1

  if (bodyStart > bodyEnd) {
    throw new SyntaxError(
      `Body can't be empty at position ${tokens[tokenIndex].position}, line ${tokens[tokenIndex].line}`
    )
  }

  callback(bodyStart, bodyEnd)
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
      throw new SyntaxError(
        `Didn't expect to reach the end after token '${previousToken.value}' at position ${previousToken.position}, line ${previousToken.line}`
      )
    }

    const nextTokenIndex = process(tokens[currentTokenIndex], currentTokenIndex)
    currentTokenIndex = nextTokenIndex ? nextTokenIndex : currentTokenIndex + 1
  }

  return currentTokenIndex
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

export const testables = { bracesMatchAt }
