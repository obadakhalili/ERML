import { useEffect, useState } from "react"

export function useWindowWidth() {
  const [windowWidth, setWindowSize] = useState(window.innerWidth)

  useEffect(() => {
    const handler = () => {
      setWindowSize(window.innerWidth)
    }

    window.addEventListener("resize", handler)

    return () => window.removeEventListener("resize", handler)
  })

  return windowWidth
}
