import { atom, selector, DefaultValue } from "recoil"

import {
  getSnippetsFromLocalStorage,
  saveSnippetsToLocalStorage,
} from "./utils"

export interface Snippet {
  name: string
  value: string
  active: boolean
}

export type Snippets = Snippet[]

export type ActiveViewer = "Diagram" | "AST"

export const snippetsState = atom<Snippets>({
  key: "snippetsState",
  default: getSnippetsFromLocalStorage(),
  effects_UNSTABLE: [
    ({ onSet }) =>
      onSet((snippets, oldSnippets) =>
        saveSnippetsToLocalStorage(
          snippets instanceof DefaultValue
            ? (oldSnippets as Snippets)
            : snippets
        )
      ),
  ],
})

export const activeSnippetState = selector<Snippet | undefined>({
  key: "activeSnippetState",
  get({ get }) {
    const snippets = get(snippetsState)
    return snippets.find(({ active }) => active) || snippets[0]
  },
})

export const activeViewerState = atom<ActiveViewer>({
  key: "activeViewerState",
  default: "Diagram",
})
