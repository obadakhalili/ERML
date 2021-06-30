import { lazy } from "react"
import { useRecoilValue } from "recoil"
import { workspaceOptionsState } from "../../state"

const Diagram = lazy(() => import("./Diagram"))
const AST = lazy(() => import("./AST"))

export default function ViewerPane() {
  return useRecoilValue(workspaceOptionsState).activeViewer === "Diagram" ? (
    <Diagram />
  ) : (
    <AST />
  )
}
