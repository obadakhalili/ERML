import { lazy } from "react"
import { useRecoilValue } from "recoil"

import { workspaceOptionsState, ActiveViewer } from "../state"
import { useMemoizedAST } from "../hooks"

const Diagram = lazy(() => import("./DiagramViewer"))
const ASTViewer = lazy(() => import("./ASTViewer"))

export default function ViewerPane() {
  const { activeViewer } = useRecoilValue(workspaceOptionsState)
  const AST = useMemoizedAST()

  return activeViewer === ActiveViewer.DIAGRAM ? (
    <Diagram />
  ) : (
    <ASTViewer AST={AST} />
  )
}
