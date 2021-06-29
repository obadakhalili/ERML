import { FC } from "react"
import { RouteComponentProps } from "@reach/router"
import SplitPane from "react-split-pane"

import Controllers from "./Controllers"
import EditorPane from "./EditorPane"
import ViewerPane from "./ViewerPane"
import "../../styles/react-split-pane.css"

const Workspace: FC<RouteComponentProps> = () => (
  <SplitPane defaultSize={350} minSize={350} maxSize={500}>
    <>
      <Controllers />
      <EditorPane />
    </>
    <ViewerPane />
  </SplitPane>
)

export default Workspace
