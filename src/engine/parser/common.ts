export function isValidIdentifier(identifier: string) {
  /** Valid Identifier Requirements:
   * TODO: ...
   */
  return /^[a-zA-Z_]\w{0,29}$/.test(identifier)
}

export function groupingSymbolsMatchAt(
  tokens: string[],
  currentPosition: number,
  openingSymbol: string,
  closingSymbol: string
) {
  let groupingSymbolsScales = 0

  do {
    groupingSymbolsScales +=
      tokens[currentPosition] === openingSymbol
        ? 1
        : tokens[currentPosition] === closingSymbol
        ? -1
        : 0

    if (groupingSymbolsScales === 0) {
      return currentPosition
    }
  } while (++currentPosition < tokens.length)

  return null
}
