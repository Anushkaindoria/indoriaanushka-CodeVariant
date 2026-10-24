import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Bury from './pages/Bury'
import Graveyard from './pages/Graveyard'
import { checkRestartReminders } from './utils/reminder'
import Compass from './pages/Compass'


export default function App() {
  useEffect(() => {
    checkRestartReminders()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/seance" element={<Bury />} />
      <Route path="/graveyard" element={<Graveyard />} />
      <Route path="/compass" element={<Compass />} />
    </Routes>
  )
}