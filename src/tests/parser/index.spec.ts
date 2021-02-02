import parse, { testables } from "../../engine/parser"

const { parseEntity, parseWeakEntity, parseRel, parseIdRel } = testables

const MOCK_TOKENS = [
  [
    [{ value: "1Employee", position: 1, line: 1 }],
    [
      { value: "Employee", position: 1, line: 1 },
      { value: "{", position: 1, line: 1 },
    ],
    [
      { value: "Employee", position: 1, line: 1 },
      { value: "{", position: 1, line: 1 },
      { value: "}", position: 1, line: 1 },
    ],
  ],
  [
    [{ value: "ENTII", position: 1, line: 1 }],
    [
      { value: "ENTITY", position: 1, line: 1 },
      { value: "1Dependent", position: 1, line: 1 },
    ],
    [
      { value: "ENTITY", position: 1, line: 1 },
      { value: "Dependent", position: 1, line: 1 },
      { value: "OWNE", position: 1, line: 1 },
    ],
    [
      { value: "ENTITY", position: 1, line: 1 },
      { value: "Dependent", position: 1, line: 1 },
      { value: "OWNER", position: 1, line: 1 },
      { value: "1Employee", position: 1, line: 1 },
    ],
    [
      { value: "ENTITY", position: 1, line: 1 },
      { value: "Dependent", position: 1, line: 1 },
      { value: "OWNER", position: 1, line: 1 },
      { value: "Employee", position: 1, line: 1 },
      { value: "{", position: 1, line: 1 },
    ],
    [
      { value: "ENTITY", position: 1, line: 1 },
      { value: "Dependent", position: 1, line: 1 },
      { value: "OWNER", position: 1, line: 1 },
      { value: "Employee", position: 1, line: 1 },
      { value: "{", position: 1, line: 1 },
      { value: "}", position: 1, line: 1 },
    ],
  ],
  [
    [{ value: "1Works_for", position: 1, line: 1 }],
    [
      { value: "Works_for", position: 1, line: 1 },
      { value: "{", position: 1, line: 1 },
    ],
    [
      { value: "Works_for", position: 1, line: 1 },
      { value: "{", position: 1, line: 1 },
      { value: "}", position: 1, line: 1 },
    ],
  ],
  [
    [{ value: "EL", position: 1, line: 1 }],
    [
      { value: "REL", position: 1, line: 1 },
      { value: "1Dependents_of", position: 1, line: 1 },
    ],
    [
      { value: "REL", position: 1, line: 1 },
      { value: "Dependents_of", position: 1, line: 1 },
      { value: "{", position: 1, line: 1 },
    ],
    [
      { value: "REL", position: 1, line: 1 },
      { value: "Dependents_of", position: 1, line: 1 },
      { value: "{", position: 1, line: 1 },
      { value: "}", position: 1, line: 1 },
    ],
  ],
  [
    [{ value: "FOO", position: 1, line: 1 }],
    [
      { value: "ENTITY", position: 1, line: 1 },
      { value: "Employee", position: 1, line: 1 },
      { value: "{", position: 1, line: 1 },
      { value: "}", position: 1, line: 1 },
      { value: "WEAK", position: 1, line: 1 },
      { value: "ENTITYs", position: 1, line: 1 },
      { value: "Dependent", position: 1, line: 1 },
    ],
    [],
    [
      { value: "ENTITY", position: 1, line: 1 },
      { value: "Employee", position: 1, line: 1 },
      { value: "{", position: 1, line: 1 },
      { value: "}", position: 1, line: 1 },
      { value: "WEAK", position: 1, line: 1 },
      { value: "ENTITY", position: 1, line: 1 },
      { value: "Dependent", position: 1, line: 1 },
      { value: "OWNER", position: 1, line: 1 },
      { value: "Employee", position: 1, line: 1 },
      { value: "{", position: 1, line: 1 },
      { value: "}", position: 1, line: 1 },
      { value: "REL", position: 1, line: 1 },
      { value: "Works_for", position: 1, line: 1 },
      { value: "{", position: 1, line: 1 },
      { value: "}", position: 1, line: 1 },
      { value: "ID", position: 1, line: 1 },
      { value: "REL", position: 1, line: 1 },
      { value: "Dependents_of", position: 1, line: 1 },
      { value: "{", position: 1, line: 1 },
      { value: "}", position: 1, line: 1 },
    ],
  ],
]

describe("Tests for parseEntity", () => {
  it("Should throw an error for trying to parse an unvalid identifier token", () => {
    expect(() => parseEntity(MOCK_TOKENS[0][0], 0)).toThrow(
      '"1Employee" at position 1, line 1 is not a valid identifier'
    )
  })

  it("Should throw an error for having non-matching grouping braces", () => {
    expect(() => parseEntity(MOCK_TOKENS[0][1], 0)).toThrow(
      'Grouping symbols ("{" and "}") don\'t match after "{" at position 1, line 1'
    )
  })

  it("Should generate valid AST for entity tokens, and return the correct next token index", () => {
    expect(parseEntity(MOCK_TOKENS[0][2], 0)).toEqual([
      MOCK_TOKENS[0][2].length,
      {
        type: "entity",
        name: "Employee",
        attributes: "MOCK ATTRIBUTES",
      },
    ])
  })
})

