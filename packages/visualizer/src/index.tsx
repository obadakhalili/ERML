import { Suspense } from "react"
import ReactDOM from "react-dom"
import { RecoilRoot } from "recoil"
import { Spinner, Navbar as BPNavbar, Alignment } from "@blueprintjs/core"

import Workspace from "./Workspace"
import "./styles/main.css"

const SuspenseFallback = (
  <div className="h-screen flex justify-center">
    <Spinner />
  </div>
)

const Navbar = () => (
  <BPNavbar>
    <BPNavbar.Group>
      <BPNavbar.Heading>
        <h3 className="font-semibold">ERML Visualizer</h3>
      </BPNavbar.Heading>
    </BPNavbar.Group>
    <BPNavbar.Group align={Alignment.RIGHT}>
      <a href="https://erml.netlify.app/" target="_blank" rel="noreferrer">
        ERML
      </a>
      <BPNavbar.Divider />
      <a
        href="https://github.com/obadakhalili/erml/"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
    </BPNavbar.Group>
  </BPNavbar>
)

ReactDOM.render(
  <RecoilRoot>
    <Suspense fallback={SuspenseFallback}>
      <div className="bp3-dark">
        <Navbar />
        <Workspace />
      </div>
    </Suspense>
  </RecoilRoot>,
  document.getElementById("root")
)
