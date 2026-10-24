/**
 * Graveyard page
 * ---------------------------------------------------------------
 * Shows all buried projects (user-created + sample data) as
 * tombstone cards.
 * Features:
 *  - Search by name, summary or tags
 *  - Filter by status (Buried, Haunting, ...)
 *  - Sort by last updated or name
 *  - Filter by year
 * Theme: black + gold (matches Navbar and Auth page)
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import TombstoneCard from '../components/TombstoneCard'
import { sampleProjects, statuses } from '../data/projects'
import { getProjects } from '../utils/storage'

/* ------------------------------------------------------------------
 * Theme constants
 * Keep all gold/black styling here so it can be changed in one place.
 * goldBtn is the same style used in Navbar.jsx and Auth.jsx.
 * ------------------------------------------------------------------ */
const goldBtn =
  'rounded-lg border-2 border-[#d4a537] bg-gradient-to-b from-[#1c1608] to-black px-4 py-2 font-semibold text-[#f5d27a] shadow-[0_0_16px_rgba(212,165,55,0.35)] transition hover:border-[#f5d27a] hover:text-[#ffe9a8] hover:shadow-[0_0_26px_rgba(245,210,122,0.65)]'

// Dropdown (sort / year) style
const selectClass =
  'rounded-lg border border-[#d4a537]/50 bg-black/70 px-4 py-2 text-sm text-[#f5d27a] outline-none transition focus:border-[#f5d27a]'

export default function Graveyard() {
  /* ---------------- State ---------------- */
  const [search, setSearch] = useState('') // search box text
  const [filter, setFilter] = useState('All') // selected status filter
  const [sort, setSort] = useState('recent') // 'recent' | 'name'
  const [year, setYear] = useState('All') // selected year filter

  // Load projects once: user-saved projects first, then sample projects
  const [allProjects] = useState(() => [...getProjects(), ...sampleProjects])

  /* ---------------- Derived data ---------------- */

  // Unique years from "buriedAt" dates, newest first (for the Year dropdown)
  const years = [
    ...new Set(
      allProjects.map((p) => (p.buriedAt || '').slice(0, 4)).filter(Boolean)
    ),
  ]
    .sort()
    .reverse()

  // Apply status filter, year filter, search and sorting (in this order)
  const projects = allProjects
    .filter((p) => filter === 'All' || p.status === filter)
    .filter((p) => year === 'All' || (p.buriedAt || '').startsWith(year))
    .filter((p) =>
      `${p.name || ''} ${p.summary || ''} ${(p.tags || []).join(' ')}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === 'recent'
        ? (b.buriedAt || '').localeCompare(a.buriedAt || '')
        : (a.name || '').localeCompare(b.name || '')
    )

  // Number of projects with a given status (shown on filter buttons)
  const count = (s) => allProjects.filter((p) => p.status === s).length

  /* ---------------- UI ---------------- */
  return (
    // Full-page background image with a dark overlay on top
    <div
      className="min-h-screen bg-black bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.75)), url('/images/graveyard-bg.png')",
      }}
    >
      <Navbar />

      <main className="mx-auto max-w-[1500px] px-6 pb-20 pt-28">
        {/* ---------- Header: title + "Bury a Project" button ---------- */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="font-serif text-6xl text-[#f5d27a] [text-shadow:0_0_30px_rgba(245,210,122,0.35)] md:text-7xl">
              Graveyard
            </h1>
            <p className="mt-2 font-serif text-xl text-[#f5e6c0]/80">
              Where unfinished ideas rest... for now.
            </p>
          </div>

          <Link to="/seance" className={`${goldBtn} px-8 py-4 font-serif text-xl`}>
            Bury a Project
          </Link>
        </div>

        {/* ---------- Search bar ---------- */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects, tags, or keywords..."
          className="mt-8 w-full rounded-xl border border-[#d4a537]/40 bg-black/60 px-6 py-4 text-[#f5e6c0] outline-none backdrop-blur-sm transition placeholder:text-[#f5d27a]/40 focus:border-[#f5d27a] focus:shadow-[0_0_16px_rgba(245,210,122,0.3)] md:w-[70%]"
        />

        {/* ---------- Filters: status buttons + sort + year ---------- */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {/* Status filter buttons with counts */}
          {['All', 'Buried', 'Repurposed', 'Archived'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg border px-5 py-2 text-sm backdrop-blur-sm transition ${
                filter === s
                  ? 'border-[#f5d27a] bg-[#d4a537]/25 text-[#ffe9a8] shadow-[0_0_18px_rgba(245,210,122,0.45)]'
                  : 'border-[#d4a537]/30 bg-black/60 text-[#f5e6c0]/80 hover:border-[#f5d27a]/70 hover:text-[#f5d27a]'
              }`}
            >
              {s} ({s === 'All' ? allProjects.length : count(s)})
            </button>
          ))}

          {/* Sort and Year dropdowns (pushed to the right) */}
          <div className="ml-auto flex gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={selectClass}
            >
              <option className="bg-black" value="recent">Sort: Last updated</option>
              <option className="bg-black" value="name">Sort: Name</option>
            </select>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={selectClass}
            >
              <option className="bg-black" value="All">Year</option>
              {years.map((y) => (
                <option className="bg-black" key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ---------- Project cards ---------- */}
        {projects.length === 0 ? (
          // Empty state when no project matches the filters
          <p className="mt-16 text-center text-[#f5e6c0]/70">
            No graves found. Try another search.
          </p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p) => (
              <TombstoneCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}