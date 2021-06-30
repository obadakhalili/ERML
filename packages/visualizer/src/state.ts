import { atom, selector, AtomEffect } from "recoil"

import { isNotValidSnippets, isNotValidWorkspaceOptions } from "./utils"

export interface Snippet {
  name: string
  value: string
  active: boolean
}

export type Snippets = Snippet[]

export interface WorkspaceOptions {
  vimEnabled: boolean
  lineWrapped: boolean
  splitPaneDefaultSize: number
  activeViewer: "Diagram" | "AST"
}

function localStorageSideEffect<T>(
  key: string,
  isNotValid: (value: any) => boolean,
  defaultValue: () => T | Promise<T>
) {
  const effect: AtomEffect<T> = ({ setSelf, onSet }) => {
    try {
      const parsedItem = JSON.parse(localStorage.getItem(key)!)

      if (isNotValid(parsedItem)) {
        throw new Error()
      }

      setSelf(parsedItem)
    } catch {
      Promise.resolve(defaultValue()).then((defaultValue) => {
        setSelf(defaultValue)
        localStorage.setItem(key, JSON.stringify(defaultValue))
      })
    }

    onSet((newValue) => localStorage.setItem(key, JSON.stringify(newValue)))
  }

  return effect
}

export const snippetsState = atom<Snippets>({
  key: "snippetsState",
  default: [],
  effects_UNSTABLE: [
    localStorageSideEffect<Snippets>(
      "snippets",
      isNotValidSnippets,
      async () => {
        const response = await fetch("./editor-placeholder.erml")
        return [
          {
            name: "Library ERD",
            value: await response.text(),
            active: true,
          },
        ]
      }
    ),
  ],
})

export const activeSnippetState = selector<Snippet | undefined>({
  key: "activeSnippetState",
  get({ get }) {
    const snippets = get(snippetsState)
    return snippets.find(({ active }) => active) || snippets[0]
  },
  set({ set }, newValue) {
    set(snippetsState, (snippets) =>
      snippets.map((snippet) =>
        snippet.name === (newValue as Snippet).name
          ? (newValue as Snippet)
          : snippet
      )
    )
  },
})

export const firstSnippetValueState = atom<string | undefined>({
  key: "firstSnippetValueState",
  default: undefined,
})

export const workspaceOptionsState = atom<WorkspaceOptions>({
  key: "WorkspaceOptionsState",
  default: {} as WorkspaceOptions,
  effects_UNSTABLE: [
    localStorageSideEffect<WorkspaceOptions>(
      "workspace_options",
      isNotValidWorkspaceOptions,
      () => ({
        vimEnabled: false,
        lineWrapped: false,
        splitPaneDefaultSize: 350,
        activeViewer: "Diagram",
      })
    ),
  ],
})
