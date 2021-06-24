import ReactDOM from "react-dom"
import { RecoilRoot } from "recoil"

import Modules from "./Modules"
import "./index.css"

ReactDOM.render(
  <RecoilRoot>
    <Modules />
  </RecoilRoot>,
  document.getElementById("root")
)
