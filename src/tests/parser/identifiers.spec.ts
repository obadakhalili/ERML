import {
  isValidIdentifier,
  isValidReference,
  isDuplicateIdentifier,
} from "../../engine/parser/identifiers"

beforeAll(() => {
  isDuplicateIdentifier("User") // isDuplicateIdentifier inserts identifier if it's not a duplicate
})

describe("Tests for isValidIdentifier", () => {
  it("Should return false", () => {
    expect(isValidIdentifier("1employee")).toBe(false)
  })

  it("Should return false", () => {
    expect(isValidIdentifier("a very very very long identifier name")).toBe(
      false
    )
  })

  it("Should return true", () => {
    expect(isValidIdentifier("Employee_table")).toBe(true)
  })
})

describe("Tests for isValidReference", () => {
  it("Should return false", () => {
    expect(isValidReference("a reference that doesn't exist")).toBe(false)
  })

  it("Should return true", () => {
    expect(isValidReference("User")).toBe(true)
  })
})

describe("Tests for isNotDuplicate", () => {
  it("Should return false", () => {
    expect(isDuplicateIdentifier("User")).toBe(true)
  })

  it("Should return true", () => {
    expect(isDuplicateIdentifier("Translation")).toBe(false)
  })
})
