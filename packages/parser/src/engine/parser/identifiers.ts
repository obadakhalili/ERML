let identifiers: string[] = []

export function isValidIdentifier(identifier: string) {
  /** Valid identifier requirements:
   * Maximum of 30 characters
   * Starts with an uppercase/lowercase letter (a-z, A-Z), or an underscore
   * Every character after the first should either be a number, an underscore, or an uppercase/lowercase letter (a-z, A-Z)
   */
  return /^[a-zA-Z_]\w{0,29}$/.test(identifier)
}

export function isValidReference(identifier: string) {
  return identifiers.includes(identifier)
}

export function isDuplicateIdentifier(identifier: string) {
  const isDuplicate = identifiers.includes(identifier)

  if (isDuplicate) {
    return true
  }

  identifiers.push(identifier)
  return false
}

export function clearIdentifiers() {
  identifiers = []
}
