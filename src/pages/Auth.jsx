import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { login, signup } from '../utils/auth'

const inputClass =
  'w-full rounded-lg border border-fern/20 bg-night/70 px-4 py-3 text-moon placeholder:text-moon/40 outline-none focus:border-fern'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const isSignup = mode === 'signup'
  const update = (field, value) => {
    setForm({ ...form, [field]: value })
    setError('')
  }

  const switchMode = (m) => {
    setMode(m)
    setError('')
  }

  const submit = () => {
    if (isSignup && !form.name.trim()) return setError('Please enter your name')
    if (!form.email.includes('@')) return setError('Please enter a valid email')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')

    const result = isSignup ? signup(form) : login(form)
    if (!result.ok) return setError(result.error)
    navigate('/graveyard')
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/gate-bg.jpg')" }}
    >
      <div className="min-h-screen bg-night/60">
        <Navbar />

        <main className="flex min-h-screen items-center justify-center px-6 pb-10 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-2xl border border-fern/30 bg-night/80 p-7 shadow-[0_0_40px_rgba(142,230,160,0.2)] backdrop-blur-md"
          >
            <div className="text-center">
              <div className="text-4xl">💀</div>
              <h1 className="mt-2 font-metal text-4xl tracking-wide text-moon drop-shadow-[0_0_14px_rgba(142,230,160,0.5)]">
                {isSignup ? 'Join the Graveyard' : 'Welcome Back'}
              </h1>
              <p className="mt-2 font-serif text-sm text-moon/80">
                {isSignup
                  ? 'Create an account to bury your unfinished ideas.'
                  : 'Your buried ideas are waiting for you.'}
              </p>
            </div>

            {/* Login / Signup toggle */}
            <div className="mt-6 grid grid-cols-2 rounded-xl border border-fern/20 bg-black/40 p-1 text-sm">
              {['login', 'signup'].map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`rounded-lg py-2 transition ${
                    mode === m
                      ? 'bg-fern/20 text-fern shadow-[0_0_12px_rgba(142,230,160,0.3)]'
                      : 'text-moon/70 hover:text-moon'
                  }`}
                >
                  {m === 'login' ? 'Log in' : 'Sign up'}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {isSignup && (
                <div>
                  <label className="mb-1.5 block text-sm">Name</label>
                  <input
                    className={inputClass}
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm">Email</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm">Password</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    className={inputClass}
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-moon/60 hover:text-fern"
                  >
                    {show ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-950/30 px-3 py-2 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                onClick={submit}
                className="w-full rounded-lg bg-fern/90 py-3 font-semibold text-night shadow-[0_0_20px_rgba(142,230,160,0.4)] transition hover:bg-fern"
              >
                {isSignup ? 'Create account ⚰️' : 'Enter the Graveyard'}
              </button>
            </div>

            <p className="mt-5 text-center text-sm text-moon/70">
              {isSignup ? 'Already have an account? ' : 'New here? '}
              <button
                onClick={() => switchMode(isSignup ? 'login' : 'signup')}
                className="text-fern underline"
              >
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </p>

            <button
              onClick={() => navigate('/graveyard')}
              className="mt-3 block w-full text-center text-xs text-moon/50 transition hover:text-fern"
            >
              Just looking around? Continue as guest →
            </button>
          </motion.div>
        </main>
      </div>
    </div>
  )
}