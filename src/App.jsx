import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Bury from './pages/Bury'
import Graveyard from './pages/Graveyard'
import ProjectDetail from './pages/ProjectDetail'
import Compass from './pages/Compass'
import Lab from './pages/Lab'

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/seance" element={<Bury />} />
      <Route path="/graveyard" element={<Graveyard />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/compass/:id" element={<Compass />} />
      <Route path="/lab/:id" element={<Lab />} />
    </Routes>
  )
}