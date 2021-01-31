import tokenize from "./lexer"
import parse from "./parser"

export default function (ERML: string) {
  const tokens = tokenize(ERML)
}

try {
  console.log(
    // parse(
      tokenize(`
        ENTITY foo {}
      `)
    // )
  )
} catch ({ message }) {
  console.log(message)
}
