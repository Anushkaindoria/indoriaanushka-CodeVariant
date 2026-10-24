import { getProjects } from './storage'

/**
 * Restart reminders
 * ---------------------------------------------------------------
 * Finds projects whose resume date has arrived (today or earlier).
 * Note: this is NOT called from App.jsx anymore (no popup alerts).
 * It only returns the list, so a page can show it in the UI if needed.
 */
export function getDueReminders() {
  // Today's date as YYYY-MM-DD, same format the date inputs save
  const today = new Date().toISOString().slice(0, 10)

  // Keep projects that want to resume and whose date is due
  return getProjects().filter(
    (p) => p.wantsResume && p.resumeDate && p.resumeDate <= today
  )
}