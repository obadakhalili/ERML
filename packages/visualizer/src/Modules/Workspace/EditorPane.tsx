import { useRecoilState, useRecoilValue } from "recoil"
import Editor, { Monaco, OnMount as OnEditorMount } from "@monaco-editor/react"
import { Spinner } from "@blueprintjs/core"

import * as ERML from "./ERML"
import { workspaceOptionsState, activeSnippetState } from "../../state"

function defineERML(monaco: Monaco) {
  monaco.languages.register({ id: "erml" })
  monaco.languages.setLanguageConfiguration("erml", ERML.config)
  monaco.languages.setMonarchTokensProvider("erml", ERML.lang)
}

const focusEditor: OnEditorMount = (editor) => editor.focus()

export default function EditorPane() {
  const [activeSnippet, setActiveSnippet] = useRecoilState(activeSnippetState)

  const editorValue =
    activeSnippet?.value || "// Create a new snippet, and start coding .."

  const { wordWrapped, minimapDisplayed } = useRecoilValue(
    workspaceOptionsState
  )

  const editorOptions = {
    wordWrap: wordWrapped ? "on" : "off",
    minimap: { enabled: minimapDisplayed },
  } as const

  return (
    <Editor
      language="erml"
      loading={<Spinner />}
      value={editorValue}
      options={editorOptions}
      beforeMount={defineERML}
      onMount={focusEditor}
      onChange={handleEditorChange}
    />
  )

  function handleEditorChange(newValue?: string) {
    if (activeSnippet) {
      return setActiveSnippet({ ...activeSnippet, value: newValue! })
    }
  }
}
