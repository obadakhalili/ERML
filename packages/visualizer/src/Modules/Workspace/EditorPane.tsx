import { useRef, useEffect } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { editor } from "monaco-editor"
import Editor, { Monaco } from "@monaco-editor/react"
import { initVimMode } from "monaco-vim"
import { Spinner } from "@blueprintjs/core"

import * as ERML from "./ERML"
import { activeSnippetState, workspaceOptionsState } from "../../state"

function defineERML(monaco: Monaco) {
  monaco.languages.register({ id: "erml" })
  monaco.languages.setLanguageConfiguration("erml", ERML.config)
  monaco.languages.setMonarchTokensProvider("erml", ERML.lang)
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

  return (
    <>
      <div className={vimEnabled ? "h-[calc(100%-26.6px)]" : "h-full"}>
        <Editor
          language="erml"
          loading={<Spinner />}
          value={editorValue}
          options={editorOptions}
          beforeMount={defineERML}
          onMount={handleEditorMount}
          onChange={handleEditorChange}
        />
      </div>
      {vimEnabled && (
        <div
          ref={vimStatusBarRef}
          className="py-1 px-3 border-0 border-t border-solid border-[#ddd]"
        ></div>
      )}
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
