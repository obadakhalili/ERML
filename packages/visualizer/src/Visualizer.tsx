import { lazy, Suspense } from "react"
import { Router } from "@reach/router"

import LoadingComponent from "./components/LoadingComponent"
import LandingPage from "./views/LandingPage"

const Workspace = lazy(() => import("./views/Workspace"))

export default function Visualizer() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Router>
        <LandingPage path="/" />
        <Workspace path="/workspace" />
      </Router>
    </Suspense>
  )
}
