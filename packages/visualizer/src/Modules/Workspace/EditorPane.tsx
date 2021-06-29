import { useRecoilState } from "recoil"

import CodeMirror from "./CodeMirror"
import { activeSnippetState, firstSnippetValueState } from "../../state"

export default function EditorPane() {
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
        lineWrapping: true,
        lineNumbers: true,
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
