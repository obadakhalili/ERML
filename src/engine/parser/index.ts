import { Tokens } from "../lexer"
import {
  PipelineFunction,
  ParsingPipeline,
  assertToken,
  processNumber,
  processIdentifier,
  processBody,
  walkPipeline,
} from "./pipeline"

export const enum Delimiters {
  OPENING_BRACE = "{",
  CLOSING_BRACE = "}",
  OPENING_ANGLE = "<",
  CLOSING_ANGLE = ">",
  OPENING_PAREN = "(",
  CLOSING_PAREN = ")",
  COMMA = ",",
}

const enum Keywords {
  ENTITY = "ENTITY",
  WEAK = "WEAK",
  OWNER = "OWNER",
  REL = "REL",
  IDEN = "IDEN",
  PARTIAL = "PARTIAL",
  TOTAL = "TOTAL",
  ATTRIBUTES = "ATTRIBUTES",
}

const enum API {
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
}

interface BaseNode {
  name: string
}

type Attributes = "MOCK ATTRIBUTES"

interface EntityNode extends BaseNode {
  type: API.ENTITY
  attributes: Attributes
}

type WeakEntityNode = Omit<EntityNode, "type"> & {
  type: API.WEAK_ENTITY
  owner: string
}

interface RelPartEntity {
  name: string
  notation: API.SEPARATE | API.MIN_MAX
  structConstraints: {
    partConstraint: API.PARTIAL | API.TOTAL | number
    cardinalityRatio: API.ONE | API.N | number
  }
}

type RelPartEntities = RelPartEntity[]

interface RelBody {
  partEntities: RelPartEntities
  attributes?: Attributes
}

interface RelNode extends BaseNode {
  type: API.REL | API.IDEN_REL
  body: RelBody
}

function parseAttributes(
  tokens: Tokens,
  bodyStart: number,
  bodyEnd: number,
  allowMultivalued = true
): Attributes {
  return "MOCK ATTRIBUTES"
}

function parseRelBody(
  tokens: Tokens,
  bodyStart: number,
  bodyEnd: number
): RelBody {
  const partEntities: RelPartEntities = []
  let currentPartEntity: RelPartEntity
  let attributes = "" as Attributes
  let currentTokenIndex = bodyStart

  const common: { [probName: string]: PipelineFunction } = {
    comma: (token) => assertToken(token, [Delimiters.COMMA]),
    optionalComma: (token, tokenIndex) =>
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
            /* Allow multivalued? */
          ))
      ),
    common.optionalComma,
  ]
  const structConstraintsPipeline: { [probName: string]: ParsingPipeline } = {
    separate: [
      (token) =>
        assertToken(
          token,
          [Keywords.PARTIAL, Keywords.TOTAL],
          (matchIndex) =>
            (currentPartEntity.structConstraints.partConstraint = ([
              API.PARTIAL,
              API.TOTAL,
            ] as const)[matchIndex])
        ),
      common.comma,
      (token) => {
        const allowedTokens = [API.ONE, API.N] as const
        assertToken(
          token,
          allowedTokens,
          (matchIndex) =>
            (currentPartEntity.structConstraints.cardinalityRatio =
              allowedTokens[matchIndex])
        )
      },
      (token) => assertToken(token, [Delimiters.CLOSING_ANGLE]),
    ],
    minmax: [
      (token) =>
        processNumber(
          token,
          [0, Infinity],
          (number) =>
            (currentPartEntity.structConstraints.partConstraint = number)
        ),
      common.comma,
      (token) =>
        processNumber(
          token,
          [
            currentPartEntity.structConstraints.partConstraint as number,
            Infinity,
          ],
          (number) =>
            (currentPartEntity.structConstraints.cardinalityRatio = number)
        ),
      (token) => assertToken(token, [Delimiters.CLOSING_PAREN]),
    ],
  }
  const partEntityPipeline: ParsingPipeline = [
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
        (matchIndex) => {
          currentPartEntity.notation =
            matchIndex === 0 ? API.SEPARATE : API.MIN_MAX
          partEntityPipeline.splice(
            2,
            partEntityPipeline.length === 3 ? 0 : 4,
            ...structConstraintsPipeline[
              matchIndex === 0 ? "separate" : "minmax"
            ]
          )
        }
      ),
    common.optionalComma,
  ]

  do {
    if (tokens[currentTokenIndex].value === Keywords.ATTRIBUTES) {
      if (attributes) {
        throw new Error(
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
        partEntityPipeline,
        tokens,
        currentTokenIndex
      )
    }
  } while (bodyEnd > currentTokenIndex)

  return {
    partEntities,
    ...(attributes ? { attributes } : {}),
  }
}

