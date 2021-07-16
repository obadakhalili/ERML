import { useRecoilValue } from "recoil"
import ReactJson from "react-json-view"
import ERMLParser from "erml-parser"

import { themeState } from "../state"

export default function ASTViewer({
  AST,
}: {
  AST: ReturnType<typeof ERMLParser>
}) {
  const theme = useRecoilValue(themeState)

  return (
    <ReactJson
      src={AST}
      displayDataTypes={false}
      collapsed={1}
      indentWidth={2}
      name="AST"
      theme={theme === "dark" ? "harmonic" : "rjv-default"}
      style={{ height: "inherit", padding: "8px", overflow: "auto" }}
    />
  )
}
