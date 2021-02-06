import tokenize from "../engine/lexer"

describe("tests for lexer", () => {
  it("should return empty array for empty string code", () => {
    expect(tokenize("")).toEqual([])
  })

  it("should generate correct tokens. even if code isn't valid", () => {
    const tokens = tokenize(`ENTITY Employee {
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
    }`)
    expect(tokens).toMatchSnapshot()
  })
})
