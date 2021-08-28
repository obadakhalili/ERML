import { useEffect, useRef } from "react"
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

  const diagramViewerRef = useRef<any>()
  const groupRef = useRef<any>()

  const [workspaceOptions, setworkspaceOptions] = useRecoilState(
    workspaceOptionsState
  )

  useEffect(() => {
    diagramViewerRef.current = d3.select("#diagramViewer")
    groupRef.current = d3.select("#diagramViewer g")

    const zoom = d3.zoom().on("zoom", (event: any) => {
      groupRef.current.attr("transform", event.transform)
      setworkspaceOptions({
        ...workspaceOptions,
        diagramViewerTransform: event.transform,
      })
    })
    diagramViewerRef.current.call(zoom)
  }, [workspaceOptions, setworkspaceOptions])

  useEffect(
    () => renderDagreSchema(groupRef.current, dagreSchema),
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
