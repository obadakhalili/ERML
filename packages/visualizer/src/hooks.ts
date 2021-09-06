import { useEffect, useMemo, useRef, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import ERMLParser from "@erml/parser"

import { activeSnippetState, parsingErrorState } from "./state"

export function useWindowWidth() {
  const [windowWidth, setWindowSize] = useState(window.innerWidth)

  useEffect(() => {
    const handler = () => {
      setWindowSize(window.innerWidth)
    }

    window.addEventListener("resize", handler)

    return () => window.removeEventListener("resize", handler)
  })

  return windowWidth
}

export function useMemoizedAST() {
  const activeSnippet = useRecoilValue(activeSnippetState)
  const lastValidASTRef = useRef<ERMLParser.AST>()
  const setParsingError = useSetRecoilState(parsingErrorState)

  return useMemo(() => {
    try {
      lastValidASTRef.current = ERMLParser(activeSnippet?.value || "")
      setParsingError(null)
      return lastValidASTRef.current
    } catch (e) {
      setParsingError((e as { message: string }).message)
      return lastValidASTRef.current || []
    }

    // eslint-disable-next-line
  }, [activeSnippet?.value, setParsingError])
}
