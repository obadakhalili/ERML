import {
  PipelineFunction,
  ParsingPipeline,
  assertToken,
  processNumber,
  processStringLiteral,
  processIdentifier,
  processBody,
  walkPipeline,
} from "./pipeline"
import { Tokens } from "../lexer"
import {
  Attribute,
  Attributes,
  EntityNode,
  WeakEntityNode,
  RelPartEntity,
  RelPartEntities,
  RelBody,
  RelNode,
  Node,
} from "../types"

export enum Delimiters {
  OPENING_BRACE = "{",
  CLOSING_BRACE = "}",
  OPENING_ANGLE = "<",
  CLOSING_ANGLE = ">",
  OPENING_PAREN = "(",
  CLOSING_PAREN = ")",
  COMMA = ",",
}

export enum API {
  ENTITY = "entity",
  WEAK_ENTITY = "weak entity",
  REL = "rel",
  IDEN_REL = "iden rel",
  SEPARATE = "separate",
  PARTIAL = "partial",
  TOTAL = "total",
  ONE = "1",
  N = "N",
  MIN_MAX = "min-max",
  SIMPLE = "simple",
  ATOMIC = "atomic",
  PRIMARY = "primary",
  UNIQUE = "unique",
  DERIVED = "derived",
  MULTIVALUED = "multivalued",
  COMPOSITE = "composite",
}

enum Keywords {
  ENTITY = "ENTITY",
  WEAK = "WEAK",
  OWNER = "OWNER",
  REL = "REL",
  IDEN = "IDEN",
  PARTIAL = "PARTIAL",
  TOTAL = "TOTAL",
  ATTRIBUTES = "ATTRIBUTES",
  SIMPLE = "SIMPLE",
  ATOMIC = "ATOMIC",
  PRIMARY = "PRIMARY",
  UNIQUE = "UNIQUE",
  DERIVED = "DERIVED",
  MULTIVALUED = "MULTIVALUED",
  COMPOSITE = "COMPOSITE",
}

function parseAttributes(
  tokens: Tokens,
  bodyStart: number,
  bodyEnd: number,
  allowMultivalued = true
): Attributes {
  const attributes: Attributes = []
  let currentAttribute: Attribute

  const allowedTypes = [
    Keywords.COMPOSITE,
    Keywords.SIMPLE,
    Keywords.ATOMIC,
    Keywords.PRIMARY,
    Keywords.PARTIAL,
    Keywords.UNIQUE,
    Keywords.DERIVED,
  ]
  if (allowMultivalued) {
    allowedTypes.push(Keywords.MULTIVALUED)
  }

  const compositeTypePipeline: ParsingPipeline = [
    (_, tokenIndex) =>
      processBody(
        tokens,
        tokenIndex,
        (bodyStart, bodyEnd) =>
        (currentAttribute.componentAttributes = parseAttributes(
          tokens,
          bodyStart,
          bodyEnd,
          false
        ))
      ),
    (token, tokenIndex) =>
      tokenIndex > bodyEnd ? undefined : assertToken(token, [Delimiters.COMMA]),
  ]
  const commonPipeline: ParsingPipeline = [
    (token) =>
      assertToken(
        token,
        allowedTypes,
        (matchedIndex) =>
        (currentAttribute.type = (
          [
            API.COMPOSITE,
            API.SIMPLE,
            API.ATOMIC,
            API.PRIMARY,
            API.PARTIAL,
            API.UNIQUE,
            API.DERIVED,
            API.MULTIVALUED,
          ] as const
        )[matchedIndex])
      ),
    (token) =>
      processStringLiteral(
        token,
        (stringValue) => (currentAttribute.name = stringValue)
      ),
    (token, tokenIndex) => {
      if (tokenIndex > bodyEnd || currentAttribute.type === API.COMPOSITE) {
        return
      }
      assertToken(token, [Delimiters.COMMA])
    },
  ]

  for (let currentTokenIndex = bodyStart; currentTokenIndex <= bodyEnd;) {
    attributes.push((currentAttribute = {} as Attribute))
    currentTokenIndex = walkPipeline(commonPipeline, tokens, currentTokenIndex)

    if (currentAttribute.type === API.COMPOSITE) {
      currentTokenIndex = walkPipeline(
        compositeTypePipeline,
        tokens,
        currentTokenIndex - 1
      )
    }
  }

  return attributes
}

