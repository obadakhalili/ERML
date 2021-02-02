const identifiers: string[] = []

export function isValidIdentifier(identifier: string) {
  /** Valid identifier requirements
   * Maximum of 30 characters long
   * Starts with an uppercase/lowercase letter (a-z, A-Z)
   * Every character after the first character should either be a number, an underscore, or an uppercase/lowercase letter (a-z, A-Z)
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