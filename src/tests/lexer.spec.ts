import tokenize from "../engine/lexer"

const MOCK_CODE = [
  "",
  `ENTITY Employee {
    PRIMARY "SSN",
    SIMPLE "salary",
    SIMPLE "DoB",
    DERIVED "age",
    COMPOSITE "full_name" ["first_name", "last_name"]
  }
  
  WEAK ENTITY Dependent OWNER Employee {
    # COMPOSITE PARTIAL "key" ["name", "DoB"],
    SIMPLE "relationship",
    SIMPLE "gender"
  }
  
  /* REL Works_for {
    Employee (1, 1),
    Department (20, N)
  } */
  
  REL Supervision ? {
    Employee <PARTIAL, 1>/,
    Employee <PARTIAL, N>
  }
  
  IDEN REL Dependents_of {
    Employee <PARTIAL, 1>,
    Dependent <TOTAL, N>
  }`,
]

describe("Test for lexer", () => {
  it("should return empty array for empty string code", () => {
    expect(tokenize(MOCK_CODE[0])).toEqual([])
  })

  it("should generate valid tokens. even if code isn't valid", () => {
    expect(tokenize(MOCK_CODE[1])).toEqual([
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
      { value: "WEAK", position: 158, line: 9 },
      { value: "ENTITY", position: 163, line: 9 },
      { value: "Dependent", position: 170, line: 9 },
      { value: "OWNER", position: 180, line: 9 },
      { value: "Employee", position: 186, line: 9 },
      { value: "{", position: 195, line: 9 },
      { value: "SIMPLE", position: 248, line: 11 },
      { value: '"relationship"', position: 255, line: 11 },
      { value: ",", position: 269, line: 11 },
      { value: "SIMPLE", position: 275, line: 12 },
      { value: '"gender"', position: 282, line: 12 },
      { value: "}", position: 293, line: 13 },
      { value: "REL", position: 375, line: 20 },
      { value: "Supervision", position: 379, line: 20 },
      { value: "?", position: 391, line: 20 },
      { value: "{", position: 393, line: 20 },
      { value: "Employee", position: 399, line: 21 },
      { value: "<", position: 408, line: 21 },
      { value: "PARTIAL", position: 409, line: 21 },
      { value: ",", position: 416, line: 21 },
      { value: "1", position: 418, line: 21 },
      { value: ">", position: 419, line: 21 },
      { value: "/", position: 420, line: 21 },
      { value: ",", position: 421, line: 21 },
      { value: "Employee", position: 427, line: 22 },
      { value: "<", position: 436, line: 22 },
      { value: "PARTIAL", position: 437, line: 22 },
      { value: ",", position: 444, line: 22 },
      { value: "N", position: 446, line: 22 },
      { value: ">", position: 447, line: 22 },
      { value: "}", position: 451, line: 23 },
      { value: "IDEN", position: 458, line: 25 },
      { value: "REL", position: 463, line: 25 },
      { value: "Dependents_of", position: 467, line: 25 },
      { value: "{", position: 481, line: 25 },
      { value: "Employee", position: 487, line: 26 },
      { value: "<", position: 496, line: 26 },
      { value: "PARTIAL", position: 497, line: 26 },
      { value: ",", position: 504, line: 26 },
      { value: "1", position: 506, line: 26 },
      { value: ">", position: 507, line: 26 },
      { value: ",", position: 508, line: 26 },
      { value: "Dependent", position: 514, line: 27 },
      { value: "<", position: 524, line: 27 },
      { value: "TOTAL", position: 525, line: 27 },
      { value: ",", position: 530, line: 27 },
      { value: "N", position: 532, line: 27 },
      { value: ">", position: 533, line: 27 },
      { value: "}", position: 537, line: 28 },
    ])
  })
})
