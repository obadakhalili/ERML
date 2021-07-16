import { useRef, useMemo } from "react"
import { lazy } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import ERMLParser from "erml-parser"

import {
  activeSnippetState,
  parsingErrorState,
  workspaceOptionsState,
  ActiveViewer,
} from "../state"

const Diagram = lazy(() => import("./Diagram"))
const ASTViewer = lazy(() => import("./ASTViewer"))

export default function ViewerPane() {
  const { activeViewer } = useRecoilValue(workspaceOptionsState)
  const activeSnippet = useRecoilValue(activeSnippetState)
  const lastValidASTRef = useRef<ReturnType<typeof ERMLParser>>()
  const setParsingError = useSetRecoilState(parsingErrorState)

  const AST = useMemo(() => {
    try {
      lastValidASTRef.current = ERMLParser(activeSnippet?.value || "")
      setParsingError(null)
      return lastValidASTRef.current
    } catch (e) {
      setParsingError(e.message)
      return lastValidASTRef.current || []
    }
  }, [activeSnippet?.value, setParsingError])

  return (
    <div className="h-full">
      {activeViewer === ActiveViewer.DIAGRAM ? (
        <Diagram />
      ) : (
        <ASTViewer AST={AST} />
      )}
    </div>
  )
}