import { useRef, useMemo } from "react"
import { lazy } from "react"
import { useRecoilValue } from "recoil"
import { activeSnippetState, workspaceOptionsState } from "../../state"
import ERMLParser from "erml-parser"

const Diagram = lazy(() => import("./Diagram"))
const ASTViewer = lazy(() => import("./ASTViewer"))

export default function ViewerPane() {
  const { activeViewer } = useRecoilValue(workspaceOptionsState)
  const activeSnippet = useRecoilValue(activeSnippetState)
  const lastValidASTRef = useRef<ReturnType<typeof ERMLParser>>()

  const AST = useMemo(() => {
    try {
      lastValidASTRef.current = ERMLParser(activeSnippet?.value || "")
      return lastValidASTRef.current
    } catch {
      return lastValidASTRef.current || []
    }
  }, [activeSnippet?.value])

  return (
    <div className="p-2 h-full overflow-auto">
      {activeViewer === "Diagram" ? <Diagram /> : <ASTViewer AST={AST} />}
    </div>
  )
}
