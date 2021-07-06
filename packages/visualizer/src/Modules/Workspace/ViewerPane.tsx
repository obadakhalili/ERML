import { useMemo } from "react"
import { lazy } from "react"
import { useRecoilValue } from "recoil"
import { activeSnippetState, workspaceOptionsState } from "../../state"
import ERMLParser from "erml-parser"

const Diagram = lazy(() => import("./Diagram"))
const ASTViewer = lazy(() => import("./ASTViewer"))

export default function ViewerPane() {
  const { activeViewer } = useRecoilValue(workspaceOptionsState)
  const activeSnippet = useRecoilValue(activeSnippetState)

  const AST = useMemo(() => {
    try {
      return ERMLParser(activeSnippet?.value || "")
    } catch (e) {
      console.log(e.message)
      return []
    }
  }, [activeSnippet?.value])

  return (
    <div className="p-2 h-full overflow-auto">
      {activeViewer === "Diagram" ? <Diagram /> : <ASTViewer AST={AST} />}
    </div>
  )
}
