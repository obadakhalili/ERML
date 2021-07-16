import { atom, selector, AtomEffect } from "recoil"

import {
  isNotValidSnippets,
  isNotValidTheme,
  isNotValidWorkspaceOptions,
} from "./utils"

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
  defaultValue: () => T | Promise<T>,
  isJSON = true
) {
  const effect: AtomEffect<T> = ({ setSelf, onSet }) => {
    try {
      const item = isJSON
        ? JSON.parse(localStorage.getItem(key)!)
        : localStorage.getItem(key)

      if (isNotValid(item)) {
        throw new Error()
      }

      setSelf(item)
    } catch {
      Promise.resolve(defaultValue()).then((defaultValue) => {
        setSelf(defaultValue)
        localStorage.setItem(
          key,
          isJSON
            ? JSON.stringify(defaultValue)
            : (defaultValue as unknown as string)
        )
      })
    }

    onSet((newValue) =>
      localStorage.setItem(
        key,
        isJSON ? JSON.stringify(newValue) : (newValue as unknown as string)
      )
    )
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
  key: "WorkspaceOptionsState",
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
    localStorageSideEffect<ITheme>(
      "theme",
      isNotValidTheme,
      () => Theme.DARK,
      false
    ),
  ],
})
