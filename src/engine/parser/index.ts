import { Tokens } from "../lexer"
import {
  ParsingPipeline,
  assertToken,
  processIdentifier,
  processBody,
  walkPipeline,
} from "./pipeline"

export const enum Delimiters {
  OPENING_BRACE = "{",
  CLOSING_BRACE = "}",
}

const enum Keywords {
  ENTITY = "ENTITY",
  WEAK = "WEAK",
  OWNER = "OWNER",
  REL = "REL",
  IDEN = "IDEN",
}

interface BaseNode {
  type: "entity" | "weak entity" | "rel" | "iden rel"
  name: string
}

interface RelNode extends BaseNode {
  relBody: "MOCK RELATIONSHIP BODY"
}

interface EntityNode extends BaseNode {
  attributes: "MOCK ATTRIBUTES"
}

interface WeakEntityNode extends EntityNode {
  owner: string
}

type Node = RelNode | EntityNode | WeakEntityNode

function parseEntityBody(
  tokens: Tokens,
  bodyStart: number,
  bodyEnd: number,
  allowMultivalued = true
): EntityNode["attributes"] {
  return "MOCK ATTRIBUTES"
}

function parseRelBody(
  tokens: Tokens,
  bodyStart: number,
  bodyEnd: number
): RelNode["relBody"] {
  return "MOCK RELATIONSHIP BODY"
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
          (entityNode.attributes = parseEntityBody(tokens, bodyStart, bodyEnd))
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
  const weakEntityNode = { type: "weak entity" } as WeakEntityNode
  const parsingPipeline: ParsingPipeline = [
    (token) => assertToken(token, Keywords.ENTITY),
    (token) =>
      processIdentifier(
        token,
        false,
        () => (weakEntityNode.name = token.value)
      ),
    (token) => assertToken(token, Keywords.OWNER),
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
          (weakEntityNode.attributes = parseEntityBody(
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
  const relNode = { type: "rel" } as RelNode
  const parsingPipeline: ParsingPipeline = [
    (token) =>
      processIdentifier(token, false, () => (relNode.name = token.value)),
    (_, tokenIndex) =>
      processBody(
        tokens,
        tokenIndex,
        (bodyStart, bodyEnd) =>
          (relNode.relBody = parseRelBody(tokens, bodyStart, bodyEnd))
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
  const idRelNode = { type: "iden rel" } as RelNode
  const parsingPipeline: ParsingPipeline = [
    (token) => assertToken(token, Keywords.REL),
    (token) =>
      processIdentifier(token, false, () => (idRelNode.name = token.value)),
    (_, tokenIndex) =>
      processBody(
        tokens,
        tokenIndex,
        (bodyStart, bodyEnd) =>
          (idRelNode.relBody = parseRelBody(tokens, bodyStart, bodyEnd))
      ),
  ]
  const nextTokenIndex = walkPipeline(
    parsingPipeline,
    tokens,
    currentTokenIndex
  )

  return [nextTokenIndex, idRelNode]
}

export default function (tokens: Tokens) {
  const AST: Node[] = []

  type InitializerKeyword = keyof typeof parsers
  type ParseUtility = typeof parsers[InitializerKeyword]

  const parsers = {
    [Keywords.ENTITY]: parseEntity,
    [Keywords.WEAK]: parseWeakEntity,
    [Keywords.REL]: parseRel,
    [Keywords.IDEN]: parseIdenRel,
  } as const

  for (let i = 0, l = tokens.length, currentParser: ParseUtility; i < l; ) {
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
