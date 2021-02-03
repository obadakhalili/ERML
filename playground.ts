import tokenize from "./src/engine/lexer"
import ERMLParser from "./src/engine/index"

try {
  console.log(
    // tokenize(
    ERMLParser(
      `ENTITY Employee {
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
        Department (20, N)
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
        Employee <PARTIAL, 1>
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
    )
  )
} catch ({ message }) {
  console.log(message)
}
