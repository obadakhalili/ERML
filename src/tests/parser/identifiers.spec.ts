import {
  isValidIdentifier,
  isValidReference,
  isDuplicateIdentifier,
} from "../../engine/parser/identifiers"

beforeAll(() => {
  isDuplicateIdentifier("User") // isDuplicateIdentifier inserts identifier if it's not a duplicate
})

describe("tests for isValidIdentifier", () => {
  it("should return false", () => {
    expect(isValidIdentifier("1employee")).toBe(false)
  })

  it("should return false", () => {
    expect(isValidIdentifier("a very very very long identifier name")).toBe(
      false
    )
  })

  it("should return true", () => {
    expect(isValidIdentifier("Employee_table")).toBe(true)
  })
})

describe("tests for isValidReference", () => {
  it("should return false", () => {
    expect(isValidReference("a reference that doesn't exist")).toBe(false)
  })

  it("should return true", () => {
    expect(isValidReference("User")).toBe(true)
  })
})

describe("tests for isNotDuplicate", () => {
  it("should return true", () => {
    expect(isDuplicateIdentifier("User")).toBe(true)
  })

  it("should return false", () => {
    expect(isDuplicateIdentifier("Translation")).toBe(false)
  })
})
