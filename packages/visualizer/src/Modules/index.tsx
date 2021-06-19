import { lazy, Suspense } from "react"
import { Router } from "@reach/router"
import { Spinner } from "@blueprintjs/core"

const LandingPage = lazy(() => import("./LandingPage"))
const Profile = lazy(() => import("./Profile"))
const Workspace = lazy(() => import("./Workspace"))

export default function Visualizer() {
  return (
    <Suspense fallback={<Spinner />}>
      <Router>
        <LandingPage path="/" />
        <Profile path="/profile" />
        <Workspace path="/workspace" />
      </Router>
    </Suspense>
  )
}
