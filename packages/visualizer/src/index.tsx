import { Suspense } from "react"
import ReactDOM from "react-dom"
import { RecoilRoot } from "recoil"
import { Spinner, Navbar, Alignment } from "@blueprintjs/core"

import Workspace from "./Workspace"
import "./styles/main.css"

ReactDOM.render(
  <RecoilRoot>
    <Suspense fallback={<Spinner />}>
      <Navbar className="!shadow-none border-0 border-b border-solid border-[#ddd]">
        <Navbar.Group align={Alignment.LEFT}>
          <h3>ERML Visualizer</h3>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <a href="https://erml.netlify.app/" target="_blank" rel="noreferrer">
            ERML
          </a>
          <Navbar.Divider />
          <a
            href="https://github.com/obadakhalili/erml/"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </Navbar.Group>
      </Navbar>
      <Workspace />
    </Suspense>
  </RecoilRoot>,
  document.getElementById("root")
)
