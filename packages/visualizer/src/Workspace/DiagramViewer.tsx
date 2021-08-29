import { useEffect } from "react"
import { useRecoilState } from "recoil"
import * as d3 from "d3"
import dagreD3 from "dagre-d3"

import {
  mapASTIntoDiagramSchema,
  mapDiagramSchemaIntoDagreSchema,
} from "../utils"
import { workspaceOptionsState } from "../state"

const renderDagreSchema = new dagreD3.render()

export default function Diagram({
  diagramSchema,
}: {
  diagramSchema: ReturnType<typeof mapASTIntoDiagramSchema>
}) {
  const dagreSchema = mapDiagramSchemaIntoDagreSchema(diagramSchema)

  const [workspaceOptions, setWorkspaceOptions] = useRecoilState(
    workspaceOptionsState
  )

  useEffect(() => {
    const diagramViewer = d3.select<SVGElement, unknown>("#diagramViewer")
    const group = diagramViewer.select("g")

    diagramViewer.call(
      d3
        .zoom<SVGElement, unknown>()
        .on("zoom", (event) => group.attr("transform", event.transform))
    )

    window.addEventListener("beforeunload", () => {
      const {
        e: x,
        f: y,
        d: k,
      } = (group.node() as SVGGElement).transform.baseVal.consolidate().matrix

      setWorkspaceOptions({
        ...workspaceOptions,
        diagramViewerTransform: { x, y, k },
      })
    })
  }, [workspaceOptions, setWorkspaceOptions])

  useEffect(
    () => renderDagreSchema(d3.select("#diagramViewer g"), dagreSchema),
    [dagreSchema]
  )

  return (
    <svg id="diagramViewer" width="100%" height="100%">
      <g
        transform={`translate(${workspaceOptions.diagramViewerTransform?.x}, ${workspaceOptions.diagramViewerTransform?.y}), scale(${workspaceOptions.diagramViewerTransform?.k})`}
      />
    </svg>
  )
}
