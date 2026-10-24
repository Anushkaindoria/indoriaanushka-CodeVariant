<<<<<<< HEAD
const KEY = 'graveyard_projects'

=======
/**
 * Storage helper
 * Saves and reads user-created projects from localStorage.
 */
const KEY = 'graveyard_projects'

// Read all saved projects (returns [] if nothing saved or data is broken)
>>>>>>> 6e42ac04555d78d8442ae2da8d442e600dca6c17
export function getProjects() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

<<<<<<< HEAD
=======
// Add a new project at the top of the saved list
>>>>>>> 6e42ac04555d78d8442ae2da8d442e600dca6c17
export function addProject(project) {
  const all = getProjects()
  localStorage.setItem(KEY, JSON.stringify([project, ...all]))
}