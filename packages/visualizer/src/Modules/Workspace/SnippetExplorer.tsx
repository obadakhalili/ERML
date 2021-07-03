import { SyntheticEvent, useContext } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import {
  Select,
  ItemPredicate,
  ItemRenderer,
  ItemsEqualComparator,
} from "@blueprintjs/select"
import { Button, MenuItem, Icon, Intent } from "@blueprintjs/core"

import { snippetsState, activeSnippetState, Snippet } from "../../state"
import { AppContext } from "../.."

const SnippetSelect = Select.ofType<Snippet>()

const SnippetItem: ItemRenderer<Snippet> = (
  { name },
  { handleClick, modifiers }
) => {
  const SnippetItemContent = (
    <div onClick={handleClick} className="flex gap-2">
      <div className="w-full">{name}</div>
      <div>
        <Icon
          icon="cross"
          onClick={(event) => {
            event.stopPropagation()
            handleClick(Object.assign(event, { intent: "remove" }))
          }}
        />
      </div>
    </div>
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

function composeSnippetFromQuery(query: string) {
  return {
    name: query,
    active: true,
    value: `ENTITY Example { SIMPLE "attribute" }`,
  }
}

export default function SnippetExplorer() {
  const [snippets, setSnippets] = useRecoilState(snippetsState)
  const activeSnippet = useRecoilValue(activeSnippetState)
  const { toast } = useContext(AppContext)

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
        icon="document"
        text={activeSnippet?.name || "Create New Snippet"}
      />
    </SnippetSelect>
  )

  function handleSnippetSelect(
    selectedSnippet: Snippet,
    event?: SyntheticEvent & { intent?: "add" | "remove" }
  ) {
    event = event!

    if (event.intent === "remove") {
      return setSnippets(
        snippets.filter((snippet) => snippet.name !== selectedSnippet.name)
      )
    }

    const isNotNew = snippets.includes(selectedSnippet)

    if (isNotNew) {
      return setSnippets(
        snippets.map((snippet) => ({
          ...snippet,
          active: snippet === selectedSnippet || false,
        }))
      )
    }

    if (snippets.length === 20) {
      return toast.show({
        intent: Intent.WARNING,
        message: "You cannot store more than 20 snippets",
        timeout: 2500,
      })
    }

    if (selectedSnippet.name.length > 30) {
      return toast.show({
        intent: Intent.WARNING,
        message: "Snippet name cannot exceed 30 characters",
        timeout: 2500,
      })
    }

    setSnippets(
      snippets
        .map((snippet) => ({ ...snippet, active: false }))
        .concat(selectedSnippet)
    )
  }
}
