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
  bodyStartAt: number,
  bodyEndAt: number,
  allowMultipleValuedAttrs = true
): EntityNode["attributes"] {
  return "MOCK ATTRIBUTES"
}

function parseRelBody(
  tokens: Tokens,
  bodyStartAt: number,
  bodyEndAt: number
): RelNode["relBody"] {
  return "MOCK RELATIONSHIP BODY"
}

function parseEntity(
  tokens: Tokens,
  currentTokenIndex: number
): [number, EntityNode] {
  const entityNode = { type: "entity" } as EntityNode
  const parsingPipeline: ParsingPipeline = [
    (token) => processIdentifier(token, () => (entityNode.name = token.value)),
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
      processIdentifier(token, () => (weakEntityNode.name = token.value)),
    (token) => assertToken(token, Keywords.OWNER),
    (token) =>
      processIdentifier(token, () => (weakEntityNode.owner = token.value)),
    (_, tokenIndex) =>
      processBody(
        tokens,
        tokenIndex,
        (bodyStart: number, bodyEnd: number) =>
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
    (token) => processIdentifier(token, () => (relNode.name = token.value)),
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

function parseIdRel(
  tokens: Tokens,
  currentTokenIndex: number
): [number, RelNode] {
  const idRelNode = { type: "iden rel" } as RelNode
  const parsingPipeline: ParsingPipeline = [
    (token) => assertToken(token, Keywords.REL),
    (token) => processIdentifier(token, () => (idRelNode.name = token.value)),
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
  const parsers = {
    [Keywords.ENTITY]: parseEntity,
    [Keywords.WEAK]: parseWeakEntity,
    [Keywords.REL]: parseRel,
    [Keywords.IDEN]: parseIdRel,
  }

  for (let i = 0, l = tokens.length, currentParser; i < l; ) {
    currentParser = parsers[tokens[i].value as keyof typeof parsers]

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
  parseIdRel,
}
