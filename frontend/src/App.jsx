import { useState } from 'react'
import AuthSystem from './components/login'
import Layout from './components/layout'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Layout/>
    </>
  )
}

export default App
