import { FC } from "react"
import { RouteComponentProps } from "@reach/router"

import Editor from "../components/Editor"

const Workspace: FC<RouteComponentProps> = () => (
  <div style={{ width: 500, height: 500 }}>
    <Editor />
  </div>
)

export default Workspace
