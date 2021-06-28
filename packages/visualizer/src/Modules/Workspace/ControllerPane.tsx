import { useRecoilState } from "recoil"
import { Select, ItemRenderer } from "@blueprintjs/select"
import { MenuItem, Button } from "@blueprintjs/core"

import SnippetExplorer from "./SnippetExplorer"
import { activeViewerState, ActiveViewer } from "../../state"

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

export default function ControllerPane() {
  const [activeViewer, setActiveViewer] = useRecoilState(activeViewerState)

  return (
    <>
      <SnippetExplorer />
      <ViewerSelect
        filterable={false}
        items={["Diagram", "AST"]}
        activeItem={activeViewer}
        onItemSelect={setActiveViewer}
        itemRenderer={ViewerItem}
      >
        <Button text={activeViewer} rightIcon="double-caret-vertical" />
      </ViewerSelect>
    </>
  )
}