function parseRelBody(
  tokens: Tokens,
  bodyStart: number,
  bodyEnd: number
): RelBody {
  const partEntities: RelPartEntities = []
  let currentPartEntity: RelPartEntity
  let attributes = [] as Attributes

  const common: { comma: PipelineFunction; possibleComma: PipelineFunction } = {
    comma: (token) => assertToken(token, [Delimiters.COMMA]),
    possibleComma: (token, tokenIndex) =>
      tokenIndex > bodyEnd ? undefined : assertToken(token, [Delimiters.COMMA]),
  }
  const attributesPipeline: ParsingPipeline = [
    (_, tokenIndex) =>
      processBody(
        tokens,
        tokenIndex,
        (attributesBodyStart, attributesBodyEnd) =>
        (attributes = parseAttributes(
          tokens,
          attributesBodyStart,
          attributesBodyEnd
        ))
      ),
    common.possibleComma,
  ]
  const separateNotationPipeline: ParsingPipeline = [
    (token) =>
      assertToken(
        token,
        [Keywords.PARTIAL, Keywords.TOTAL],
        (matchedIndex) =>
        (currentPartEntity.structConstraints.partConstraint = (
          [API.PARTIAL, API.TOTAL] as const
        )[matchedIndex])
      ),
    common.comma,
    (token) => {
      const allowedTokens = [API.ONE, API.N] as const
      assertToken(
        token,
        allowedTokens,
        (matchedIndex) =>
        (currentPartEntity.structConstraints.cardinalityRatio =
          allowedTokens[matchedIndex])
      )
    },
    (token) => assertToken(token, [Delimiters.CLOSING_ANGLE]),
    common.possibleComma,
  ]
  const minmaxNotationPipeline: ParsingPipeline = [
    (token) =>
      processNumber(
        token,
        [0, Infinity],
        (numberValue) =>
          (currentPartEntity.structConstraints.partConstraint = numberValue)
      ),
    common.comma,
    (token) => {
      try {
        assertToken(
          token,
          [API.N],
          () => (currentPartEntity.structConstraints.cardinalityRatio = API.N)
        )
      } catch {
        processNumber(
          token,
          [
            currentPartEntity.structConstraints.partConstraint as number,
            Infinity,
          ],
          (numberValue) =>
            (currentPartEntity.structConstraints.cardinalityRatio = numberValue)
        )
      }
    },
    (token) => assertToken(token, [Delimiters.CLOSING_PAREN]),
    common.possibleComma,
  ]
  let nextPipeline: ParsingPipeline = []
  const initialPipeline: ParsingPipeline = [
    (token) =>
      processIdentifier(
        token,
        true,
        () => (currentPartEntity.name = token.value)
      ),
    (token) =>
      assertToken(
        token,
        [Delimiters.OPENING_ANGLE, Delimiters.OPENING_PAREN],
        (matchedIndex) => {
          if (matchedIndex === 0) {
            currentPartEntity.notation = API.SEPARATE
            nextPipeline = separateNotationPipeline
          } else {
            currentPartEntity.notation = API.MIN_MAX
            nextPipeline = minmaxNotationPipeline
          }
        }
      ),
  ]

  for (let currentTokenIndex = bodyStart; currentTokenIndex <= bodyEnd;) {
    if (tokens[currentTokenIndex].value === Keywords.ATTRIBUTES) {
      if (attributes.length) {
        throw new SyntaxError(
          `Cannot redefine relationship attributes at position ${tokens[currentTokenIndex].position}, line ${tokens[currentTokenIndex].line}. All relationship attributes should be defined within the same body`
        )
      }
      currentTokenIndex = walkPipeline(
        attributesPipeline,
        tokens,
        ++currentTokenIndex
      )
    } else {
      partEntities.push(
        (currentPartEntity = { structConstraints: {} } as RelPartEntity)
      )
      currentTokenIndex = walkPipeline(
        initialPipeline,
        tokens,
        currentTokenIndex
      )
      currentTokenIndex = walkPipeline(nextPipeline, tokens, currentTokenIndex)
    }
  }

  return {
    partEntities,
    ...(attributes.length && { attributes }),
  }
}

