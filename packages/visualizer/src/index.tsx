import { createContext } from "react"
import ReactDOM from "react-dom"
import { RecoilRoot } from "recoil"
import { Toaster, IToaster } from "@blueprintjs/core"

import Modules from "./Modules"
import "./styles/main.css"

export const ToasterContext = createContext<IToaster>(undefined!)

ReactDOM.render(
  <RecoilRoot>
    <ToasterContext.Provider value={Toaster.create()}>
      <Modules />
    </ToasterContext.Provider>
  </RecoilRoot>,
  document.getElementById("root")
)
