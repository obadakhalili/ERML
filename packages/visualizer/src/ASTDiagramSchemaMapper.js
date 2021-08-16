export default function mapASTIntoDiagramSchema(AST) {
  const diagramNodes = []
  const diagramLinks = []

  const nodeShapeMapper = {
    // Entity type into shape
    entity: "rect",
    "weak entity": "rect",

    // Relationship type into shape
    rel: "diamond",
    "iden rel": "double diamond",

    // Attribute type into shape
    simple: "oval",
    atomic: "oval",
    primary: "oval",
    partial: "oval",
    composite: "oval",
    derived: "dotted oval",
    multivalued: "double oval",
  }
  const entityIdMapper = {}

  for (const node of AST) {
    const id = generateId()

    diagramNodes.push({
      id,
      type: nodeShapeMapper[node.type],
      text: node.name,
    })

    if (node.type.endsWith("entity")) {
      entityIdMapper[node.name] = id
      mapAttributes(node.attributes, id)
    }

    if (node.type.endsWith("rel")) {
      const body = node.body

      for (const entity of body.partEntities) {
        const structConstraints = entity.structConstraints

        diagramLinks.push({
          src: id,
          target: entityIdMapper[entity.name],
          text:
            entity.notation === "min-max"
              ? `(${structConstraints.partConstraint}, ${structConstraints.cardinalityRatio})`
              : structConstraints.cardinalityRatio,
          double: structConstraints.partConstraint === "total",
        })
      }

      if (body.attributes) {
        mapAttributes(body.attributes, id)
      }
    }
  }

  return { diagramNodes, diagramLinks }

  function mapAttributes(attributes, root) {
    for (const attribute of attributes) {
      const id = generateId()

      diagramNodes.push({
        id,
        type: nodeShapeMapper[attribute.type],
        text: attribute.name,
        textUnderlined: attribute.type === "primary",
        textDotted: attribute.type === "partial",
      })

      diagramLinks.push({
        src: root,
        target: id,
      })

      if (attribute.type === "composite") {
        mapAttributes(attribute.componentAttributes, id)
      }
    }
  }

  function generateId() {
    return Math.random().toString(36).substr(2)
  }
}
