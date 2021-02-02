import {
  ParsingPipeline,
  assertToken,
  processIdentifier,
  processBody,
  walkPipeline,
  testables,
} from "../../engine/parser/pipeline"
import { Token, Tokens } from "../../engine/lexer"

const { bracesMatchAt } = testables

const MOCK_TOKENS = [
  { value: "OWNER", position: 1, line: 1 },
  { value: "1employee", position: 1, line: 1 },
  { value: "employee", position: 1, line: 1 },
  [
    { value: "[", position: 1, line: 1 },
    { value: "}", position: 1, line: 1 },
  ],
  [
    { value: "{", position: 1, line: 1 },
    { value: "{", position: 1, line: 1 },
    { value: "}", position: 1, line: 1 },
  ],
  [
    { value: "{", position: 1, line: 1 },
    { value: "DUMP_TOKEN", position: 1, line: 1 },
    { value: "}", position: 1, line: 1 },
  ],
  [
    { value: "WEAK", position: 1, line: 1 },
    { value: "ENTITY", position: 1, line: 1 },
  ],
]

describe("Tests for assertToken", () => {
  it("Should throw an error indicating that the passed token isn't the same as the expected value", () => {
    expect(() => assertToken(MOCK_TOKENS[0] as Token, "owner")).toThrow(
      'Expected to find "owner" at position 1, line 1. Instead found "OWNER"'
    )
  })

  it("Should not throw an error", () => {
    expect(() => assertToken(MOCK_TOKENS[0] as Token, "OWNER")).not.toThrow()
  })
})

describe("Tests for processIdentifier", () => {
  it("Should throw an error for passing an invalid identifier name", () => {
    expect(() =>
      processIdentifier(MOCK_TOKENS[1] as Token, () => undefined)
    ).toThrow('"1employee" at position 1, line 1 is not a valid identifier')
  })

  it("Should not not throw an error", () => {
    expect(() =>
      processIdentifier(MOCK_TOKENS[2] as Token, () => undefined)
    ).not.toThrow()
  })
})

describe("Tests for processBody", () => {
  it("Should throw an error for passing a non-opening-brace token", () => {
    expect(() =>
      processBody(MOCK_TOKENS[3] as Tokens, 0, () => undefined)
    ).toThrow('Expected to find "{" at position 1, line 1. Instead found "["')
  })

  it("Should throw an error for having non-matching grouping braces", () => {
    expect(() =>
      processBody(MOCK_TOKENS[4] as Tokens, 0, () => undefined)
    ).toThrow(
      'Grouping symbols ("{" and "}") don\'t match after "{" at position 1, line 1'
    )
  })

  it("Should process body successfully", () => {
    expect(
      processBody(MOCK_TOKENS[5] as Tokens, 0, (bodyStart, bodyEnd) => {
        expect(bodyStart).toBe(1)
        expect(bodyEnd).toBe((MOCK_TOKENS[5] as Tokens).length - 2)
      })
    ).toBe((MOCK_TOKENS[5] as Tokens).length)
  })
})

describe("Tests for walkPipeline", () => {
  it("Should throw en error for ending tokens abruptly", () => {
    const parsingPipeline: ParsingPipeline = [
      () => undefined,
      () => undefined,
      () => undefined,
    ]

    expect(() =>
      walkPipeline(parsingPipeline, MOCK_TOKENS[6] as Tokens, 0)
    ).toThrow(
      'Didn\'t expect to reach the end after token "ENTITY" at position 1, line 1'
    )
  })

  it("Should walk through the parsing pipeline, and return the next token index correctly correctly ", () => {
    const parsingPipeline: ParsingPipeline = [
      () => assertToken((MOCK_TOKENS[6] as Tokens)[0], "WEAK"),
      () => assertToken((MOCK_TOKENS[6] as Tokens)[1], "ENTITY"),
    ]

    expect(walkPipeline(parsingPipeline, MOCK_TOKENS[6] as Tokens, 0)).toBe(
      (MOCK_TOKENS[6] as Tokens).length
    )
  })
})

describe("Tests for bracesMatchAt", () => {
  it("Should return null for non-matching grouping braces", () => {
    expect(bracesMatchAt(MOCK_TOKENS[4] as Tokens, 0)).toBe(null)
  })

  it("Should return the correct next token index", () => {
    expect(bracesMatchAt(MOCK_TOKENS[5] as Tokens, 0)).toBe((MOCK_TOKENS[5] as Tokens).length - 1)
  })
})