function parseEntity(
  tokens: Tokens,
  currentTokenIndex: number
): [number, EntityNode] {
  const entityNode = {
    type: API.ENTITY,
    start: tokens[currentTokenIndex].position,
  } as EntityNode
  const parsingPipeline: ParsingPipeline = [
    (token) =>
      processIdentifier(token, false, () => (entityNode.name = token.value)),
    (_, tokenIndex) =>
      processBody(tokens, tokenIndex, (bodyStart, bodyEnd) => {
        entityNode.attributes = parseAttributes(tokens, bodyStart, bodyEnd)
        entityNode.end = tokens[bodyEnd + 1].position
      }),
  ]
  const nextTokenIndex = walkPipeline(
    parsingPipeline,
    tokens,
    ++currentTokenIndex
  )

  return [nextTokenIndex, entityNode]
}

function parseWeakEntity(
  tokens: Tokens,
  currentTokenIndex: number
): [number, WeakEntityNode] {
  const weakEntityNode = {
    type: API.WEAK_ENTITY,
    start: tokens[currentTokenIndex].position,
  } as WeakEntityNode
  const parsingPipeline: ParsingPipeline = [
    (token) => assertToken(token, [Keywords.ENTITY]),
    (token) =>
      processIdentifier(
        token,
        false,
        () => (weakEntityNode.name = token.value)
      ),
    (token) => assertToken(token, [Keywords.OWNER]),
    (token) =>
      processIdentifier(
        token,
        true,
        () => (weakEntityNode.owner = token.value)
      ),
    (_, tokenIndex) =>
      processBody(tokens, tokenIndex, (bodyStart, bodyEnd) => {
        weakEntityNode.attributes = parseAttributes(tokens, bodyStart, bodyEnd)
        weakEntityNode.end = tokens[bodyEnd + 1].position
      }),
  ]
  const nextTokenIndex = walkPipeline(
    parsingPipeline,
    tokens,
    ++currentTokenIndex
  )

  return [nextTokenIndex, weakEntityNode]
}

function parseRel(
  tokens: Tokens,
  currentTokenIndex: number
): [number, RelNode] {
  const relNode = {
    type: API.REL,
    start: tokens[currentTokenIndex].position,
  } as RelNode
  const parsingPipeline: ParsingPipeline = [
    (token) =>
      processIdentifier(token, false, () => (relNode.name = token.value)),
    (_, tokenIndex) =>
      processBody(tokens, tokenIndex, (bodyStart, bodyEnd) => {
        relNode.body = parseRelBody(tokens, bodyStart, bodyEnd)
        relNode.end = tokens[bodyEnd + 1].position
      }),
  ]
  const nextTokenIndex = walkPipeline(
    parsingPipeline,
    tokens,
    ++currentTokenIndex
  )

  return [nextTokenIndex, relNode]
}

function parseIdenRel(
  tokens: Tokens,
  currentTokenIndex: number
): [number, RelNode] {
  const idenRelNode = {
    type: API.IDEN_REL,
    start: tokens[currentTokenIndex].position,
  } as RelNode
  const parsingPipeline: ParsingPipeline = [
    (token) => assertToken(token, [Keywords.REL]),
    (token) =>
      processIdentifier(token, false, () => (idenRelNode.name = token.value)),
    (_, tokenIndex) =>
      processBody(tokens, tokenIndex, (bodyStart, bodyEnd) => {
        idenRelNode.body = parseRelBody(tokens, bodyStart, bodyEnd)
        idenRelNode.end = tokens[bodyEnd + 1].position
      }),
  ]
  const nextTokenIndex = walkPipeline(
    parsingPipeline,
    tokens,
    ++currentTokenIndex
  )

  return [nextTokenIndex, idenRelNode]
}

export default function (tokens: Tokens) {
  type InitializerKeyword = keyof typeof parsers
  type ParseFunction = typeof parsers[InitializerKeyword]

  const AST: Node[] = []
  const parsers = {
    [Keywords.ENTITY]: parseEntity,
    [Keywords.WEAK]: parseWeakEntity,
    [Keywords.REL]: parseRel,
    [Keywords.IDEN]: parseIdenRel,
  }

  for (let i = 0, l = tokens.length, currentParser: ParseFunction; i < l;) {
    currentParser = parsers[tokens[i].value as InitializerKeyword]

    if (currentParser === undefined) {
      throw new SyntaxError(
        `Didn't recognize token '${tokens[i].value}' at position ${tokens[i].position}, line ${tokens[i].line}`
      )
    }

    const [nextTokenIndex, node] = currentParser(tokens, i)

    AST.push(node)
    i = nextTokenIndex
  }

  return AST
}

export const testables = {
  parseAttributes,
  parseRelBody,
  parseEntity,
  parseWeakEntity,
  parseRel,
  parseIdenRel,
}
