import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Graveyard from './pages/Graveyard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/graveyard" element={<Graveyard />} />
    </Routes>
  )
}