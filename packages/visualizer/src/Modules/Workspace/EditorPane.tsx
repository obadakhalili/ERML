import { useRecoilState } from "recoil"
import { Select, ItemRenderer } from "@blueprintjs/select"
import { MenuItem, Button } from "@blueprintjs/core"

import SnippetExplorer from "./SnippetExplorer"
import CodeMirror from "./CodeMirror"
import {
  activeViewerState,
  activeSnippetState,
  newSnippetValueState,
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
  const [newSnippetValue, setNewSnippetValue] =
    useRecoilState(newSnippetValueState)

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
          newSnippetValue ||
          "// Code written here will be saved to newly created snippets"
        }
        options={{ lineWrapping: true, autoRefresh: { delay: 50 } }}
        onBeforeChange={(editor, change, value) =>
          activeSnippet
            ? setActiveSnippet({ ...activeSnippet, value })
            : setNewSnippetValue(value)
        }
        className="codemirror-container"
      />
    </>
  )
}
