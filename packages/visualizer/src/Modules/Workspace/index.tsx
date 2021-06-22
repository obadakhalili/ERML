import { useEffect, useState, MouseEventHandler, SyntheticEvent } from "react"
import { RouteComponentProps } from "@reach/router"
import SplitPane from "react-split-pane"
import { useLocalStorage } from "react-use"
import { IItemRendererProps, Select } from "@blueprintjs/select"
import { Button, MenuItem, Spinner, Icon } from "@blueprintjs/core"

import Editor from "./Editor"
import "./styles.css"

export interface Snippet {
  name: string
  value: string
}

type Snippets = Snippet[]

export default function Workspace(_: RouteComponentProps) {
  return (
    <SplitPane defaultSize={350} minSize={350} maxSize={750}>
      <LeftPane />
      <RightPane />
    </SplitPane>
  )
}

const SnippetSelect = Select.ofType<Snippet>()

function SnippetItem(
  { name }: Snippet,
  { handleClick, modifiers }: IItemRendererProps
) {
  const ItemContent = (
    <>
      <div onClick={handleClick}>
        {name}
        <Icon
          icon="cross"
          onClick={(e) => {
            const event = e as typeof e & { intent: string }
            event.stopPropagation()
            event.intent = "remove"
            handleClick(event)
          }}
          style={{ float: "right", marginTop: 2.5 }}
        />
      </div>
    </>
  )

  return <MenuItem key={name} text={ItemContent} active={modifiers.active} />
}

function CreateNewSnippetItem(
  query: string,
  active: boolean,
  handleClick: MouseEventHandler<HTMLElement>
) {
  return (
    <MenuItem
      icon="add"
      text={`Create "${query}"`}
      active={active}
      onClick={handleClick}
    />
  )
}

function LeftPane() {
  const [snippets, setSnippets] = useLocalStorage("snippets", null, {
    raw: false,
    serializer: JSON.stringify,
    deserializer(serializedSnippets) {
      const parsedSnippets: Snippets = JSON.parse(serializedSnippets)
      return parsedSnippets.constructor !== Array ||
        parsedSnippets.some(
          (snippet) =>
            snippet.name?.length > 25 ||
            snippet.name?.length < 1 ||
            typeof snippet.name !== "string" ||
            typeof snippet.value !== "string"
        ) ||
        parsedSnippets
          .map(({ name }) => name)
          .some((name, idx, names) => names.indexOf(name, idx + 1) > 0)
        ? null
        : parsedSnippets
    },
  })

  const [activeSnippet, setActiveSnippet] = useState<Snippet | null>(
    snippets?.[0] || null
  )

  useEffect(() => {
    if (!snippets) {
      fetch("./code-placeholder.erml")
        .then((res) => res.text())
        .then((placeholder) => {
          const defaultSnippet = {
            name: "Library Database ERD",
            value: placeholder,
          }
          setActiveSnippet(defaultSnippet)
          setSnippets([defaultSnippet])
        })
    }
  })

  return snippets == null ? (
    <Spinner />
  ) : (
    <>
      <SnippetSelect
        resetOnSelect
        activeItem={activeSnippet}
        items={snippets}
        itemRenderer={SnippetItem}
        createNewItemRenderer={CreateNewSnippetItem}
        onItemSelect={handleSnippetSelect}
        itemPredicate={snippetPredicate}
        createNewItemFromQuery={createNewSnippetFromQuery}
        itemsEqual={snippetsEqual}
      >
        <Button rightIcon="double-caret-vertical">
          {activeSnippet?.name || "Create New Snippet"}
        </Button>
      </SnippetSelect>
      {activeSnippet ? (
        <Editor snippet={activeSnippet} />
      ) : (
        <h1>Add Snippets</h1>
      )}
    </>
  )

  function handleSnippetSelect(
    snippet: Snippet,
    e?: SyntheticEvent<HTMLElement> & { intent?: string }
  ) {
    if (e!.intent === "remove") {
      const newSnippets = snippets!.filter(({ name }) => name !== snippet.name)
      setSnippets(newSnippets)
      if (
        snippet.name === activeSnippet!.name &&
        snippet.value === activeSnippet!.value
      ) {
        setActiveSnippet(newSnippets[0])
      }
    } else {
      const isNew = !snippets!.some(({ name }) => name === snippet.name)

      if (isNew) {
        if (snippet.name.length > 25) {
          return
        }
        setSnippets(snippets!.concat(snippet))
      }

      setActiveSnippet(snippet)
    }
  }

  function snippetPredicate(query: string, { name }: Snippet) {
    return name.toLowerCase().includes(query.toLowerCase())
  }

  function createNewSnippetFromQuery(name: string): Snippet {
    return {
      name,
      value: "// ERML code",
    }
  }

  function snippetsEqual(firstSnippet: Snippet, secondSnippet: Snippet) {
    return firstSnippet.name === secondSnippet.name
  }
}

function RightPane() {
  return <h1>Viewer</h1>
}
