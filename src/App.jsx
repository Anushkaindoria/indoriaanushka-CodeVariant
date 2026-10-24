import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Bury from './pages/Bury'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/seance" element={<Bury />} />
    </Routes>
  )
}