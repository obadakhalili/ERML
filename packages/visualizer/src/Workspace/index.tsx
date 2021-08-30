import React, { useState } from "react"
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
  const [isDrawerOpen, toggleDrawer] = useState(false)
  const activeSnippet = useRecoilValue(activeSnippetState)

  const isPhoneWidth = windowWidth < 868

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
          defaultSize={splitPaneDefaultSize}
          onChange={handleSplitPaneChange}
          minSize={350}
          maxSize={500}
          className="!static"
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
