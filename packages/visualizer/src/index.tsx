import { createContext } from "react"
import ReactDOM from "react-dom"
import { RecoilRoot } from "recoil"
import { Toaster, IToaster } from "@blueprintjs/core"

import Modules from "./Modules"
import "./styles/main.css"

export const AppContext = createContext<{ toast: IToaster }>(undefined!)

ReactDOM.render(
  <RecoilRoot>
    <AppContext.Provider value={{ toast: Toaster.create() }}>
      <Modules />
    </AppContext.Provider>
  </RecoilRoot>,
  document.getElementById("root")
)
