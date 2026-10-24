/**
 * Auth page
 * ---------------------------------------------------------------
 * Handles both Login and Sign up in a single card.
 * - Uses localStorage-based helpers from ../utils/auth
 * - On success, redirects the user to /graveyard
 * - Theme: black + gold (matches the Navbar buttons)
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { login, signup } from '../utils/auth'

/* ------------------------------------------------------------------
 * Theme constants
 * Keep all gold/black styling here so the theme can be changed
 * from one place. goldBtn is identical to the one in Navbar.jsx.
 * ------------------------------------------------------------------ */
const goldBtn =
  'rounded-lg border-2 border-[#d4a537] bg-gradient-to-b from-[#1c1608] to-black px-4 py-2 font-semibold text-[#f5d27a] shadow-[0_0_16px_rgba(212,165,55,0.35)] transition hover:border-[#f5d27a] hover:text-[#ffe9a8] hover:shadow-[0_0_26px_rgba(245,210,122,0.65)]'

const inputClass =
  'w-full rounded-lg border border-[#d4a537]/30 bg-black/70 px-4 py-3 text-[#f5e6c0] placeholder:text-[#f5d27a]/40 outline-none transition focus:border-[#f5d27a] focus:shadow-[0_0_14px_rgba(245,210,122,0.35)]'

const labelClass = 'mb-1.5 block text-sm text-[#f5d27a]'

export default function Auth() {
  const navigate = useNavigate()

  /* ---------------- State ---------------- */
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [error, setError] = useState('') // validation / server error message
  const [show, setShow] = useState(false) // show or hide password
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const isSignup = mode === 'signup'

  /* ---------------- Handlers ---------------- */

  // Update a single form field and clear any previous error
  const update = (field, value) => {
    setForm({ ...form, [field]: value })
    setError('')
  }

  // Switch between Login and Sign up tabs
  const switchMode = (m) => {
    setMode(m)
    setError('')
  }

  // Validate the form, then call login() or signup()
  const submit = () => {
    if (isSignup && !form.name.trim()) return setError('Please enter your name')
    if (!form.email.includes('@')) return setError('Please enter a valid email')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')

    const result = isSignup ? signup(form) : login(form)
    if (!result.ok) return setError(result.error)

    navigate('/graveyard')
  }

  /* ---------------- UI ---------------- */
  return (
    // Full-page background image
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/gate-bg.png')" }}
    >
      {/* Dark overlay so the card stays readable */}
      <div className="min-h-screen bg-black/60">
        <Navbar />

        <main className="flex min-h-screen items-center justify-center px-6 pb-10 pt-24">
          {/* Auth card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl border-2 border-[#d4a537]/70 bg-gradient-to-b from-[#1c1608]/90 to-black/90 p-7 shadow-[0_0_40px_rgba(212,165,55,0.25)] backdrop-blur-md"
          >
            {/* Header */}
            <div className="text-center">
              <div className="text-4xl">💀</div>
              <h1 className="mt-2 font-metal text-4xl tracking-wide text-[#f5d27a] drop-shadow-[0_0_14px_rgba(245,210,122,0.5)]">
                {isSignup ? 'Join the Graveyard' : 'Welcome Back'}
              </h1>
              <p className="mt-2 font-serif text-sm text-[#f5e6c0]/80">
                {isSignup
                  ? 'Create an account to bury your unfinished ideas.'
                  : 'Your buried ideas are waiting for you.'}
              </p>
            </div>

            {/* Login / Sign up toggle */}
            <div className="mt-6 grid grid-cols-2 rounded-xl border border-[#d4a537]/30 bg-black/60 p-1 text-sm">
              {['login', 'signup'].map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`rounded-lg py-2 transition ${
                    mode === m
                      ? 'bg-[#d4a537]/20 text-[#f5d27a] shadow-[0_0_12px_rgba(212,165,55,0.35)]'
                      : 'text-[#f5e6c0]/60 hover:text-[#f5d27a]'
                  }`}
                >
                  {m === 'login' ? 'Log in' : 'Sign up'}
                </button>
              ))}
            </div>

            {/* Form fields */}
            <div className="mt-5 space-y-4">
              {/* Name field (sign up only) */}
              {isSignup && (
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    className={inputClass}
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                </div>
              )}

              {/* Email field */}
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
              </div>

              {/* Password field with show/hide toggle */}
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    className={inputClass}
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submit()} // submit on Enter
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#f5d27a]/60 transition hover:text-[#f5d27a]"
                  >
                    {show ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-400">
                  {error}
                </p>
              )}

              {/* Primary action button */}
              <button onClick={submit} className={`${goldBtn} w-full py-3`}>
                {isSignup ? 'Create account ⚰️' : 'Enter the Graveyard'}
              </button>
            </div>

            {/* Switch mode link */}
            <p className="mt-5 text-center text-sm text-[#f5e6c0]/70">
              {isSignup ? 'Already have an account? ' : 'New here? '}
              <button
                onClick={() => switchMode(isSignup ? 'login' : 'signup')}
                className="text-[#f5d27a] underline transition hover:text-[#ffe9a8]"
              >
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </p>

            {/* Guest access */}
            <button
              onClick={() => navigate('/graveyard')}
              className="mt-3 block w-full text-center text-xs text-[#f5d27a]/50 transition hover:text-[#f5d27a]"
            >
              Just looking around? Continue as guest →
            </button>
          </motion.div>
        </main>
      </div>
    </div>
  )
}