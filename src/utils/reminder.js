import { getProjects } from './storage'

export function checkRestartReminders() {
  const today = new Date().toISOString().slice(0, 10)
  const due = getProjects().filter(
    (p) => p.willRestart && p.restartDate && p.restartDate <= today
  )
  due.forEach((p) => alert(`⏰ Time to restart "${p.name}"!`))
}