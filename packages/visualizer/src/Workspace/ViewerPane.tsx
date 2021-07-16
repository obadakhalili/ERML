import { lazy } from "react"
import { useRecoilValue } from "recoil"

import { workspaceOptionsState, ActiveViewer } from "../state"
import { useMemoizedAST } from "../hooks"

const Diagram = lazy(() => import("./Diagram"))
const ASTViewer = lazy(() => import("./ASTViewer"))

export default function ViewerPane() {
  const { activeViewer } = useRecoilValue(workspaceOptionsState)
  const AST = useMemoizedAST()

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
