import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Bury from './pages/Bury'
import { checkRestartReminders } from './utils/reminder'

export default function App() {
  useEffect(() => {
    checkRestartReminders()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/seance" element={<Bury />} />
    </Routes>
  )
}