import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../utils/auth'

const links = [
  { to: '/', label: 'Home' },
  
]

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getCurrentUser())

  const handleLogout = () => {
    logout()
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-end px-6 md:px-12 py-5">
      <div className="flex items-center gap-4 md:gap-6 text-sm">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `hidden sm:block transition hover:text-[#f3b88c] ${
                isActive ? 'text-[#e8a370]' : 'text-moon/100'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}

        {user ? (
          <>
            <span className="hidden text-moon/80 sm:block">👋 {user.name}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-[#c8743c] bg-black/60 px-4 py-2 text-[#e8a370] transition hover:bg-[#c8743c]/20 hover:text-[#f3b88c]"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="rounded-lg border border-[#e0905a]/70 bg-gradient-to-b from-[#d98250] to-[#9a522b] px-4 py-2 font-semibold text-[#1c0d05] shadow-[0_0_20px_rgba(200,116,60,0.5)] transition hover:from-[#e8935f] hover:to-[#a95c32] hover:shadow-[0_0_30px_rgba(224,144,90,0.75)]"
          >
            Login / Sign up
          </Link>
        )}
      </div>
    </nav>
  )
}