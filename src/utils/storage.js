import { seedProjects } from '../data/projects'
/**
 * Storage helper
 * Saves and reads user-created projects from localStorage.
 */
const KEY = 'graveyard_projects'

// Read all saved projects (returns [] if nothing saved or data is broken)
const SEEDED_KEY = 'graveyard_seeded'

export function getProjects() {
  try {
    if (!localStorage.getItem(SEEDED_KEY)) {
      const existing = JSON.parse(localStorage.getItem(KEY)) || []
      localStorage.setItem(KEY, JSON.stringify([...existing, ...seedProjects]))
      localStorage.setItem(SEEDED_KEY, '1')
    }
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

// Merge two projects into a new one; archive the originals (user-created only)
export function mergeProjects(a, b) {
  const uniq = (x, y) => [...new Set([...(x || []), ...(y || [])])]
  const today = new Date().toISOString().slice(0, 10)

  const merged = {
    id: 'frank-' + Date.now(),
    name: `${a.name} + ${b.name}`,
    icon: '⚡',
    years: String(new Date().getFullYear()),
    status: 'Repurposed',
    progress: Math.round(((a.progress ?? 0) + (b.progress ?? 0)) / 2),
    tags: uniq(a.tags, b.tags),
    summary: `Stitched from ${a.name} and ${b.name}.`,
    vision: `${a.vision || a.summary || ''} ${b.vision || b.summary || ''}`.trim(),
    completed: uniq(a.completed, b.completed),
    unfinished: uniq(a.unfinished, b.unfinished),
    salvage: uniq(a.salvage, b.salvage),
    epitaph: `Stitched from ${a.name} and ${b.name}.`,
        story: `${a.name}: ${a.story || a.vision || a.summary || ''}\n\n${b.name}: ${b.story || b.vision || b.summary || ''}`.trim(),
    reasons: [...(a.reasons || []), ...(b.reasons || [])],
    features: uniq(a.features, b.features),
    techStack: uniq(a.techStack, b.techStack),
    reason: a.reason || b.reason || '',
    reasonNote: [a.reasonNote, b.reasonNote].filter(Boolean).join(' | '),
    startDate: a.startDate || a.createdAt || '',
    lastActive: today,
    mergedFrom: [a, b],
    createdAt: today,
    buriedAt: today,
  }

  addProject(merged)

  const userIds = new Set(getProjects().map((p) => p.id))
  ;[a, b].forEach((p) => {
    if (userIds.has(p.id)) updateProjectStatus(p.id, 'Archived')
  })

  return merged
}