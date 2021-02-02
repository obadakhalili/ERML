import { Tokens } from "../lexer"
import {
  ParsingPipeline,
  assertKeywordProcess,
  parseIdentifierProcess,
  parseBodyProcess,
  walkPipeline,
} from "./pipeline"

const enum Keywords {
  ENTITY = "ENTITY",
  WEAK = "WEAK",
  OWNER = "OWNER",
  REL = "REL",
  ID = "ID",
}

export type Keyword = `${Keywords}`

type InitializerKeyword = Extract<
  Keywords,
  Keywords.ENTITY | Keywords.WEAK | Keywords.REL | Keywords.ID
>

interface BaseNode {
  type: "entity" | "weak entity" | "rel" | "id rel"
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
    (token) =>
      parseIdentifierProcess(token, () => (entityNode.name = token.value)),
    (_, tokenIndex) =>
      parseBodyProcess(
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
    (token) => assertKeywordProcess(token, Keywords.ENTITY),
    (token) =>
      parseIdentifierProcess(token, () => (weakEntityNode.name = token.value)),
    (token) => assertKeywordProcess(token, Keywords.OWNER),
    (token) =>
      parseIdentifierProcess(token, () => (weakEntityNode.owner = token.value)),
    (_, tokenIndex) =>
      parseBodyProcess(
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
    (token) =>
      parseIdentifierProcess(token, () => (relNode.name = token.value)),
    (_, tokenIndex) =>
      parseBodyProcess(
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
  const idRelNode = { type: "id rel" } as RelNode
  const parsingPipeline: ParsingPipeline = [
    (token) => assertKeywordProcess(token, Keywords.REL),
    (token) =>
      parseIdentifierProcess(token, () => (idRelNode.name = token.value)),
    (_, tokenIndex) =>
      parseBodyProcess(
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

  for (
    let currentTokenIndex = 0,
      tokensCount = tokens.length,
      parsers = {
        [Keywords.ENTITY]: parseEntity,
        [Keywords.WEAK]: parseWeakEntity,
        [Keywords.REL]: parseRel,
        [Keywords.ID]: parseIdRel,
      },
      currentParser =
        parsers[tokens[currentTokenIndex]?.value as InitializerKeyword];
    currentTokenIndex < tokensCount;
    currentParser =
      parsers[tokens[currentTokenIndex]?.value as InitializerKeyword]
  ) {
    if (currentParser === undefined) {
      throw new Error(
        `Didn't recognize token "${tokens[currentTokenIndex].value}" at position ${tokens[currentTokenIndex].position}, line ${tokens[currentTokenIndex].line}`
      )
    }

    const [nextTokenIndex, node] = currentParser(tokens, ++currentTokenIndex)

    AST.push(node)
    currentTokenIndex = nextTokenIndex
  }

  return AST
}

export const testables = {
  parseEntity,
  parseWeakEntity,
  parseRel,
  parseIdRel,
}
