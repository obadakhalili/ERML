import ReactDOM from "react-dom"
import { RecoilRoot } from "recoil"

import Modules from "./Modules"
import "./styles/main.css"

ReactDOM.render(
  <RecoilRoot>
    <Modules />
  </RecoilRoot>,
  document.getElementById("root")
)