function parseEntity(
  tokens: Tokens,
  currentTokenIndex: number
): [number, EntityNode] {
  const entityNode = { type: API.ENTITY } as EntityNode
  const parsingPipeline: ParsingPipeline = [
    (token) =>
      processIdentifier(token, false, () => (entityNode.name = token.value)),
    (_, tokenIndex) =>
      processBody(
        tokens,
        tokenIndex,
        (bodyStart, bodyEnd) =>
          (entityNode.attributes = parseAttributes(tokens, bodyStart, bodyEnd))
      ),
  ]
  const nextTokenIndex = walkPipeline(
    parsingPipeline,
    tokens,
    currentTokenIndex
  )

  return [nextTokenIndex, entityNode]
}

function parseWeakEntity(
  tokens: Tokens,
  currentTokenIndex: number
): [number, WeakEntityNode] {
  const weakEntityNode = { type: API.WEAK_ENTITY } as WeakEntityNode
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
      processBody(
        tokens,
        tokenIndex,
        (bodyStart, bodyEnd) =>
          (weakEntityNode.attributes = parseAttributes(
            tokens,
            bodyStart,
            bodyEnd
          ))
      ),
  ]
  const nextTokenIndex = walkPipeline(
    parsingPipeline,
    tokens,
    currentTokenIndex
  )

  return [nextTokenIndex, weakEntityNode]
}

function parseRel(
  tokens: Tokens,
  currentTokenIndex: number
): [number, RelNode] {
  const relNode = { type: API.REL } as RelNode
  const parsingPipeline: ParsingPipeline = [
    (token) =>
      processIdentifier(token, false, () => (relNode.name = token.value)),
    (_, tokenIndex) =>
      processBody(
        tokens,
        tokenIndex,
        (bodyStart, bodyEnd) =>
          (relNode.body = parseRelBody(tokens, bodyStart, bodyEnd))
      ),
  ]
  const nextTokenIndex = walkPipeline(
    parsingPipeline,
    tokens,
    currentTokenIndex
  )

  return [nextTokenIndex, relNode]
}

function parseIdenRel(
  tokens: Tokens,
  currentTokenIndex: number
): [number, RelNode] {
  const idenRelNode = { type: API.IDEN_REL } as RelNode
  const parsingPipeline: ParsingPipeline = [
    (token) => assertToken(token, [Keywords.REL]),
    (token) =>
      processIdentifier(token, false, () => (idenRelNode.name = token.value)),
    (_, tokenIndex) =>
      processBody(
        tokens,
        tokenIndex,
        (bodyStart, bodyEnd) =>
          (idenRelNode.body = parseRelBody(tokens, bodyStart, bodyEnd))
      ),
  ]
  const nextTokenIndex = walkPipeline(
    parsingPipeline,
    tokens,
    currentTokenIndex
  )

  return [nextTokenIndex, idenRelNode]
}

export default function (tokens: Tokens) {
  type Node = EntityNode | WeakEntityNode | RelNode
  type InitializerKeyword = keyof typeof parsers
  type ParseFunction = typeof parsers[InitializerKeyword]

  const AST: Node[] = []
  const parsers = {
    [Keywords.ENTITY]: parseEntity,
    [Keywords.WEAK]: parseWeakEntity,
    [Keywords.REL]: parseRel,
    [Keywords.IDEN]: parseIdenRel,
  }

  for (let i = 0, l = tokens.length, currentParser: ParseFunction; i < l; ) {
    currentParser = parsers[tokens[i].value as InitializerKeyword]

    if (currentParser === undefined) {
      throw new Error(
        `Didn't recognize token '${tokens[i].value}' at position ${tokens[i].position}, line ${tokens[i].line}`
      )
    }

    const [nextTokenIndex, node] = currentParser(tokens, ++i)

    AST.push(node)
    i = nextTokenIndex
  }

  return AST
}

export const testables = {
  parseEntity,
  parseWeakEntity,
  parseRel,
  parseIdenRel,
}
