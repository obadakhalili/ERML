import { Suspense, useEffect } from "react"
import ReactDOM from "react-dom"
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil"
import {
  Spinner,
  Navbar as BPNavbar,
  Icon,
  Alignment,
  Classes,
} from "@blueprintjs/core"

import Workspace from "./Workspace"
import { themeState } from "./state"
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
        <Icon
          onClick={handleThemeIconClick}
          icon={theme === "dark" ? "flash" : "moon"}
          className="hover:cursor-pointer hover:opacity-80"
        />
        <BPNavbar.Divider />
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

  function handleThemeIconClick() {
    toggleTheme(theme === "dark" ? "light" : "dark")
  }
}

const App = () => {
  const theme = useRecoilValue(themeState)

  useEffect(
    () =>
      document.body.classList[theme === "dark" ? "add" : "remove"](
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
