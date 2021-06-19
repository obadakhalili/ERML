import { lazy, Suspense } from "react"
import { Router } from "@reach/router"

import LoadingSpinner from "./components/LoadingSpinner"
import LandingPage from "./views/LandingPage"

const Workspace = lazy(() => import("./views/Workspace"))

export default function Visualizer() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Router>
        <LandingPage path="/" />
        <Workspace path="/workspace" />
      </Router>
    </Suspense>
  )
}
