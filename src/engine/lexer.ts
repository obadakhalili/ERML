export interface Token {
  value: string
  position: number
  line: number
}
export type Tokens = Token[]

export default function (ERML: string): Tokens {
  const matches = ERML.matchAll(
    /\w+|{|}|\[|\]|<|>|\(|\)|,|"(?:[^"\\]|\\.)*"|#.*|\/\*[^]*?\*\//g
  )
  return (Array.from(matches) as { [index: number]: string; index: number }[])
    .map(({ 0: value, index: position }) => {
      const line = (ERML.slice(0, position).match(/\n/g)?.length || 0) + 1
      return { value, position, line }
    })
    .filter(({ value }) => /#.*|\/\*[^]*?\*\//.test(value) === false)
}
