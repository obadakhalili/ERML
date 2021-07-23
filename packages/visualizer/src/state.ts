import { atom, selector, AtomEffect } from "recoil"

import { isNotValidSnippets, isNotValidWorkspaceOptions } from "./utils"

export interface Snippet {
  name: string
  value: string
  active: boolean
}

export type Snippets = Snippet[]

export enum ActiveViewer {
  DIAGRAM = "Diagram",
  AST = "AST",
}

export interface IWorkspaceOptions {
  vimEnabled: boolean
  wordWrapped: boolean
  minimapDisplayed: boolean
  splitPaneDefaultSize: number
  activeViewer: ActiveViewer
}

export enum Theme {
  DARK = "Dark",
  LIGHT = "Light",
}

type ITheme = `${Theme}`

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

export const workspaceOptionsState = atom<IWorkspaceOptions>({
  key: "workspaceOptionsState",
  default: {} as IWorkspaceOptions,
  effects_UNSTABLE: [
    localStorageSideEffect<IWorkspaceOptions>(
      "workspace_options",
      isNotValidWorkspaceOptions,
      () => ({
        vimEnabled: false,
        wordWrapped: false,
        minimapDisplayed: true,
        splitPaneDefaultSize: 350,
        activeViewer: ActiveViewer.DIAGRAM,
      })
    ),
  ],
})

export const parsingErrorState = atom<string | null>({
  key: "parsingErrorState",
  default: null,
})

export const themeState = atom<ITheme>({
  key: "themeState",
  default: Theme.DARK,
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      const theme = localStorage.getItem("theme") as Theme

      setSelf([Theme.DARK, Theme.LIGHT].includes(theme) ? theme : Theme.LIGHT)
      onSet((theme) => localStorage.setItem("theme", theme as Theme))
    },
  ],
})
