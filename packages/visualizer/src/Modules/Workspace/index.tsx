import { FC } from "react"
import { RouteComponentProps } from "@reach/router"
import SplitPane from "react-split-pane"

import ControllerPane from "./ControllerPane"
import EditorPane from "./EditorPane"
import ViewerPane from "./ViewerPane"
import "../../styles/react-split-pane.css"

const Workspace: FC<RouteComponentProps> = () => (
  <SplitPane defaultSize={525} minSize={350} maxSize={600}>
    <SplitPane allowResize={false} minSize={175}>
      <ControllerPane />
      <EditorPane />
    </SplitPane>
    <ViewerPane />
  </SplitPane>
)

export default Workspace
