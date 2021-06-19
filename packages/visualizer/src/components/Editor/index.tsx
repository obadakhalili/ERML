import { useEffect, useRef } from "react"
import CodeMirror from "codemirror"
import "codemirror/lib/codemirror.css"

import "./erml"

export default function Editor() {
  const editorElRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const $editorEl = editorElRef.current!

    if (!$editorEl.hasChildNodes()) {
      CodeMirror($editorEl, {
        value: ERMLCode,
        tabSize: 2,
      })
    }
  })

  return <div ref={editorElRef}></div>
}

const ERMLCode = `ENTITY User {
  PRIMARY "ID", // one-liner comment
  SIMPLE "DoB",
  DERIVED "Age"
}

WEAK ENTITY Book OWNER User {
  PARTIAL "Name"
}

IDEN REL Borrow {
  User <PARTIAL, 1>,
  User <TOTAL, N>,
  ATTRIBUTES { SIMPLE "Borrowing_date" }

  /*
  * Multi-line
  * comment
  */
}`
