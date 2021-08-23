import { lazy, useMemo } from "react"
import { useRecoilValue } from "recoil"

import { workspaceOptionsState, ActiveViewer } from "../state"
import { useMemoizedAST } from "../hooks"
import { mapASTIntoDiagramSchema } from "../utils"

const DiagramViewer = lazy(() => import("./DiagramViewer"))
const ASTViewer = lazy(() => import("./ASTViewer"))

export default function ViewerPane() {
  const { activeViewer } = useRecoilValue(workspaceOptionsState)
  const AST = useMemoizedAST()
  const diagramSchema = useMemo(() => mapASTIntoDiagramSchema(AST), [AST])

  return activeViewer === ActiveViewer.DIAGRAM ? (
    <DiagramViewer diagramSchema={diagramSchema} />
  ) : (
    <ASTViewer AST={AST} />
  )
}
