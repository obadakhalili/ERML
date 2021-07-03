import { useRecoilState, useRecoilValue } from "recoil"
import Editor, { Monaco, OnMount as OnEditorMount } from "@monaco-editor/react"
import { Spinner } from "@blueprintjs/core"

import * as ERML from "./ERML"
import {
  workspaceOptionsState,
  activeSnippetState,
  firstSnippetValueState,
} from "../../state"

function defineERML(monaco: Monaco) {
  monaco.languages.register({ id: "erml" })
  monaco.languages.setLanguageConfiguration("erml", ERML.config)
  monaco.languages.setMonarchTokensProvider("erml", ERML.lang)
}

const focusEditor: OnEditorMount = (editor) => editor.focus()

export default function EditorPane() {
  const { wordWrapped, minimapDisplayed } = useRecoilValue(
    workspaceOptionsState
  )
  const [activeSnippet, setActiveSnippet] = useRecoilState(activeSnippetState)
  const [firstSnippetValue, setFirstSnippetValue] = useRecoilState(
    firstSnippetValueState
  )

  const editorOptions = {
    wordWrap: wordWrapped ? "on" : "off",
    minimap: { enabled: minimapDisplayed },
  } as const

  const editorValue =
    activeSnippet?.value ||
    firstSnippetValue ||
    "// Code here will be saved to the first created snippet"

  return (
    <Editor
      language="erml"
      loading={<Spinner />}
      beforeMount={defineERML}
      onMount={focusEditor}
      onChange={handleEditorChange}
      options={editorOptions}
      value={editorValue}
    />
  )

  function handleEditorChange(newValue?: string) {
    if (activeSnippet) {
      return setActiveSnippet({ ...activeSnippet, value: newValue! })
    }
    setFirstSnippetValue(newValue)
  }
}
