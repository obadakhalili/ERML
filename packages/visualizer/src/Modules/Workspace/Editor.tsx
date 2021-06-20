import { useEffect, useRef } from "react"
import CodeMirror, { Editor as IEditor } from "codemirror"
import "codemirror/lib/codemirror.css"

import "./erml-mode"

export default function Editor({ value }: { value: string }) {
  const editorElRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<IEditor>()

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = CodeMirror(editorElRef.current!, { tabSize: 2 })
    }
    editorRef.current.setValue(value)
  }, [value])

  return <div ref={editorElRef} className="codemirror-container"></div>
}
