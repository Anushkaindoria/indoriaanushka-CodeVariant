import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Graveyard from './pages/Graveyard'
import Bury from './pages/Bury'
import ProjectDetail from './pages/ProjectDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/graveyard" element={<Graveyard />} />
      <Route path="/seance" element={<Bury />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
    </Routes>
  )
}