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