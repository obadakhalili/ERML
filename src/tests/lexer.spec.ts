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

describe("tests for lexer", () => {
  it("should return empty array for empty string code", () => {
    expect(tokenize(MOCK_CODE[0])).toEqual([])
  })

  it("should generate correct tokens. even if code isn't valid", () => {
    expect(tokenize(MOCK_CODE[1])).toMatchSnapshot()
  })
})
