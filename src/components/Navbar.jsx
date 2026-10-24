import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../utils/auth'

// Navigation links shown on the left side of the bar
const links = [
  { to: '/', label: 'Home' },
]

// Shared black + gold button style (used by Home, Login and Logout)
const goldBtn =
  'rounded-lg border-2 border-[#d4a537] bg-gradient-to-b from-[#1c1608] to-black px-4 py-2 font-semibold text-[#f5d27a] shadow-[0_0_16px_rgba(212,165,55,0.35)] transition hover:border-[#f5d27a] hover:text-[#ffe9a8] hover:shadow-[0_0_26px_rgba(245,210,122,0.65)]'

/**
 * Navbar
 * ---------------------------------------------------------------
 * Top bar shown on every page.
 *  - Left  : Home link
 *  - Right : logged-in user name + Logout, or a Login / Sign up link
 */
export default function Navbar() {
  const navigate = useNavigate()

  // Current logged-in user (null when nobody is logged in)
  const [user, setUser] = useState(getCurrentUser())

  // Log out, clear the user from state and go back to the landing page
  const handleLogout = () => {
    logout()
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-5">
      {/* LEFT: Home */}
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === '/'}
          // Highlight the link when its route is active
          className={({ isActive }) =>
            `${goldBtn} ${
              isActive ? 'border-[#f5d27a] shadow-[0_0_26px_rgba(245,210,122,0.6)]' : ''
            }`
          }
        >
          {l.label}
        </NavLink>
      ))}

      {/* RIGHT: user name + Login / Logout */}
      <div className="flex items-center gap-4 md:gap-6 text-sm">
        {user ? (
          <>
            <span className="hidden text-[#f5d27a] sm:block">👋 {user.name}</span>
            <button onClick={handleLogout} className={goldBtn}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className={goldBtn}>
            Login / Sign up
          </Link>
        )}
      </div>
    </nav>
  )
}