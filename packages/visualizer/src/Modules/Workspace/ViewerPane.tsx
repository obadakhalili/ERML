import { lazy } from "react"
import { ActiveViewer } from "."

const Diagram = lazy(() => import("./Diagram"))
const AST = lazy(() => import("./AST"))

export default function ViewerPane({
  activeViewer,
}: {
  activeViewer: ActiveViewer
}) {
  return activeViewer === "Diagram" ? <Diagram /> : <AST />
}
