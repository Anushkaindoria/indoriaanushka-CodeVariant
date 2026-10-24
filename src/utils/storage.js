/**
 * Storage helper
 * Saves and reads user-created projects from localStorage.
 */
const KEY = 'graveyard_projects'

// Read all saved projects (returns [] if nothing saved or data is broken)
export function getProjects() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

// Add a new project at the top of the saved list
export function addProject(project) {
  const all = getProjects()
  localStorage.setItem(KEY, JSON.stringify([project, ...all]))
}
// Delete one saved project by id
export function deleteProject(id) {
  localStorage.setItem(KEY, JSON.stringify(getProjects().filter((p) => p.id !== id)))
}
// Change the status of a saved project (e.g. 'Archived')
export function updateProjectStatus(id, status) {
  const all = getProjects().map((p) => (p.id === id ? { ...p, status } : p))
  localStorage.setItem(KEY, JSON.stringify(all))
}
// Notes are stored per project id
const NOTES_KEY = 'graveyard_notes'

export function getNotes(id) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTES_KEY)) || {}
    return all[id] || []
  } catch {
    return []
  }
}

export function saveNotes(id, notes) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTES_KEY)) || {}
    all[id] = notes
    localStorage.setItem(NOTES_KEY, JSON.stringify(all))
  } catch {
    // ignore storage errors
  }
}