import React, { Suspense, useEffect } from "react"
import ReactDOM from "react-dom"
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil"
import {
  Spinner,
  Navbar as BPNavbar,
  Alignment,
  Classes,
} from "@blueprintjs/core"

import Workspace from "./Workspace"
import { themeState, Theme } from "./state"
import "./styles/main.css"

const SuspenseFallback = (
  <div className="h-screen flex justify-center">
    <Spinner />
  </div>
)

const Navbar = () => {
  const [theme, toggleTheme] = useRecoilState(themeState)

  return (
    <BPNavbar>
      <BPNavbar.Group>
        <BPNavbar.Heading>
          <h3 className="font-semibold">ERML Visualizer</h3>
        </BPNavbar.Heading>
      </BPNavbar.Group>
      <BPNavbar.Group align={Alignment.RIGHT}>
        {/* TODO: Support dark mode for diagram viewer */}
        {/* <span
          onClick={handleThemeIconClick}
          className="font-semibold cursor-pointer hover:opacity-80"
        >
          {theme === Theme.DARK ? Theme.LIGHT : Theme.DARK}
        </span>
        <BPNavbar.Divider /> */}
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

  // eslint-disable-next-line
  function handleThemeIconClick() {
    toggleTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)
  }
}

const App = () => {
  const theme = useRecoilValue(themeState)

  useEffect(
    () =>
      document.body.classList[theme === Theme.DARK ? "add" : "remove"](
        Classes.DARK
      ),
    [theme]
  )

  return (
    <>
      <Navbar />
      <Workspace />
    </>
  )
}

ReactDOM.render(
  <RecoilRoot>
    <Suspense fallback={SuspenseFallback}>
      <App />
    </Suspense>
  </RecoilRoot>,
  document.getElementById("root")
)
