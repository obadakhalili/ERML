declare module "monaco-vim"
declare module "awesome-dev-jokes"

namespace dagreD3 {
  import * as d3 from "d3"
  import * as dagre from "dagre"
  interface Render {
    (
      selection: d3.Selection<d3.BaseType, any, d3.BaseType, any>,
      g: dagre.graphlib.Graph
    ): void
  }

  export const render: { new (): Render }
}
