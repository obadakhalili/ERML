import React, { useRecoilValue } from "recoil"
import ReactJson from "react-json-view"
import ERMLParser from "erml-parser"

import { themeState, Theme } from "../state"

export default function ASTViewer({ AST }: { AST: ERMLParser.AST }) {
  const theme = useRecoilValue(themeState)

  return (
    <ReactJson
      src={AST}
      displayDataTypes={false}
      collapsed={1}
      indentWidth={2}
      name="AST"
      theme={theme === Theme.DARK ? "harmonic" : "rjv-default"}
    />
  )
}
