import { FC } from "react"
import { RouteComponentProps } from "@reach/router"
import SplitPane from "react-split-pane"

import Editor from "./Editor"
import "./styles.css"

const Workspace: FC<RouteComponentProps> = () => (
  <SplitPane defaultSize={350} minSize={350} maxSize={750}>
    <LeftPane />
    <RightPane />
  </SplitPane>
)

function LeftPane() {
  return <Editor />
}

function RightPane() {
  return <h1>Viewer</h1>
}

export default Workspace
