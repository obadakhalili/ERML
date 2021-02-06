import {
  ParsingPipeline,
  assertToken,
  processIdentifier,
  processBody,
  walkPipeline,
  testables,
  processNumber,
} from "../../engine/parser/pipeline"
import { isDuplicateIdentifier } from "../../engine/parser/identifiers"

const { bracesMatchAt } = testables

describe("tests for assertToken", () => {
  it("should throw a syntax error", () => {
    expect(() =>
      assertToken({ value: "foo", position: -1, line: -1 }, ["bar"])
    ).toThrow(SyntaxError)
  })

  it("should invoke callback and pass in the correct matched index", () => {
    const token = { value: "bar", position: -1, line: -1 }
    const expectedValues = ["foo", token.value]
    const callback = jest.fn()
    assertToken(token, expectedValues, callback)
    expect(callback).toHaveBeenCalledWith(expectedValues.indexOf(token.value))
  })
})

describe("tests for processNumber", () => {
  const token = { value: "5", position: -1, line: -1 }
  const numericValue = Number(token.value)

  it("should throw a type error", () => {
    expect(() =>
      processNumber(
        { value: "foo", position: -1, line: -1 },
        [0, 10],
        () => undefined
      )
    ).toThrow(TypeError)
  })

  it("should throw a range error. value below the range", () => {
    expect(() =>
      processNumber(
        token,
        [numericValue + 1, numericValue + 2],
        () => undefined
      )
    ).toThrow(RangeError)
  })

  it("should throw a range error. value above the range", () => {
    expect(() =>
      processNumber(
        token,
        [numericValue - 2, numericValue - 1],
        () => undefined
      )
    ).toThrow(RangeError)
  })

  it("should invoke callback and pass in the correct numerical value", () => {
    const callback = jest.fn()
    processNumber(token, [numericValue - 1, numericValue + 1], callback)
    expect(callback).toHaveBeenCalledWith(numericValue)
  })
})

describe("tests for processIdentifier", () => {
  it("should throw a syntax error. not a valid identifier", () => {
    expect(() =>
      processIdentifier(
        { value: "1foo", position: -1, line: -1 },
        false,
        () => undefined
      )
    ).toThrow(SyntaxError)
  })

  it("should throw a reference error", () => {
    expect(() =>
      processIdentifier(
        { value: "foo", position: -1, line: -1 },
        true,
        () => undefined
      )
    ).toThrow(ReferenceError)
  })

  it("should throw a syntax error. identifier already defined", () => {
    isDuplicateIdentifier("foo")
    expect(() =>
      processIdentifier(
        { value: "foo", position: -1, line: -1 },
        false,
        () => undefined
      )
    ).toThrow(SyntaxError)
  })

  it("should invoke callback", () => {
    const callback = jest.fn()
    processIdentifier({ value: "bar", position: -1, line: -1 }, false, callback)
    expect(callback).toHaveBeenCalled()
  })
})

describe("tests for processBody", () => {
  it('should throw a syntax error. value is not "{"', () => {
    const tokens = [{ value: "<", position: -1, line: -1 }]
    expect(() => processBody(tokens, 0, () => undefined)).toThrow(SyntaxError)
  })

  it("should throw a syntax error. grouping braces don't match", () => {
    const tokens = [{ value: "{", position: -1, line: -1 }]
    expect(() => processBody(tokens, 0, () => undefined)).toThrow(SyntaxError)
  })

  it("should throw a syntax error. body is empty", () => {
    const tokens = [
      { value: "{", position: -1, line: -1 },
      { value: "}", position: -1, line: -1 },
    ]
    expect(() => processBody(tokens, 0, () => undefined)).toThrow(SyntaxError)
  })

  it("should invoke callback and pass in the correct the bodyStart and bodyEnd indexes", () => {
    const tokens = [
      { value: "{", position: -1, line: -1 },
      { value: "foo", position: -1, line: -1 },
      { value: "}", position: -1, line: -1 },
    ]
    const callback = jest.fn()
    processBody(tokens, 0, callback)
    expect(callback).toHaveBeenCalledWith(1, tokens.length - 2)
  })
})

describe("tests for walkPipeline", () => {
  const tokens = [
    { value: "foo", position: -1, line: -1 },
    { value: "bar", position: -1, line: -1 },
  ]
  const parsingPipeline: ParsingPipeline = [
    () => undefined,
    () => undefined,
    () => undefined,
  ]

  it("should throw a syntax error. unexpected reach of end", () => {
    expect(() => walkPipeline(parsingPipeline, tokens, 0)).toThrow(SyntaxError)
  })

  it("should walk through the parsing pipeline, and return the next token index correctly ", () => {
    parsingPipeline.pop()
    expect(walkPipeline(parsingPipeline, tokens, 0)).toBe(tokens.length)
  })
})

describe("tests for bracesMatchAt", () => {
  const tokens = [
    { value: "{", position: -1, line: -1 },
    { value: "{", position: -1, line: -1 },
    { value: "}", position: -1, line: -1 },
  ]

  it("should return null for non-matching grouping braces", () => {
    expect(bracesMatchAt(tokens, 0)).toBe(null)
  })

  it("Should return the correct index in which braces matched at", () => {
    tokens.shift()
    expect(bracesMatchAt(tokens, 0)).toBe(tokens.length - 1)
  })
})
