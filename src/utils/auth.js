/**
 * Auth helper (demo only)
 * ---------------------------------------------------------------
 * Simple signup / login using localStorage. There is no real server,
 * so passwords are stored as plain text. Do not use this in production.
 *
 *  - graveyard_users   : list of all registered users
 *  - graveyard_session : the currently logged-in user (without password)
 */
const USERS_KEY = 'graveyard_users'
const SESSION_KEY = 'graveyard_session'

// Read and parse a localStorage value; return fallback if missing or broken
function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

// Create a new account and log the user in right away
export function signup({ name, email, password }) {
  const users = read(USERS_KEY, [])
  const mail = email.trim().toLowerCase()

  // Reject duplicate emails
  if (users.some((u) => u.email === mail)) {
    return { ok: false, error: 'An account with this email already exists' }
  }

  const user = { id: Date.now().toString(), name: name.trim(), email: mail, password }
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))

  // Start a session (password is not stored in the session)
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ id: user.id, name: user.name, email: user.email })
  )
  return { ok: true }
}

// Check email + password and start a session if they match
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

// End the current session
export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

// Return the logged-in user, or null if nobody is logged in
export function getCurrentUser() {
  return read(SESSION_KEY, null)
}