const KEY = 'graveyard_projects'

export function getProjects() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function addProject(project) {
  const all = getProjects()
  localStorage.setItem(KEY, JSON.stringify([project, ...all]))
}