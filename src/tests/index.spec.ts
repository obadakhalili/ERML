import ERMLParser from "../engine"

const MOCK_CODE = `ENTITY Employee {
  PRIMARY "SSN",
  SIMPLE "salary",
  SIMPLE "DoB",
  DERIVED "age",
  COMPOSITE "full_name" ["first_name", "last_name"]
}

WEAK ENTITY Dependent OWNER Employee {
  COMPOSITE PARTIAL "key" ["name", "DoB"],
  SIMPLE "relationship",
  SIMPLE "gender"
}

REL Works_for {
  Employee (1, 1),
  Department (20, N)
}

ID REL Dependents_of {
  Employee <PARTIAL, 1>
  Dependent <TOTAL, N>
}`

describe("Test for ERMLParser", () => {
  test("Should parse valid code successfully", () => {
    expect(ERMLParser(MOCK_CODE)).toEqual([
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
