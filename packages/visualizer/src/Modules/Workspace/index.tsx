import { useState } from "react"
import { RouteComponentProps } from "@reach/router"
import SplitPane from "react-split-pane"

import SnippetExplorer from "./SnippetExplorer"
import Editor from "./Editor"
import Viewer from "./Viewer"
import { isSnippets } from "../../utils"
import "./styles.css"

export interface Snippet {
  name: string
  value: string
  active: boolean
}

export type Snippets = Snippet[]

export interface AgnosticOps {
  read(): Promise<Snippets>
  update(snippets: Snippets): void
}

export default function Workspace(_: RouteComponentProps) {
  const [activeSnippet, setActiveSnippet] = useState<Snippet>()

  return (
    <SplitPane defaultSize={350} minSize={350} maxSize={750}>
      <>
        <SnippetExplorer
          agnosticOps={agnosticOps}
          onActiveSnippetChange={setActiveSnippet}
        />
        {activeSnippet && <Editor value={activeSnippet.value} />}
      </>
      <Viewer />
    </SplitPane>
  )
}

const agnosticOps: AgnosticOps = {
  async read() {
    try {
      const snippets = JSON.parse(localStorage.getItem("snippets")!)
      if (!isSnippets(snippets)) {
        throw new Error()
      }
      return snippets
    } catch {
      const response = await fetch("./editor-placeholder.erml")
      const defaultSnippet = {
        name: "Library ERD",
        value: await response.text(),
        active: true,
      }
      const snippets = [defaultSnippet]
      this.update(snippets)
      return snippets
    }
  },
  update(snippets) {
    localStorage.setItem("snippets", JSON.stringify(snippets))
  },
}
