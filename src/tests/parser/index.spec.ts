import parse, { testables } from "../../engine/parser"
import tokenize from "../../engine/lexer"
import { isDuplicateIdentifier } from "../../engine/parser/identifiers"

const {
  parseAttributes,
  parseRelBody,
  parseEntity,
  parseWeakEntity,
  parseRel,
  parseIdenRel,
} = testables

describe("tests for parser", () => {
  it("should throw a syntax error", () => {
    expect(() => parse(tokenize("FOO"))).toThrow(SyntaxError)
  })

  it("should return empty nodes array for empty tokens array", () => {
    expect(parse([])).toEqual([])
  })
})

describe("tests for parseAttributes", () => {
  it("should throw a syntax error", () => {
    const tokens = tokenize(`ENTITY Foo {
      COMPOSITE "full_name" {
        MULTIVALUED "first_name"
      }
    }`)
    expect(() => parseAttributes(tokens, 3, tokens.length - 2)).toThrow(
      SyntaxError
    )
  })

  it("should parse valid tokens", () => {
    const tokens = tokenize(`ENTITY Bar {
      PRIMARY "SSN",
      SIMPLE "salary",
      SIMPLE "DoB",
      DERIVED "age",
      COMPOSITE "full_name" {
        SIMPLE "first_name",
        SIMPLE "last_name"
      }
    }`)
    expect(parseAttributes(tokens, 3, tokens.length - 3)).toMatchSnapshot()
  })
})

describe("tests for parseRelBody", () => {
  it("should throw a syntax error", () => {
    isDuplicateIdentifier("Part_entity_1")
    isDuplicateIdentifier("Part_entity_2")
    const tokens = tokenize(`REL Rel_name {
      ATTRIBUTES {
        SIMPLE "hours"
      },
      Part_entity_1 <PARTIAL, N>,
      Part_entity_2 <TOTAL, N>,
      ATTRIBUTES {
        SIMPLE "hours"
      }
    }`)
    expect(() => parseRelBody(tokens, 3, tokens.length - 2)).toThrow(
      SyntaxError
    )
  })

  it("should parse valid tokens", () => {
    isDuplicateIdentifier("Part_entity_1")
    isDuplicateIdentifier("Part_entity_2")
    const tokens = tokenize(`REL Rel_name {
      Part_entity_1 <PARTIAL, N>,
      Part_entity_2 <TOTAL, N>,
      ATTRIBUTES {
        SIMPLE "hours"
      }, // Trailing comma is allowed
    }`)
    expect(parseRelBody(tokens, 3, tokens.length - 3)).toMatchSnapshot()
  })
})

describe("test for parseEntity", () => {
  it("should parse valid tokens", () => {
    const tokens = tokenize(`ENTITY User {
      PRIMARY "SSN",
      SIMPLE "salary",
      SIMPLE "DoB",
      DERIVED "age",
      COMPOSITE "full_name" {
        SIMPLE "first_name",
        SIMPLE "last_name"
      }
    }`)
    expect(parseEntity(tokens, 1)).toMatchSnapshot()
  })
})

describe("test for parseWeakEntity", () => {
  it("should parse valid tokens", () => {
    isDuplicateIdentifier("Father")
    const tokens = tokenize(`WEAK ENTITY Son OWNER Father {
      COMPOSITE "key" {
        SIMPLE "name",
        SIMPLE "DoB"
      },
      SIMPLE "relationship",
      SIMPLE "gender"
    }`)
    expect(parseWeakEntity(tokens, 1)).toMatchSnapshot()
  })
})

describe("test for parseRel", () => {
  it("should parse valid tokens", () => {
    isDuplicateIdentifier("Foo")
    isDuplicateIdentifier("Bar")
    const tokens = tokenize(`REL Rel_name {
      Foo <PARTIAL, 1>,
      Bar <TOTAL, 1>,
      ATTRIBUTES {
        SIMPLE "start_date"
      }
    }`)
    expect(parseRel(tokens, 1)).toMatchSnapshot()
  })
})

describe("test for parseIdenRel", () => {
  it("should parse valid tokens", () => {
    isDuplicateIdentifier("Fizz")
    isDuplicateIdentifier("Buzz")
    const tokens = tokenize(`IDEN REL Iden_rel_name {
      Fizz <PARTIAL, 1>,
      Buzz <TOTAL, N>
    }`)
    expect(parseIdenRel(tokens, 1)).toMatchSnapshot()
  })
})
