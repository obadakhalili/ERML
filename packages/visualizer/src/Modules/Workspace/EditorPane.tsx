import { useRecoilState, useRecoilValue } from "recoil"

import CodeMirror from "./CodeMirror"
import {
  workspaceOptionsState,
  activeSnippetState,
  firstSnippetValueState,
} from "../../state"

export default function EditorPane() {
  const { lineWrapped } = useRecoilValue(workspaceOptionsState)
  const [activeSnippet, setActiveSnippet] = useRecoilState(activeSnippetState)
  const [firstSnippetValue, setFirstSnippetValue] = useRecoilState(
    firstSnippetValueState
  )

  return (
    <CodeMirror
      value={
        activeSnippet?.value ||
        firstSnippetValue ||
        "// Code written here will be saved to newly created snippets"
      }
      options={{
        lineWrapping: lineWrapped,
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: true,
        scrollbarStyle: "simple",
        autoRefresh: { delay: 50 },
      }}
      onBeforeChange={(editor, change, value) =>
        activeSnippet
          ? setActiveSnippet({ ...activeSnippet, value })
          : setFirstSnippetValue(value)
      }
      className="h-full"
    />
  )
}
