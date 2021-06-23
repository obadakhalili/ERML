import { useState, useEffect, useMemo, SyntheticEvent } from "react"
import {
  ItemPredicate,
  ItemRenderer,
  ItemsEqualComparator,
  Select,
} from "@blueprintjs/select"
import { Button, MenuItem, Icon } from "@blueprintjs/core"

import { Snippet, Snippets, AgnosticOps } from "."

const SnippetSelect = Select.ofType<Snippet>()

const SnippetItem: ItemRenderer<Snippet> = (
  { name },
  { handleClick, modifiers }
) => {
  const SnippetItemContent = (
    <>
      <div onClick={handleClick}>
        {name}
        <Icon
          icon="cross"
          onClick={(event) => {
            event.stopPropagation()
            handleClick(Object.assign(event, { intent: "remove" }))
          }}
          style={{ float: "right", marginTop: 2.5 }}
        />
      </div>
    </>
  )

  return (
    <MenuItem key={name} text={SnippetItemContent} active={modifiers.active} />
  )
}

const NoResultsSnippetItem = (
  <MenuItem disabled={true} text="Type to add a snippet" />
)

const snippetPredicate: ItemPredicate<Snippet> = (query, { name }) =>
  name.toLowerCase().includes(query.toLowerCase())

const snippetsEqual: ItemsEqualComparator<Snippet> = (
  firstSnippet,
  secondSnippet
) => firstSnippet.name === secondSnippet.name

const composeSnippetFromQuery = (query: string) => ({
  name: query,
  active: false,
  value: `ENTITY Example { SIMPLE "attribute" }`,
})

export default function SnippetExplorer({
  agnosticOps,
  onActiveSnippetChange,
}: {
  agnosticOps: AgnosticOps
  onActiveSnippetChange(snippet: Snippet | undefined): void
}) {
  const [snippets, setSnippets] = useState<Snippets>([])

  const activeSnippet = useMemo(
    () => snippets.find(({ active }) => active) || snippets[0],
    [snippets]
  )

  useEffect(() => {
    onActiveSnippetChange(activeSnippet)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippets])

  useEffect(() => {
    agnosticOps.read().then(setSnippets)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SnippetSelect
      resetOnSelect
      items={snippets}
      activeItem={activeSnippet}
      itemPredicate={snippetPredicate}
      itemsEqual={snippetsEqual}
      createNewItemFromQuery={composeSnippetFromQuery}
      onItemSelect={handleSnippetSelect}
      itemRenderer={SnippetItem}
      noResults={NoResultsSnippetItem}
      createNewItemRenderer={(query, _, handleClick) => (
        <MenuItem
          icon="add"
          text={`Create "${query}"`}
          onClick={(event) =>
            handleClick(Object.assign(event, { intent: "add" }))
          }
        />
      )}
    >
      <Button
        rightIcon="double-caret-vertical"
        text={activeSnippet?.name || "Create New Snippet"}
      />
    </SnippetSelect>
  )

  function handleSnippetSelect(
    selectedSnippet: Snippet,
    event?: SyntheticEvent & { intent?: "add" | "remove" }
  ) {
    const newSnippets =
      event!.intent === "remove"
        ? snippets.filter((snippet) => snippet.name !== selectedSnippet.name)
        : (event!.intent === "add"
            ? snippets.concat(selectedSnippet)
            : snippets
          ).map((snippet) => ({
            ...snippet,
            active:
              snippet.name === selectedSnippet.name
                ? true
                : snippet.active
                ? false
                : snippet.active,
          }))
    setSnippets(newSnippets)
    agnosticOps.update(newSnippets)
  }
}
