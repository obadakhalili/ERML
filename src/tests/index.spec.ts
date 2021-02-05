import ERMLParser from "../engine"

const MOCK_CODE = `ENTITY Employee {
  PRIMARY "SSN",
  SIMPLE "salary",
  SIMPLE "DoB",
  DERIVED "age",
  COMPOSITE "full_name" ["first_name", "last_name"]
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
  COMPOSITE PARTIAL "key" ["name", "DoB"],
  SIMPLE "relationship",
  SIMPLE "gender"
}

REL Works_for {
  Employee (1, 1),
  Department (20, Infinity),
}

REL Manages {
  Employee <PARTIAL, 1>,
  Department <TOTAL, 1>,
  ATTRIBUTES {
    SIMPLE "start_date"
  },
}

REL Supervision {
  Employee <PARTIAL, 1>,
  Employee <PARTIAL, N>,
}

IDEN REL Dependents_of {
  Employee <PARTIAL, 1>,
  Dependent <TOTAL, N>,
}

REL Works_on {
  Employee <PARTIAL, N>,
  Project <TOTAL, N>,
  ATTRIBUTES {
    SIMPLE "hours"
  },
}

REL Controls {
  Department <PARTIAL, N>,
  Project <TOTAL, 1>,
}`

describe("Test for ERMLParser", () => {
  test("Should parse valid code successfully", () => {
    expect(ERMLParser(MOCK_CODE)).toEqual([
      { type: "entity", name: "Employee", attributes: "MOCK ATTRIBUTES" },
      { type: "entity", name: "Department", attributes: "MOCK ATTRIBUTES" },
      { type: "entity", name: "Project", attributes: "MOCK ATTRIBUTES" },
      {
        type: "weak entity",
        name: "Dependent",
        owner: "Employee",
        attributes: "MOCK ATTRIBUTES",
      },
      {
        type: "rel",
        name: "Works_for",
        body: {
          partEntities: [
            { constraints: [1, 1], name: "Employee", notation: "min-max" },
            {
              constraints: [20, Infinity],
              name: "Department",
              notation: "min-max",
            },
          ],
        },
      },
      {
        type: "rel",
        name: "Manages",
        body: {
          partEntities: [
            {
              constraints: ["partial", "1"],
              name: "Employee",
              notation: "separate",
            },
            {
              constraints: ["total", "1"],
              name: "Department",
              notation: "separate",
            },
          ],
          attributes: "MOCK ATTRIBUTES",
        },
      },
      {
        type: "rel",
        name: "Supervision",
        body: {
          partEntities: [
            {
              constraints: ["partial", "1"],
              name: "Employee",
              notation: "separate",
            },
            {
              constraints: ["partial", "N"],
              name: "Employee",
              notation: "separate",
            },
          ],
        },
      },
      {
        type: "iden rel",
        name: "Dependents_of",
        body: {
          partEntities: [
            {
              constraints: ["partial", "1"],
              name: "Employee",
              notation: "separate",
            },
            {
              constraints: ["total", "N"],
              name: "Dependent",
              notation: "separate",
            },
          ],
        },
      },
      {
        type: "rel",
        name: "Works_on",
        body: {
          partEntities: [
            {
              constraints: ["partial", "N"],
              name: "Employee",
              notation: "separate",
            },
            {
              constraints: ["total", "N"],
              name: "Project",
              notation: "separate",
            },
          ],
          attributes: "MOCK ATTRIBUTES",
        },
      },
      {
        type: "rel",
        name: "Controls",
        body: {
          partEntities: [
            {
              constraints: ["partial", "N"],
              name: "Department",
              notation: "separate",
            },
            {
              constraints: ["total", "1"],
              name: "Project",
              notation: "separate",
            },
          ],
        },
      },
    ])
  })
})
