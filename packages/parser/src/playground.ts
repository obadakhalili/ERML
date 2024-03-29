import tokenize from "./engine/lexer"
import ERMLParser from "./engine"

const ERMLCode = `ENTITY Employee {
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
    PARTIAL "name",
    PARTIAL "DoB"
  },
  SIMPLE "relationship",
  SIMPLE "gender"
}

REL Works_for {
  Employee (1, N),
  Department (20, N)
}

REL Manages {
  Employee <PARTIAL, 1>,
  Department <TOTAL, 1>,
  ATTRIBUTES { SIMPLE "start_date" }
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
  ATTRIBUTES { SIMPLE "hours" }
}

REL Controls {
  Department <PARTIAL, N>,
  Project <TOTAL, 1>
}`

try {
  // console.log(
  // tokenize(
  const ast = ERMLParser(ERMLCode)
  // )

  console.log(ast)
} catch (e) {
  console.log(e)
}
