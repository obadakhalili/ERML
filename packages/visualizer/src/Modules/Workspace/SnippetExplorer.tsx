import { SyntheticEvent } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import {
  Select,
  ItemPredicate,
  ItemRenderer,
  ItemsEqualComparator,
} from "@blueprintjs/select"
import { Button, MenuItem, Icon } from "@blueprintjs/core"

import {
  snippetsState,
  activeSnippetState,
  newSnippetValueState,
  Snippet,
} from "../../state"

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

export default function SnippetExplorer() {
  const [snippets, setSnippets] = useRecoilState(snippetsState)
  const activeSnippet = useRecoilValue(activeSnippetState)
  const newSnippetValue = useRecoilValue(newSnippetValueState)

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

  function composeSnippetFromQuery(query: string) {
    return {
      name: query,
      active: false,
      value: newSnippetValue,
    }
  }

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
  }
}
