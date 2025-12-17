import { useState, useEffect } from 'react'
import Landing from './pages/Landing'
import Wrapper from './pages/Wrapper'

function App() {
  const [hasVisited, setHasVisited] = useState(false)

  useEffect(() => {
    const visited = localStorage.getItem('hasVisited')
    if (visited) {
      setHasVisited(true)
    }
  }, [])

  const handleGetStarted = () => {
    localStorage.setItem('hasVisited', 'true')
    setHasVisited(true)
  }

  return (
    <>
      {hasVisited ? <Wrapper /> : <Landing onGetStarted={handleGetStarted} />}
    </>
  )
}

export default App