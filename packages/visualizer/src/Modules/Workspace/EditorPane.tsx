import { useRecoilState, useRecoilValue } from "recoil"
import Editor from "@monaco-editor/react"
import { Spinner } from "@blueprintjs/core"

import {
  workspaceOptionsState,
  activeSnippetState,
  firstSnippetValueState,
} from "../../state"

export default function EditorPane() {
  const { lineWrapped, minimapDisplayed } = useRecoilValue(
    workspaceOptionsState
  )
  const [activeSnippet, setActiveSnippet] = useRecoilState(activeSnippetState)
  const [firstSnippetValue, setFirstSnippetValueState] = useRecoilState(
    firstSnippetValueState
  )

  return (
    <Editor
      loading={<Spinner />}
      options={{
        wordWrap: lineWrapped ? "on" : "off",
        minimap: { enabled: minimapDisplayed },
      }}
      value={
        activeSnippet?.value ||
        firstSnippetValue ||
        "// Code here will be saved to the first created snippet"
      }
      onChange={(value) => {
        activeSnippet
          ? setActiveSnippet({ ...activeSnippet, value: value! })
          : setFirstSnippetValueState(value)
      }}
    />
  )
}
