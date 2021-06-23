export function isSnippets(input: any) {
  return (
    input?.constructor === Array &&
    input.every(
      (snippet) =>
        typeof snippet?.active === "boolean" &&
        typeof snippet?.value === "string" &&
        typeof snippet?.name === "string" &&
        snippet.name.length < 31 &&
        snippet.name.length > 0
    ) &&
    input
      .map(({ name }) => name)
      .every((name, idx, names) => names.indexOf(name, idx + 1) < 0)
  )
}
