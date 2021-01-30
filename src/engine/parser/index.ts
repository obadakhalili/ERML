import { isValidIdentifier, groupingSymbolsMatchAt } from "./common"

const enum Initializers {
  ENTITY = "ENTITY",
}

const enum Delimiters {
  OPENING_CURLY_BRACKET = "{",
  CLOSING_CURLY_BRACKET = "}",
  COMMA = ",",
}

interface Node {
  type: "entity" | "weak entity" | "relationship" | "identifying relationship"
  identifierName: string
  // attrs, owner, participating entities
}

function parseAttrs(
  tokens: string[],
  bodyStartAt: number,
  bodyEndAt: number,
  allowMultipleValuedAttrs = false
) {}

function parseEntity(tokens: string[], currentPosition: number): Node | null {
  if (tokens[currentPosition] !== Initializers.ENTITY) {
    return null
  }

  const identifierName = tokens[++currentPosition]
  let closingBracketPosition: number | null

  if (!isValidIdentifier(identifierName)) {
    throw new Error(`Entity identifier name "${identifierName}" is invalid`)
  } else if (tokens[++currentPosition] !== Delimiters.OPENING_CURLY_BRACKET) {
    throw new Error(`Expected "{" after identifier "${identifierName}"`)
  } else if (
    (closingBracketPosition = groupingSymbolsMatchAt(
      tokens,
      currentPosition,
      Delimiters.OPENING_CURLY_BRACKET,
      Delimiters.CLOSING_CURLY_BRACKET
    )) === null
  ) {
    throw new Error('Grouping symbols ("{" and "}") don\'t match')
  }

  const attrs = parseAttrs(
    tokens,
    currentPosition + 1,
    closingBracketPosition - 1,
    true
  )

  return { type: "entity", identifierName }
}

export default function (tokens: string[]) {
  // Parse Entity
  // Parse Weak Entity
  // Parse Relatonship
  // Parse IDEN Relationship
}
