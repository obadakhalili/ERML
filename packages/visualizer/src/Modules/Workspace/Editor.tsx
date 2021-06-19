import { useEffect, useRef } from "react"
import CodeMirror from "codemirror"
import "codemirror/lib/codemirror.css"

import "./erml-mode"

export default function Editor() {
  const editorElRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const $editorEl = editorElRef.current!

    if (!$editorEl.hasChildNodes()) {
      fetch("./code-placeholder.erml")
        .then((res) => res.text())
        .then((ERML) =>
          CodeMirror($editorEl, {
            value: ERML,
            tabSize: 2,
          })
        )
    }
  })

  return <div ref={editorElRef} className="codemirror-container"></div>
}
