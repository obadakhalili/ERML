import ERMLParser from "erml-parser"
import * as d3 from "d3"
import dagreD3 from "dagre-d3"

import { SnippetRules } from "./Workspace/SnippetExplorer"

export const isNotValidSnippets = (value: any) =>
  value?.constructor !== Array ||
  value.length > SnippetRules.SNIPPETS_MAX_LENGTH ||
  value.some(
    (item) =>
      typeof item?.active !== "boolean" ||
      typeof item?.value !== "string" ||
      typeof item?.name !== "string" ||
      item.name.length > SnippetRules.SNIPPET_MAX_LENGTH ||
      item.name.length < SnippetRules.SNIPPET_MIN_LENGTH
  ) ||
  value
    .map(({ name }) => name)
    .some((name, idx, names) => names.indexOf(name, idx + 1) > -1)

export const isNotValidWorkspaceOptions = (value: any) =>
  value?.constructor !== Object ||
  typeof value.vimEnabled !== "boolean" ||
  typeof value.wordWrapped !== "boolean" ||
  typeof value.minimapDisplayed !== "boolean" ||
  typeof value.splitPaneDefaultSize !== "number" ||
  typeof value.activeViewer !== "string" ||
  typeof value.diagramViewerTransform?.x !== "number" ||
  typeof value.diagramViewerTransform?.y !== "number" ||
  typeof value.diagramViewerTransform?.k !== "number"

export function debounce(fn: Function, timeout = 100) {
  let handle: NodeJS.Timeout
  return (...args: unknown[]) => {
    if (handle) {
      clearTimeout(handle)
    }
    handle = setTimeout(() => fn(...args), timeout)
  }
}

export function mapASTIntoDiagramSchema(AST: ERMLParser.AST) {
  // TODO: Define return types as TS types

  const diagramNodes: Array<{
    id: string
    type: typeof nodeShapeMapper[keyof typeof nodeShapeMapper]
    text: string
    textUnderlined?: boolean
    textDotted?: boolean
  }> = []
  const diagramEdges: Array<{
    src: string
    target: string
    text?: string
    double?: boolean
  }> = []

  const nodeShapeMapper = {
    // Entity type into shape
    entity: "rect",
    "weak entity": "rect double",

    // Relationship type into shape
    rel: "diamond",
    "iden rel": "diamond double",

    // Attribute type into shape
    simple: "ellipse",
    atomic: "ellipse",
    primary: "ellipse",
    partial: "ellipse",
    composite: "ellipse",
    derived: "ellipse dashed",
    multivalued: "ellipse double",
  } as const
  const entityIdMapper: Record<string, string> = {}

  const generateId = () => Math.random().toString(36).substr(2)

  for (const node of AST) {
    const id = generateId()

    diagramNodes.push({
      id,
      type: nodeShapeMapper[node.type],
      text: node.name,
    })

    if (node.type.endsWith(ERMLParser.API.ENTITY)) {
      entityIdMapper[node.name] = id
      mapAttributes((node as ERMLParser.EntityNode).attributes, id)
    }

    if (node.type.endsWith(ERMLParser.API.REL)) {
      const body = (node as ERMLParser.RelNode).body

      for (const entity of body.partEntities) {
        const structConstraints = entity.structConstraints

        diagramEdges.push({
          src: id,
          target: entityIdMapper[entity.name]!,
          text:
            entity.notation === ERMLParser.API.MIN_MAX
              ? `(${structConstraints.partConstraint}, ${structConstraints.cardinalityRatio})`
              : structConstraints.cardinalityRatio.toString(),
          double: structConstraints.partConstraint === ERMLParser.API.TOTAL,
        })
      }

      if (body.attributes) {
        mapAttributes(body.attributes, id)
      }
    }
  }

  return { diagramNodes, diagramEdges }

  function mapAttributes(attributes: ERMLParser.Attributes, root: string) {
    for (const attribute of attributes) {
      const id = generateId()

      diagramNodes.push({
        id,
        type: nodeShapeMapper[attribute.type],
        text: attribute.name,
        textUnderlined: attribute.type === ERMLParser.API.PRIMARY,
        textDotted: attribute.type === ERMLParser.API.PARTIAL,
      })

      diagramEdges.push({
        src: root,
        target: id,
      })

      if (attribute.type === ERMLParser.API.COMPOSITE) {
        mapAttributes(attribute.componentAttributes!, id)
      }
    }
  }
}

export function mapDiagramSchemaIntoDagreSchema(
  diagramSchema: ReturnType<typeof mapASTIntoDiagramSchema>
) {
  const graphSchema = new dagreD3.graphlib.Graph().setGraph({})

  diagramSchema.diagramNodes.forEach(
    ({ id, text, type, textUnderlined, textDotted }) => {
      const [shape, decoration] = type.split(" ")

      graphSchema.setNode(id, {
        shape,
        label: text,
        class: [
          decoration && `${decoration}-node`,
          textUnderlined && "text-underlined-node",

          // FIXME: Sould make text dotted
          textDotted && "text-dotted-node",
        ]
          .filter(Boolean)
          .join(" "),
      })
    }
  )

  diagramSchema.diagramEdges.forEach(({ src, target, text, double }) =>
    graphSchema.setEdge(src, target, {
      label: text,
      class: double && "double-edge",
      arrowhead: "undirected",
      curve: d3.curveBasis,
    })
  )

  return graphSchema
}
