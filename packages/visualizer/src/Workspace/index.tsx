import { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import SplitPane from "react-split-pane"
import { Icon, Drawer, DrawerSize } from "@blueprintjs/core"

import SnippetExplorer from "./SnippetExplorer"
import WorkspaceOptions from "./WorkspaceOptions"
import EditorPane from "./EditorPane"
import ViewerPane from "./ViewerPane"
import { activeSnippetState, workspaceOptionsState } from "../state"
import { useWindowWidth } from "../hooks"
import "../styles/react-split-pane.css"

export default function Workspace() {
  const [{ splitPaneDefaultSize }, setWorkspaceOptions] = useRecoilState(
    workspaceOptionsState
  )

  const windowWidth = useWindowWidth()
  const isPhoneWidth = windowWidth < 868

  const [isDrawerOpen, toggleDrawer] = useState(false)
  const activeSnippet = useRecoilValue(activeSnippetState)

  return (
    <>
      <div className="h-11 px-2 flex justify-between items-center border-0 border-b border-solid border-[#ddd]">
        <SnippetExplorer />
        <div>
          <WorkspaceOptions />
          {isPhoneWidth && (
            <Icon
              onClick={handleToggleDrawerButton}
              icon="annotation"
              className="hover:cursor-pointer hover:opacity-80 ml-3"
            />
          )}
        </div>
      </div>
      {isPhoneWidth ? (
        <>
          <Drawer
            isOpen={isDrawerOpen}
            size={DrawerSize.LARGE}
            title={activeSnippet?.name || "Create New Snippet"}
            onClose={handleToggleDrawerButton}
          >
            <EditorPane />
          </Drawer>
          <ViewerPane />
        </>
      ) : (
        <SplitPane
          className="!h-[calc(100%-94px)]"
          defaultSize={splitPaneDefaultSize}
          onChange={handleSplitPaneChange}
          minSize={350}
          maxSize={500}
        >
          <EditorPane />
          <ViewerPane />
        </SplitPane>
      )}
    </>
  )

  function handleToggleDrawerButton() {
    toggleDrawer(!isDrawerOpen)
  }

  function handleSplitPaneChange(newSize: number) {
    setWorkspaceOptions((options) => ({
      ...options,
      splitPaneDefaultSize: newSize,
    }))
  }
}
