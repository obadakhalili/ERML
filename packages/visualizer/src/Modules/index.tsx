import { lazy, Suspense } from "react"
import { Router } from "@reach/router"
import { Spinner, Navbar, Alignment } from "@blueprintjs/core"

const LandingPage = lazy(() => import("./LandingPage"))
const Profile = lazy(() => import("./Profile"))
const Workspace = lazy(() => import("./Workspace"))

export default function Visualizer() {
  return (
    <Suspense fallback={<Spinner />}>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>
            <h3>ERML Visualizer</h3>
          </Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>Login</Navbar.Group>
      </Navbar>
      <Router>
        <LandingPage path="/" />
        <Profile path="/profile" />
        <Workspace path="/workspace" />
      </Router>
    </Suspense>
  )
}
