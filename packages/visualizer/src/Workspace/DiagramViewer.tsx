// TODO: Allow moving nodes and edges
// TODO: Add "lock diagram" to workspace options
// TODO: Set diagram cursor to "grab" only when diagram is unlocked
// TODO: Add "reset diagram transform" button

import React, { useEffect } from "react"
import { useRecoilState } from "recoil"
import * as d3 from "d3"
import dagreD3 from "dagre-d3"

import {
  debounce,
  mapASTIntoDiagramSchema,
  mapDiagramSchemaIntoDagreSchema,
} from "../utils"
import { workspaceOptionsState, DiagramViewerTransform } from "../state"

const renderDagreSchema = new dagreD3.render()

export default function Diagram({
  diagramSchema,
}: {
  diagramSchema: ReturnType<typeof mapASTIntoDiagramSchema>
}) {
  const dagreSchema = mapDiagramSchemaIntoDagreSchema(diagramSchema)

  const [
    { diagramViewerTransform: diagramViewerInitialTransform },
    setWorkspaceOptions,
  ] = useRecoilState(workspaceOptionsState)

  useEffect(() => {
    const diagramViewer = d3.select<SVGElement, unknown>("#diagramViewer")
    const group = diagramViewer.select("g")

    const setNewDiagramTransform = debounce(
      (diagramViewerTransform: DiagramViewerTransform) =>
        setWorkspaceOptions((options) => ({
          ...options,
          diagramViewerTransform,
        })),
      250
    )

    const zoom = d3.zoom<SVGElement, unknown>().on("zoom", (event) => {
      if (diagramSchema.diagramNodes.length) {
        setNewDiagramTransform(event.transform)
        group.attr("transform", event.transform)
      }
    })

    diagramViewer
      .call(zoom)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(
            diagramViewerInitialTransform.x,
            diagramViewerInitialTransform.y
          )
          .scale(diagramViewerInitialTransform.k)
      )

    // eslint-disable-next-line
  }, [diagramSchema])

  useEffect(
    () => renderDagreSchema(d3.select("#diagramViewer g"), dagreSchema),
    [dagreSchema]
  )

  return (
    <svg id="diagramViewer" width="100%" height="100%">
      <g cursor="grab" />
    </svg>
  )
}
