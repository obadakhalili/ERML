import { FC } from "react"
import { useRecoilState } from "recoil"
import { RouteComponentProps } from "@reach/router"
import SplitPane from "react-split-pane"

import SnippetExplorer from "./SnippetExplorer"
import WorkspaceOptions from "./WorkspaceOptions"
import EditorPane from "./EditorPane"
import ViewerPane from "./ViewerPane"
import { workspaceOptionsState } from "../../state"
import "../../styles/react-split-pane.css"

const Workspace: FC<RouteComponentProps> = () => {
  const [{ splitPaneDefaultSize }, setWorkspaceOptions] = useRecoilState(
    workspaceOptionsState
  )

  return (
    <>
      <div className="h-11 px-2 flex justify-between items-center border-0 border-b border-solid border-[#ddd]">
        <SnippetExplorer />
        <WorkspaceOptions />
      </div>
      <SplitPane
        className="!h-[calc(100%-94px)]"
        defaultSize={splitPaneDefaultSize}
        minSize={350}
        maxSize={500}
        onChange={(newSize) =>
          setWorkspaceOptions((options) => ({
            ...options,
            splitPaneDefaultSize: newSize,
          }))
        }
      >
        <EditorPane />
        <ViewerPane />
      </SplitPane>
    </>
  )
}

export default Workspace