describe("Tests for parseWeakEntity", () => {
  it("Should throw an error for trying to parse an unvalid keyword token (valid token is ENTITY)", () => {
    expect(() => parseWeakEntity(MOCK_TOKENS[1][0], 0)).toThrow(
      'Expected to find "ENTITY" at position 1, line 1. Instead found "ENTII"'
    )
  })

  it("Should throw an error for trying to parse an unvalid identifier token", () => {
    expect(() => parseWeakEntity(MOCK_TOKENS[1][1], 0)).toThrow(
      '"1Dependent" at position 1, line 1 is not a valid identifier'
    )
  })

  it("Should throw an error for trying to parse an unvalid keyword token (valid token is OWNER)", () => {
    expect(() => parseWeakEntity(MOCK_TOKENS[1][2], 0)).toThrow(
      'Expected to find "OWNER" at position 1, line 1. Instead found "OWNE"'
    )
  })

  it("Should throw an error for trying to parse an unvalid identifier token", () => {
    expect(() => parseWeakEntity(MOCK_TOKENS[1][3], 0)).toThrow(
      '"1Employee" at position 1, line 1 is not a valid identifier'
    )
  })

  it("Should throw an error for having non-matching grouping braces", () => {
    expect(() => parseWeakEntity(MOCK_TOKENS[1][4], 0)).toThrow(
      'Grouping symbols ("{" and "}") don\'t match after "{" at position 1, line 1'
    )
  })

  it("Should generate valid AST for weak entity tokens, and return the correct next token index", () => {
    expect(parseWeakEntity(MOCK_TOKENS[1][5], 0)).toEqual([
      MOCK_TOKENS[1][5].length,
      {
        type: "weak entity",
        name: "Dependent",
        owner: "Employee",
        attributes: "MOCK ATTRIBUTES",
      },
    ])
  })
})

describe("Tests for parseRel", () => {
  it("Should throw an error for trying to parse an unvalid identifier token", () => {
    expect(() => parseRel(MOCK_TOKENS[2][0], 0)).toThrow(
      '"1Works_for" at position 1, line 1 is not a valid identifier'
    )
  })

  it("Should throw an error for having non-matching grouping braces", () => {
    expect(() => parseRel(MOCK_TOKENS[2][1], 0)).toThrow(
      'Grouping symbols ("{" and "}") don\'t match after "{" at position 1, line 1'
    )
  })

  it("Should generate valid AST for relationship tokens, and return the correct next token index", () => {
    expect(parseRel(MOCK_TOKENS[2][2], 0)).toEqual([
      MOCK_TOKENS[2][2].length,
      {
        type: "rel",
        name: "Works_for",
        relBody: "MOCK RELATIONSHIP BODY",
      },
    ])
  })
})

describe("Tests for parseIdRel", () => {
  it("Should throw an error for trying to parse an unvalid keyword token (valid token is REL)", () => {
    expect(() => parseIdRel(MOCK_TOKENS[3][0], 0)).toThrow(
      'Expected to find "REL" at position 1, line 1. Instead found "EL"'
    )
  })

  it("Should throw an error for trying to parse an unvalid identifier token", () => {
    expect(() => parseIdRel(MOCK_TOKENS[3][1], 0)).toThrow(
      '"1Dependents_of" at position 1, line 1 is not a valid identifier'
    )
  })

  it("Should throw an error for having non-matching grouping braces", () => {
    expect(() => parseIdRel(MOCK_TOKENS[3][2], 0)).toThrow(
      'Grouping symbols ("{" and "}") don\'t match after "{" at position 1, line 1'
    )
  })

  it("Should generate valid AST for weak entity tokens, and return the correct next token index", () => {
    expect(parseIdRel(MOCK_TOKENS[3][3], 0)).toEqual([
      MOCK_TOKENS[3][3].length,
      {
        type: "id rel",
        name: "Dependents_of",
        relBody: "MOCK RELATIONSHIP BODY",
      },
    ])
  })
})

describe("Tests for parser", () => {
  it("should throw en error for trying to parse an unrecognizable token", () => {
    expect(() => parse(MOCK_TOKENS[4][0])).toThrow(
      'Didn\'t recognize token "FOO" at position 1, line 1'
    )
  })

  it("Should throw an error for trying to parse an unvalid keyword token of weak entity (valid token is ENTITY)", () => {
    expect(() => parse(MOCK_TOKENS[4][1])).toThrow(
      'Expected to find "ENTITY" at position 1, line 1. Instead found "ENTITYs"'
    )
  })

  it("Should return an empty array for passing an empty tokens array", () => {
    expect(parse(MOCK_TOKENS[4][2])).toEqual([])
  })

  it("Should parse tokens successfully", () => {
    expect(parse(MOCK_TOKENS[4][3])).toEqual([
      { type: "entity", name: "Employee", attributes: "MOCK ATTRIBUTES" },
      {
        type: "weak entity",
        name: "Dependent",
        owner: "Employee",
        attributes: "MOCK ATTRIBUTES",
      },
      { type: "rel", name: "Works_for", relBody: "MOCK RELATIONSHIP BODY" },
      {
        type: "id rel",
        name: "Dependents_of",
        relBody: "MOCK RELATIONSHIP BODY",
      },
    ])
  })
})
