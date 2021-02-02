import tokenize from "../engine/lexer"

const MOCK_CODE = [
  "",
  `WEEK ENTITY OWNER Employee
    COMPOSITE "key" ["name" "DoB"],
    SIMPLE "relationship,
    SIMPLE "gender"
  }`,
  `ENTITY Employee {
    PRIMARY "SSN",
    SIMPLE "salary",
    SIMPLE "DoB",
    DERIVED "age",
    COMPOSITE "full_name" ["first_name", "last_name"]
  }`,
  `WEAK ENTITY Dependent OWNER Employee {
    COMPOSITE PARTIAL "key" ["name", "DoB"],
    SIMPLE "relationship",
    SIMPLE "gender"
  }`,
  `REL Works_for {
    Employee (1, 1),
    Department (20, N)
  }`,
  `ID REL Dependents_of {
    Employee <PARTIAL, 1>
    Dependent <TOTAL, N>
  }`,
  `ID REL Dependents_of {
    # Employee <PARTIAL, 1>
    Dependent <TOTAL, N>
  }`,
  `ENTITY Employee {
    PRIMARY "SSN",
    /* SIMPLE "salary",
    SIMPLE "DoB",
    DERIVED "age", */
    COMPOSITE "full_name" ["first_name", "last_name"]
  }`,
]

