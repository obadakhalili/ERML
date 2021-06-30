export const isNotValidSnippets = (value: any) =>
  value?.constructor !== Array ||
  value.some(
    (item) =>
      typeof item?.active !== "boolean" ||
      typeof item?.value !== "string" ||
      typeof item?.name !== "string" ||
      item.name.length > 30 ||
      item.name.length < 1
  ) ||
  value
    .map(({ name }) => name)
    .some((name, idx, names) => names.indexOf(name, idx + 1) > -1)

export const isNotValidWorkspaceOptions = (value: any) =>
  value?.constructor !== Object ||
  typeof value.vimEnabled !== "boolean" ||
  typeof value.lineWrapped !== "boolean" ||
  typeof value.splitPaneDefaultSize !== "number" ||
  typeof value.activeViewer !== "string"
