import { useContext } from "react"
import SnippetExplorer from "./SnippetExplorer"
import { Select, ItemRenderer } from "@blueprintjs/select"
import { MenuItem, Button } from "@blueprintjs/core"

import Editor from "./Editor"
import { WorkspaceContext, ActiveViewer } from "."

const ViewerSelect = Select.ofType<ActiveViewer>()

const ViewerItem: ItemRenderer<ActiveViewer> = (
  viewer,
  { handleClick, modifiers }
) => (
  <MenuItem
    key={viewer}
    text={viewer}
    active={modifiers.active}
    onClick={handleClick}
  />
)

export default function EditorPane() {
  const { activeViewer, setActiveViewer } = useContext(WorkspaceContext)
  const viewers: ActiveViewer[] = ["Diagram", "AST"]

  return (
    <>
      <SnippetExplorer />
      <ViewerSelect
        filterable={false}
        items={viewers}
        activeItem={activeViewer}
        onItemSelect={setActiveViewer}
        itemRenderer={ViewerItem}
      >
        <Button text={activeViewer} rightIcon="double-caret-vertical" />
      </ViewerSelect>
      <Editor />
    </>
  )
}
