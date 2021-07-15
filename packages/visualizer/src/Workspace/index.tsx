import { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import SplitPane from "react-split-pane"
import { Navbar, Icon, Drawer, DrawerSize, Alignment } from "@blueprintjs/core"

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
      <Navbar>
        <Navbar.Group>
          <SnippetExplorer />
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <WorkspaceOptions />
          {isPhoneWidth && (
            <Icon
              onClick={handleToggleDrawerButton}
              icon="annotation"
              className="hover:cursor-pointer hover:opacity-80 ml-3"
            />
          )}
        </Navbar.Group>
      </Navbar>
      {isPhoneWidth ? (
        <div className="h-[calc(100vh-100px)]">
          <Drawer
            isOpen={isDrawerOpen}
            size={DrawerSize.LARGE}
            title={activeSnippet?.name || "Create New Snippet"}
            onClose={handleToggleDrawerButton}
            className="bp3-dark"
          >
            <EditorPane />
          </Drawer>
          <ViewerPane />
        </div>
      ) : (
        <SplitPane
          className="!h-[calc(100vh-100px)]"
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
