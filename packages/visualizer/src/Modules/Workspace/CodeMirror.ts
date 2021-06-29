import "codemirror/addon/edit/matchbrackets.js"
import "codemirror/addon/selection/active-line.js"
import "codemirror/addon/scroll/simplescrollbars.js"
import "codemirror/addon/display/autorefresh.js"

import "codemirror/lib/codemirror.css"
import "codemirror/addon/scroll/simplescrollbars.css"
import { defineMode } from "codemirror"

import "../../styles/CodeMirror.css"

defineMode("erml", () => {
  const regexs = {
    "multi-line comment start": /\/\*/,
    "multi-line comment end": /\*\//,
    "one-liner comment": /\/\/.*/,
    string: /"((?:[^"\\]|\\.)*)"/,
    keyword: new RegExp(
      "ENTITY|WEAK|OWNER|REL|IDEN|PARTIAL|TOTAL|ATTRIBUTES|SIMPLE|ATOMIC|PRIMARY|DERIVED|MULTIVALUED|COMPOSITE|N|Infinity"
    ),
    identifier: /[a-zA-Z_]\w{0,29}/,
    digit: /(\+|-)?(\d+|Infinity)/,
    comma: /,/,
  }

  return {
    token(stream, state) {
      if (stream.match(regexs["multi-line comment start"])) {
        state.multiLineCommentStarted = true
        stream.skipToEnd()
        return "comment"
      }

      if (state.multiLineCommentStarted) {
        if (stream.string.match(regexs["multi-line comment end"])) {
          let char
          let foundStar = false
          let foundBackSlash = false

          while ((char = stream.next())) {
            char === "*" && (foundStar = true)
            char === "/" && (foundBackSlash = true)

            if (foundStar && foundBackSlash) {
              state.multiLineCommentStarted = false
              return "comment"
            }
          }
        } else {
          stream.skipToEnd()
        }
        return "comment"
      }

      if (stream.match(regexs["one-liner comment"])) {
        return "comment"
      }

      if (stream.match(regexs.string)) {
        return "string"
      }

      if (stream.match(regexs.keyword)) {
        return "keyword"
      }

      if (stream.match(regexs.identifier)) {
        return "def"
      }

      if (stream.match(regexs.digit)) {
        return "number"
      }

      if (stream.match(regexs.comma)) {
        return "meta"
      }

      stream.next()
      return null
    },
    startState: () => ({ multiLineCommentStarted: false }),
  }
})

export { Controlled as default } from "react-codemirror2"
