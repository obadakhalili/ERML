import { Tokens } from "../lexer"
import {
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
  TOTAl = "TOTAL",
  PARTIAL = "PARTIAL",
  N = "N",
  ATTRIBUTES = "ATTRIBUTES",
}

interface BaseNode {
  name: string
}

interface EntityNode extends BaseNode {
  type: "entity"
  attributes: "MOCK ATTRIBUTES"
}

type Attributes = EntityNode["attributes"]

type WeakEntityNode = Omit<EntityNode, "type"> & {
  type: "weak entity"
  owner: string
}

interface RelNode extends BaseNode {
  type: "rel" | "iden rel"
  body: {
    partEntities: ({ name: string } & (
      | { notation: "min-max"; constraints: [number, number] }
      | {
          notation: "separate"
          constraints: ["total" | "partial", "1" | "N"]
        }
    ))[]
    attributes?: Attributes
  }
}

type RelNodeBody = RelNode["body"]
type RelNodePartEntities = RelNodeBody["partEntities"]
type RelNodePartEntity = RelNodePartEntities[0]

type Node = EntityNode | WeakEntityNode | RelNode

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
): RelNodeBody {
  const partEntities: RelNodePartEntities = []
  let currentPartEntity: RelNodePartEntity
  let relAttributes = "" as Attributes
  let currentTokenIndex = bodyStart

  const attributesPipeline: ParsingPipeline = [
    (_, tokenIndex) =>
      processBody(
        tokens,
        tokenIndex,
        (attributesBodyStart, attributesBodyEnd) =>
          (relAttributes = parseAttributes(
            tokens,
            attributesBodyStart,
            attributesBodyEnd
            /* Allow multivalued? */
          ))
      ),
    (token, tokenIndex) =>
      tokenIndex > bodyEnd ? undefined : assertToken(token, [Delimiters.COMMA]),
  ]
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
        (matchIndex: number) => {
          if (matchIndex === 0) {
            currentPartEntity.notation = "separate"
            partEntityPipeline.splice(
              2,
              partEntityPipeline.length === 3 ? 0 : 4,
              (token) =>
                assertToken(
                  token,
                  [Keywords.TOTAl, Keywords.PARTIAL],
                  () =>
                    (currentPartEntity.constraints[0] = token.value.toLowerCase() as
                      | "total"
                      | "partial")
                ),
              (token) => assertToken(token, [Delimiters.COMMA]),
              (token) =>
                assertToken(
                  token,
                  ["1", "N"],
                  () =>
                    (currentPartEntity.constraints[1] = token.value as
                      | "1"
                      | "N")
                ),
              (token) => assertToken(token, [Delimiters.CLOSING_ANGLE])
            )
          } else {
            currentPartEntity.notation = "min-max"
            partEntityPipeline.splice(
              2,
              partEntityPipeline.length === 3 ? 0 : 4,
              (token) =>
                processNumber(token, [0, Infinity], (number) => {
                  currentPartEntity.constraints[0] = number
                }),
              (token) => assertToken(token, [Delimiters.COMMA]),
              (token) =>
                processNumber(
                  token,
                  [currentPartEntity.constraints[0] as number, Infinity],
                  (number) => {
                    currentPartEntity.constraints[1] = number
                  }
                ),
              (token) => assertToken(token, [Delimiters.CLOSING_PAREN])
            )
          }
        }
      ),
    (token, tokenIndex) =>
      tokenIndex > bodyEnd ? undefined : assertToken(token, [Delimiters.COMMA]),
  ]

  do {
    if (tokens[currentTokenIndex].value === Keywords.ATTRIBUTES) {
      if (relAttributes) {
        throw new Error(
          `Cannot redefine relationship attributes at position ${tokens[currentTokenIndex].position}, line ${tokens[currentTokenIndex].line}. All relationship attributes should be defined within the same body`
        )
      }
      currentTokenIndex = walkPipeline(
        tokens,
        ++currentTokenIndex,
        attributesPipeline
      )
    } else {
      partEntities.push(
        (currentPartEntity = { constraints: [-1, -1] } as RelNodePartEntity)
      )
      currentTokenIndex = walkPipeline(
        tokens,
        currentTokenIndex,
        partEntityPipeline
      )
    }
  } while (currentTokenIndex < bodyEnd)

  return {
    partEntities,
    ...(relAttributes ? { relAttributes } : {}),
  }
}

function parseEntity(
  tokens: Tokens,
  currentTokenIndex: number
): [number, EntityNode] {
  const entityNode = { type: "entity" } as EntityNode
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
    tokens,
    currentTokenIndex,
    parsingPipeline
  )

  return [nextTokenIndex, entityNode]
}

function parseWeakEntity(
  tokens: Tokens,
  currentTokenIndex: number
): [number, WeakEntityNode] {
  const weakEntityNode = { type: "weak entity" } as WeakEntityNode
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
    tokens,
    currentTokenIndex,
    parsingPipeline
  )

  return [nextTokenIndex, weakEntityNode]
}

function parseRel(
  tokens: Tokens,
  currentTokenIndex: number
): [number, RelNode] {
  const relNode = { type: "rel" } as RelNode
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
    tokens,
    currentTokenIndex,
    parsingPipeline
  )

  return [nextTokenIndex, relNode]
}

function parseIdenRel(
  tokens: Tokens,
  currentTokenIndex: number
): [number, RelNode] {
  const idRelNode = { type: "iden rel" } as RelNode
  const parsingPipeline: ParsingPipeline = [
    (token) => assertToken(token, [Keywords.REL]),
    (token) =>
      processIdentifier(token, false, () => (idRelNode.name = token.value)),
    (_, tokenIndex) =>
      processBody(
        tokens,
        tokenIndex,
        (bodyStart, bodyEnd) =>
          (idRelNode.body = parseRelBody(tokens, bodyStart, bodyEnd))
      ),
  ]
  const nextTokenIndex = walkPipeline(
    tokens,
    currentTokenIndex,
    parsingPipeline
  )

  return [nextTokenIndex, idRelNode]
}

export default function (tokens: Tokens) {
  const AST: Node[] = []

  type InitializerKeyword = keyof typeof parsers
  type ParseFunction = typeof parsers[InitializerKeyword]

  const parsers = {
    [Keywords.ENTITY]: parseEntity,
    [Keywords.WEAK]: parseWeakEntity,
    [Keywords.REL]: parseRel,
    [Keywords.IDEN]: parseIdenRel,
  } as const

  for (let i = 0, l = tokens.length, currentParser: ParseFunction; i < l; ) {
    currentParser = parsers[tokens[i].value as InitializerKeyword]

    if (currentParser === undefined) {
      throw new Error(
        `Didn't recognize token "${tokens[i].value}" at position ${tokens[i].position}, line ${tokens[i].line}`
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
