import { createContext, useState, useMemo, useEffect, FC } from "react"
import { RouteComponentProps } from "@reach/router"
import SplitPane from "react-split-pane"

import EditorPane from "./EditorPane"
import ViewerPane from "./ViewerPane"
import {
  getSnippetsFromLocalStorage,
  saveSnippetsToLocalStorage,
} from "../../utils"
import "./styles.css"

export interface Snippet {
  name: string
  value: string
  active: boolean
}

export type Snippets = Snippet[]

export type ActiveViewer = "Diagram" | "AST"

export const WorkspaceContext = createContext<{
  activeSnippet: Snippet | undefined
  activeViewer: ActiveViewer
  setActiveViewer: (activeViewer: ActiveViewer) => void
  snippets: Snippets
  setSnippets: (snippets: Snippets) => void
}>(undefined!)

const Workspace: FC<RouteComponentProps> = () => {
  const [snippets, setSnippets] = useState<Snippets>([])
  const [activeViewer, setActiveViewer] = useState<ActiveViewer>("Diagram")

  const activeSnippet = useMemo(
    () => snippets.find(({ active }) => active) || snippets[0],
    [snippets]
  )

  useEffect(() => {
    getSnippetsFromLocalStorage().then(setSnippets)
  }, [])

  return (
    <WorkspaceContext.Provider
      value={{
        activeSnippet,
        activeViewer,
        setActiveViewer,
        snippets,
        setSnippets: (snippets) => {
          setSnippets(snippets)
          saveSnippetsToLocalStorage(snippets)
        },
      }}
    >
      <SplitPane defaultSize={350} minSize={350} maxSize={750}>
        <EditorPane />
        <ViewerPane activeViewer={activeViewer} />
      </SplitPane>
    </WorkspaceContext.Provider>
  )
}

export default Workspace
