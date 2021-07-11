import ReactJson from "react-json-view"
import ERMLParser from "erml-parser"

export default function ASTViewer({
  AST,
}: {
  AST: ReturnType<typeof ERMLParser>
}) {
  return (
    <ReactJson
      src={AST}
      displayDataTypes={false}
      collapsed={1}
      indentWidth={2}
      name="AST"
      theme="rjv-default"
    />
  )
}
