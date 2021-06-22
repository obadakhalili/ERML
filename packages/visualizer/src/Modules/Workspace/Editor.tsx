import { useEffect, useRef } from "react"
import CodeMirror, { Editor as IEditor } from "codemirror"
import "codemirror/lib/codemirror.css"

import { Snippet } from "."
import "./erml-mode"

export default function Editor({ snippet }: { snippet: Snippet }) {
  const editorElRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<IEditor>()

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = CodeMirror(editorElRef.current!, { tabSize: 2 })
    }
    editorRef.current.setValue(snippet.value)
  }, [snippet])

  return <div ref={editorElRef} className="codemirror-container"></div>
}
