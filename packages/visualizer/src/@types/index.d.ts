declare module "monaco-vim"
declare module "awesome-dev-jokes"

declare module "dagre-d3" {
  import * as d3 from "d3"
  import * as dagre from "dagre"

  interface Render {
    (
      selection: d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>,
      g: dagre.graphlib.Graph
    ): void
  }

  dagre.graphlib.Graph

  export const render: { new (): Render }
  export const graphlib: typeof dagre.graphlib
}
