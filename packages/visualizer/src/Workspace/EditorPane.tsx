import { useRef, useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { editor } from "monaco-editor"
import Editor, { Monaco } from "@monaco-editor/react"
import { initVimMode } from "monaco-vim"
import nightOwlTheme from "monaco-themes/themes/Night Owl.json"
import { Callout, Classes, Spinner } from "@blueprintjs/core"

import * as ERML from "../ERML"
import {
  activeSnippetState,
  parsingErrorState,
  workspaceOptionsState,
  themeState,
  Theme,
} from "../state"
import { debounce } from "../utils"

function handleBeforeEditorMount(monaco: Monaco) {
  monaco.languages.register({ id: "erml" })
  monaco.languages.setLanguageConfiguration("erml", ERML.config)
  monaco.languages.setMonarchTokensProvider("erml", ERML.lang)
  monaco.editor.defineTheme(
    "night-owl",
    nightOwlTheme as editor.IStandaloneThemeData
  )
}

export default function EditorPane() {
  const [activeSnippet, setActiveSnippet] = useRecoilState(activeSnippetState)

  const editorValue =
    activeSnippet?.value ?? "// Create a new snippet, and start coding .."

  const { wordWrapped, minimapDisplayed, vimEnabled } = useRecoilValue(
    workspaceOptionsState
  )

  const editorOptions = {
    wordWrap: wordWrapped ? "on" : "off",
    minimap: { enabled: minimapDisplayed },
    tabSize: 2,
  } as const

  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const vimModeRef = useRef<{ dispose: () => void }>(undefined!)
  const vimStatusBarRef = useRef(null)

  useEffect(() => {
    if (editorRef.current) {
      if (vimEnabled) {
        return (vimModeRef.current = initVimMode(
          editorRef.current,
          vimStatusBarRef.current
        ))
      }
      vimModeRef.current.dispose()
    }
  }, [vimEnabled])

  const parsingError = useRecoilValue(parsingErrorState)

  const theme = useRecoilValue(themeState)

  return (
    <>
      {parsingError && <Callout>{parsingError}</Callout>}
      {vimEnabled && (
        <div ref={vimStatusBarRef} className={Classes.CALLOUT}></div>
      )}
      <Editor
        language="erml"
        theme={theme === Theme.DARK ? "night-owl" : ""}
        loading={<Spinner />}
        value={editorValue}
        options={editorOptions}
        beforeMount={handleBeforeEditorMount}
        onMount={handleEditorMount}
        onChange={debounce(handleEditorChange)}
      />
    </>
  )

  function handleEditorMount(editor: editor.IStandaloneCodeEditor) {
    vimEnabled &&
      (vimModeRef.current = initVimMode(editor, vimStatusBarRef.current))
    editorRef.current = editor
    editor.focus()
  }

  function handleEditorChange(newValue?: string) {
    if (activeSnippet) {
      return setActiveSnippet({ ...activeSnippet, value: newValue! })
    }
  }
}
