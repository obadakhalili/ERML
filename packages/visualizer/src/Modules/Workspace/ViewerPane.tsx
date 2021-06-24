import { lazy } from "react"
import { useRecoilValue } from "recoil"
import { activeViewerState } from "../../state"

const Diagram = lazy(() => import("./Diagram"))
const AST = lazy(() => import("./AST"))

export default function ViewerPane() {
  return useRecoilValue(activeViewerState) === "Diagram" ? <Diagram /> : <AST />
}
