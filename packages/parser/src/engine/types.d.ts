declare namespace ERMLParser {
  enum API {
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
    DERIVED = "derived",
    MULTIVALUED = "multivalued",
    COMPOSITE = "composite",
  }

  interface BaseNode {
    name: string
    start: number
    end: number
  }

  interface Attribute {
    name: string
    type:
      | API.SIMPLE
      | API.ATOMIC
      | API.PRIMARY
      | API.PARTIAL
      | API.DERIVED
      | API.MULTIVALUED
      | API.COMPOSITE
    componentAttributes?: Attributes
  }

  type Attributes = Attribute[]

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

  type Node = EntityNode | WeakEntityNode | RelNode

  type AST = Array<Node>
}

declare function ERMLParser(ERML: string): ERMLParser.AST

export = ERMLParser
