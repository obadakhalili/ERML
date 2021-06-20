import { FC, useEffect } from "react"
import { RouteComponentProps } from "@reach/router"
import SplitPane from "react-split-pane"
import { useLocalStorage } from "react-use"

import Editor from "./Editor"
import "./styles.css"

const Workspace: FC<RouteComponentProps> = () => (
  <SplitPane defaultSize={350} minSize={350} maxSize={750}>
    <LeftPane />
    <RightPane />
  </SplitPane>
)

interface Snippet {
  name: string
  ERML: string
}

type Snippets = Snippet[]

function LeftPane() {
  const [snippets, setSnippets] = useLocalStorage(
    "snippets",
    null as unknown as Snippets,
    {
      raw: false,
      serializer: (snippets: Snippets) => JSON.stringify(snippets),
      deserializer(serializedSnippets: string) {
        const snippets = JSON.parse(serializedSnippets)
        return (snippets.constructor === Array &&
          snippets.every(
            (snippet) =>
              typeof snippet.name === "string" &&
              typeof snippet.ERML === "string"
          ) &&
          snippets) as unknown as Snippets
      },
    }
  )

  useEffect(() => {
    if (!snippets) {
      fetch("./code-placeholder.erml")
        .then((res) => res.text())
        .then((ERML) => setSnippets([{ name: "Placeholder", ERML }]))
    }
  })

  return <Editor value={snippets?.[0]?.ERML || ""} />
}

function RightPane() {
  return <h1>Viewer</h1>
}

export default Workspace