describe("Tests for lexer", () => {
  it("Should return empty array if code is empty string", () => {
    expect(tokenize(MOCK_CODE[0])).toEqual([])
  })

  it("Should correctly generate tokens even if the code can't be parsed correctly", () => {
    expect(tokenize(MOCK_CODE[1])).toEqual([
      { value: "WEEK", position: 0, line: 1 },
      { value: "ENTITY", position: 5, line: 1 },
      { value: "OWNER", position: 12, line: 1 },
      { value: "Employee", position: 18, line: 1 },
      { value: "COMPOSITE", position: 31, line: 2 },
      { value: '"key"', position: 41, line: 2 },
      { value: "[", position: 47, line: 2 },
      { value: '"name"', position: 48, line: 2 },
      { value: '"DoB"', position: 55, line: 2 },
      { value: "]", position: 60, line: 2 },
      { value: ",", position: 61, line: 2 },
      { value: "SIMPLE", position: 67, line: 3 },
      { value: '"relationship,\n    SIMPLE "', position: 74, line: 3 },
      { value: "gender", position: 101, line: 4 },
      { value: "}", position: 111, line: 5 },
    ])
  })

  it("Should return valid tokens of entity", () => {
    expect(tokenize(MOCK_CODE[2])).toEqual([
      { value: "ENTITY", position: 0, line: 1 },
      { value: "Employee", position: 7, line: 1 },
      { value: "{", position: 16, line: 1 },
      { value: "PRIMARY", position: 22, line: 2 },
      { value: '"SSN"', position: 30, line: 2 },
      { value: ",", position: 35, line: 2 },
      { value: "SIMPLE", position: 41, line: 3 },
      { value: '"salary"', position: 48, line: 3 },
      { value: ",", position: 56, line: 3 },
      { value: "SIMPLE", position: 62, line: 4 },
      { value: '"DoB"', position: 69, line: 4 },
      { value: ",", position: 74, line: 4 },
      { value: "DERIVED", position: 80, line: 5 },
      { value: '"age"', position: 88, line: 5 },
      { value: ",", position: 93, line: 5 },
      { value: "COMPOSITE", position: 99, line: 6 },
      { value: '"full_name"', position: 109, line: 6 },
      { value: "[", position: 121, line: 6 },
      { value: '"first_name"', position: 122, line: 6 },
      { value: ",", position: 134, line: 6 },
      { value: '"last_name"', position: 136, line: 6 },
      { value: "]", position: 147, line: 6 },
      { value: "}", position: 151, line: 7 },
    ])
  })

  it("Should return valid tokens of weak entity", () => {
    expect(tokenize(MOCK_CODE[3])).toEqual([
      { value: "WEAK", position: 0, line: 1 },
      { value: "ENTITY", position: 5, line: 1 },
      { value: "Dependent", position: 12, line: 1 },
      { value: "OWNER", position: 22, line: 1 },
      { value: "Employee", position: 28, line: 1 },
      { value: "{", position: 37, line: 1 },
      { value: "COMPOSITE", position: 43, line: 2 },
      { value: "PARTIAL", position: 53, line: 2 },
      { value: '"key"', position: 61, line: 2 },
      { value: "[", position: 67, line: 2 },
      { value: '"name"', position: 68, line: 2 },
      { value: ",", position: 74, line: 2 },
      { value: '"DoB"', position: 76, line: 2 },
      { value: "]", position: 81, line: 2 },
      { value: ",", position: 82, line: 2 },
      { value: "SIMPLE", position: 88, line: 3 },
      { value: '"relationship"', position: 95, line: 3 },
      { value: ",", position: 109, line: 3 },
      { value: "SIMPLE", position: 115, line: 4 },
      { value: '"gender"', position: 122, line: 4 },
      { value: "}", position: 133, line: 5 },
    ])
  })

  it("Should return valid tokens of relationship", () => {
    expect(tokenize(MOCK_CODE[4])).toEqual([
      { value: "REL", position: 0, line: 1 },
      { value: "Works_for", position: 4, line: 1 },
      { value: "{", position: 14, line: 1 },
      { value: "Employee", position: 20, line: 2 },
      { value: "(", position: 29, line: 2 },
      { value: "1", position: 30, line: 2 },
      { value: ",", position: 31, line: 2 },
      { value: "1", position: 33, line: 2 },
      { value: ")", position: 34, line: 2 },
      { value: ",", position: 35, line: 2 },
      { value: "Department", position: 41, line: 3 },
      { value: "(", position: 52, line: 3 },
      { value: "20", position: 53, line: 3 },
      { value: ",", position: 55, line: 3 },
      { value: "N", position: 57, line: 3 },
      { value: ")", position: 58, line: 3 },
      { value: "}", position: 62, line: 4 },
    ])
  })

  it("Should return valid tokens of identifying relationship", () => {
    expect(tokenize(MOCK_CODE[5])).toEqual([
      { value: "ID", position: 0, line: 1 },
      { value: "REL", position: 3, line: 1 },
      { value: "Dependents_of", position: 7, line: 1 },
      { value: "{", position: 21, line: 1 },
      { value: "Employee", position: 27, line: 2 },
      { value: "<", position: 36, line: 2 },
      { value: "PARTIAL", position: 37, line: 2 },
      { value: ",", position: 44, line: 2 },
      { value: "1", position: 46, line: 2 },
      { value: ">", position: 47, line: 2 },
      { value: "Dependent", position: 53, line: 3 },
      { value: "<", position: 63, line: 3 },
      { value: "TOTAL", position: 64, line: 3 },
      { value: ",", position: 69, line: 3 },
      { value: "N", position: 71, line: 3 },
      { value: ">", position: 72, line: 3 },
      { value: "}", position: 76, line: 4 },
    ])
  })

  it("Should skip one-line comments", () => {
    expect(tokenize(MOCK_CODE[6])).toEqual([
      { value: "ID", position: 0, line: 1 },
      { value: "REL", position: 3, line: 1 },
      { value: "Dependents_of", position: 7, line: 1 },
      { value: "{", position: 21, line: 1 },
      { value: "Dependent", position: 55, line: 3 },
      { value: "<", position: 65, line: 3 },
      { value: "TOTAL", position: 66, line: 3 },
      { value: ",", position: 71, line: 3 },
      { value: "N", position: 73, line: 3 },
      { value: ">", position: 74, line: 3 },
      { value: "}", position: 78, line: 4 },
    ])
  })

  it("Should skip multi-lines comments", () => {
    expect(tokenize(MOCK_CODE[7])).toEqual([
      { value: "ENTITY", position: 0, line: 1 },
      { value: "Employee", position: 7, line: 1 },
      { value: "{", position: 16, line: 1 },
      { value: "PRIMARY", position: 22, line: 2 },
      { value: '"SSN"', position: 30, line: 2 },
      { value: ",", position: 35, line: 2 },
      { value: "COMPOSITE", position: 105, line: 6 },
      { value: '"full_name"', position: 115, line: 6 },
      { value: "[", position: 127, line: 6 },
      { value: '"first_name"', position: 128, line: 6 },
      { value: ",", position: 140, line: 6 },
      { value: '"last_name"', position: 142, line: 6 },
      { value: "]", position: 153, line: 6 },
      { value: "}", position: 157, line: 7 },
    ])
  })
})
