import { SnippetRules } from "./Workspace/SnippetExplorer"

export const isNotValidSnippets = (value: any) =>
  value?.constructor !== Array ||
  value.length > SnippetRules.SNIPPETS_MAX_LENGTH ||
  value.some(
    (item) =>
      typeof item?.active !== "boolean" ||
      typeof item?.value !== "string" ||
      typeof item?.name !== "string" ||
      item.name.length > SnippetRules.SNIPPET_MAX_LENGTH ||
      item.name.length < SnippetRules.SNIPPET_MIN_LENGTH
  ) ||
  value
    .map(({ name }) => name)
    .some((name, idx, names) => names.indexOf(name, idx + 1) > -1)

export const isNotValidWorkspaceOptions = (value: any) =>
  value?.constructor !== Object ||
  typeof value.vimEnabled !== "boolean" ||
  typeof value.wordWrapped !== "boolean" ||
  typeof value.minimapDisplayed !== "boolean" ||
  typeof value.splitPaneDefaultSize !== "number" ||
  typeof value.activeViewer !== "string"

export function debounce(fn: Function, timeout = 500) {
  let handle: NodeJS.Timeout
  return (...args: unknown[]) => {
    if (handle) {
      clearTimeout(handle)
    }
    handle = setTimeout(() => fn(...args), timeout)
  }
}
