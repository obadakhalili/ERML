import { lazy, useEffect, useMemo } from "react"
import { useRecoilValue } from "recoil"

import { workspaceOptionsState, ActiveViewer } from "../state"
import { useMemoizedAST } from "../hooks"
import { mapASTIntoDiagramSchema } from "../utils"

const Diagram = lazy(() => import("./DiagramViewer"))
const ASTViewer = lazy(() => import("./ASTViewer"))

export default function ViewerPane() {
  const { activeViewer } = useRecoilValue(workspaceOptionsState)
  const AST = useMemoizedAST()
  const diagramSchema = useMemo(() => mapASTIntoDiagramSchema(AST), [AST])

  useEffect(() => {
    console.log(diagramSchema)
  }, [diagramSchema])

  return activeViewer === ActiveViewer.DIAGRAM ? (
    <Diagram />
  ) : (
    <ASTViewer AST={AST} />
  )
}
