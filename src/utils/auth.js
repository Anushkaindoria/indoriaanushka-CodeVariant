const USERS_KEY = 'graveyard_users'
const SESSION_KEY = 'graveyard_session'

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export function signup({ name, email, password }) {
  const users = read(USERS_KEY, [])
  const mail = email.trim().toLowerCase()
  if (users.some((u) => u.email === mail)) {
    return { ok: false, error: 'An account with this email already exists' }
  }
  const user = { id: Date.now().toString(), name: name.trim(), email: mail, password }
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ id: user.id, name: user.name, email: user.email })
  )
  return { ok: true }
}

export function login({ email, password }) {
  const users = read(USERS_KEY, [])
  const mail = email.trim().toLowerCase()
  const user = users.find((u) => u.email === mail && u.password === password)
  if (!user) return { ok: false, error: 'Wrong email or password' }
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ id: user.id, name: user.name, email: user.email })
  )
  return { ok: true }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser() {
  return read(SESSION_KEY, null)
}