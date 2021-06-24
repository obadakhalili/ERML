import { Snippets } from "./state"

export async function getSnippetsFromLocalStorage(): Promise<Snippets> {
  try {
    const snippets = JSON.parse(localStorage.getItem("snippets")!)
    if (isNotSnippets(snippets)) {
      throw new Error()
    }
    return snippets
  } catch {
    const response = await fetch("./editor-placeholder.erml")
    const snippets = [
      {
        name: "Library ERD",
        value: await response.text(),
        active: true,
      },
    ]
    return snippets
  }

  function isNotSnippets(input: any) {
    return (
      input?.constructor !== Array ||
      input.some(
        (snippet) =>
          typeof snippet?.active !== "boolean" ||
          typeof snippet?.value !== "string" ||
          typeof snippet?.name !== "string" ||
          snippet.name.length > 30 ||
          snippet.name.length < 1
      ) ||
      input
        .map(({ name }) => name)
        .some((name, idx, names) => names.indexOf(name, idx + 1) > -1)
    )
  }
}

export function saveSnippetsToLocalStorage(snippets: Snippets) {
  localStorage.setItem("snippets", JSON.stringify(snippets))
}
