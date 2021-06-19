import { FC } from "react"
import { Link, RouteComponentProps } from "@reach/router"

const LandingPage: FC<RouteComponentProps> = () => (
  <main>
    <h1>Landing Page</h1>
    <button>
      <Link to="/profile">Profile</Link>
    </button>
    <button>
      <Link to="/workspace">Workspace</Link>
    </button>
  </main>
)

export default LandingPage
