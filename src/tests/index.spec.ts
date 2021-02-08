import ERMLParser from "../engine"

describe("tests for ERMLParser", () => {
  it("should throw argument is of wrong type error", () => {
    expect(() => ERMLParser(1 as any)).toThrow(
      "Argument passed to parser must be of type string"
    )
  })

  it("should parse code correctly", () => {
    const code = `ENTITY Employee {
      PRIMARY "SSN",
      SIMPLE "salary",
      SIMPLE "DoB",
      DERIVED "age",
      COMPOSITE "full_name" {
        SIMPLE "first_name",
        SIMPLE "last_name"
      }
    }
    
    ENTITY Department {
      PRIMARY "name",
      PRIMARY "number",
      DERIVED "employees_number",
      MULTIVALUED "locations"
    }
    
    ENTITY Project {
      PRIMARY "number",
      PRIMARY "name",
      SIMPLE "location"
    }
    
    WEAK ENTITY Dependent OWNER Employee {
      COMPOSITE "key" {
        SIMPLE "name",
        SIMPLE "DoB"
      },
      SIMPLE "relationship",
      SIMPLE "gender"
    }
    
    REL Works_for {
      Employee (1, 1),
      Department (20, Infinity)
    }
    
    REL Manages {
      Employee <PARTIAL, 1>,
      Department <TOTAL, 1>,
      ATTRIBUTES {
        SIMPLE "start_date"
      }
    }
    
    REL Supervision {
      Employee <PARTIAL, 1>,
      Employee <PARTIAL, N>
    }
    
    IDEN REL Dependents_of {
      Employee <PARTIAL, 1>,
      Dependent <TOTAL, N>
    }
    
    REL Works_on {
      Employee <PARTIAL, N>,
      Project <TOTAL, N>,
      ATTRIBUTES {
        SIMPLE "hours"
      }
    }
    
    REL Controls {
      Department <PARTIAL, N>,
      Project <TOTAL, 1>
    }`
    expect(ERMLParser(code)).toMatchSnapshot()
  })
})
