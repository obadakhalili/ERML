import { useRecoilState } from "recoil"
import { Select, ItemRenderer } from "@blueprintjs/select"
import { MenuItem, Button } from "@blueprintjs/core"

import SnippetExplorer from "./SnippetExplorer"
import CodeMirror from "./CodeMirror"
import {
  activeViewerState,
  activeSnippetState,
  firstSnippetValueState,
  ActiveViewer,
} from "../../state"

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
  const [activeViewer, setActiveViewer] = useRecoilState(activeViewerState)
  const [activeSnippet, setActiveSnippet] = useRecoilState(activeSnippetState)
  const [firstSnippetValue, setFirstSnippetValue] = useRecoilState(
    firstSnippetValueState
  )

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
      <CodeMirror
        value={
          activeSnippet?.value ||
          firstSnippetValue ||
          "// Code written here will be saved to newly created snippets"
        }
        options={{ lineWrapping: true, autoRefresh: { delay: 50 } }}
        onBeforeChange={(editor, change, value) =>
          activeSnippet
            ? setActiveSnippet({ ...activeSnippet, value })
            : setFirstSnippetValue(value)
        }
        className="codemirror-container"
      />
    </>
  )
}
