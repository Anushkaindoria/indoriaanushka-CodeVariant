/**
 * ProjectDetail page
 * ---------------------------------------------------------------
 * Shows the full details of a single project (route: /project/:id).
 * - Looks up the project in user-saved projects + sample projects
 * - Left side: header, tabs and the Overview panels
 * - Right side: Revival Compass, quick actions, mood and notes
 * Theme: black + gold (matches Navbar, Auth and Graveyard)
 */
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Pencil, Compass, BookOpen, Skull, Clock, FileText, Info, Lock,
  ExternalLink, Zap, Trash2, Archive, Save, HeartCrack, Search, ListChecks,
  Download, Users, Code2, Sprout, Link2,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { sampleProjects } from '../data/projects'
import { getProjects, deleteProject } from '../utils/storage'

/* ------------------------------------------------------------------
 * Theme constants
 * Keep all gold/black styling here so the theme can be changed
 * from one place. goldBtn is the same style used in Navbar.jsx.
 * ------------------------------------------------------------------ */
const goldBtn =
  'rounded-lg border-2 border-[#d4a537] bg-gradient-to-b from-[#1c1608] to-black px-4 py-2 font-semibold text-[#f5d27a] shadow-[0_0_16px_rgba(212,165,55,0.35)] transition hover:border-[#f5d27a] hover:text-[#ffe9a8] hover:shadow-[0_0_26px_rgba(245,210,122,0.65)]'

// Small inner card used inside panels (reasons, features)
const innerCard = 'rounded-lg border border-[#d4a537]/25 bg-black/50 p-3'

// Pill used for tags
const pill = 'rounded-full border border-[#d4a537]/40 bg-black/50 text-[#f5e6c0]'

/* ------------------------------------------------------------------
 * Status badge colors (kept colorful so status is easy to recognise)
 * ------------------------------------------------------------------ */
const badgeClass = {
  Buried: 'bg-amber-300 text-stone-900 shadow-[0_0_16px_rgba(252,211,77,0.6)]',
  Haunting: 'bg-orange-400 text-stone-900 shadow-[0_0_16px_rgba(251,146,60,0.6)]',
  Resurrected: 'bg-[#39ff88] text-stone-900 shadow-[0_0_16px_rgba(57,255,136,0.6)]',
  Repurposed: 'bg-cyan-300 text-stone-900 shadow-[0_0_16px_rgba(103,232,249,0.6)]',
  Archived: 'bg-violet-300 text-stone-900 shadow-[0_0_16px_rgba(196,181,253,0.6)]',
}

// Tab definitions (only "overview" has content for now)
const tabs = [
  { key: 'overview', label: 'Overview', icon: BookOpen },
  { key: 'autopsy', label: 'Autopsy', icon: Skull },
  { key: 'timeline', label: 'Timeline', icon: Clock },
  { key: 'notes', label: 'Notes', icon: FileText },
]

// Icons are reused in a loop for reasons and features
const reasonIcons = [Clock, Code2, Users]
const featureIcons = [Search, ListChecks, Download, Users]

// Border/text colors for tech stack icons
const techColors = {
  HTML: 'border-orange-500 text-orange-400',
  CSS: 'border-blue-500 text-blue-400',
  JavaScript: 'border-yellow-400 text-yellow-300',
  'Node.js': 'border-green-500 text-green-400',
  MongoDB: 'border-emerald-400 text-emerald-300',
  React: 'border-cyan-400 text-cyan-300',
}

/* ------------------------------------------------------------------
 * Panel frame settings (uses /images/box.png as a border image)
 *  FRAME_SLICE : thickness of the border inside the image (image px)
 *  FRAME_WIDTH : thickness of the border on screen (px). Smaller = thinner frame
 *  PAD_*       : space between the frame and the content.
 *                Increase these if content touches the frame.
 * ------------------------------------------------------------------ */
const FRAME_SLICE = 160
const FRAME_WIDTH = 22
const PAD_TOP = 30
const PAD_X = 28
const PAD_BOTTOM = 28

/* ---------------- Reusable components ---------------- */

// Decorative framed box that wraps each section
function Panel({ className = '', children }) {
  return (
    <section
      className={`relative min-w-0 ${className}`}
      style={{
        borderStyle: 'solid',
        borderWidth: `${FRAME_WIDTH}px`,
        borderImageSource: "url('/images/box.png')",
        borderImageSlice: `${FRAME_SLICE} fill`,
        borderImageWidth: `${FRAME_WIDTH}px`,
        borderImageRepeat: 'stretch',
        padding: `${PAD_TOP}px ${PAD_X}px ${PAD_BOTTOM}px`,
      }}
    >
      {children}
    </section>
  )
}

// Heading with an icon at the top of each panel
function PanelTitle({ icon: Icon, children }) {
  return (
    <h2 className="mb-4 flex items-center gap-2.5 font-serif text-xl text-[#f5d27a]">
      <Icon className="h-5 w-5 shrink-0" />
      {children}
    </h2>
  )
}

// Gold progress bar (value is a percentage 0-100)
function Progress({ value }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#d4a537]/40 bg-black/60">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#b8862b] to-[#f5d27a] shadow-[0_0_10px_rgba(245,210,122,0.7)]"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

// One label/value row inside the Project Info panel
function Row({ label, children }) {
  return (
    <div className="grid grid-cols-[90px_1fr] items-center gap-3">
      <dt className="text-[#f5d27a]/80">{label}</dt>
      <dd className="min-w-0 text-[#f5e6c0]">{children}</dd>
    </div>
  )
}

// Button used in the Quick Actions panel (danger = red style)
function ActionBtn({ icon: Icon, children, danger,onClick }) {
  return (
    <button
        onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
        danger
          ? 'border-red-500/40 bg-red-950/20 text-red-400 hover:border-red-400'
          : 'border-[#d4a537]/25 bg-black/50 text-[#f5e6c0] hover:border-[#f5d27a]'
      }`}
    >
      <Icon className="h-4 w-4" /> {children}
    </button>
  )
}

/* ---------------- Page ---------------- */
export default function ProjectDetail() {
  // Project id comes from the URL: /project/:id
  const { id } = useParams()
  const project = [...getProjects(), ...sampleProjects].find((p) => p && p.id === id)
  const navigate = useNavigate()
// Only user-created projects can be edited
    const isUser = getProjects().some((p) => p.id === id)

  /* State */
  const [tab, setTab] = useState('overview') // active tab
  const [mood, setMood] = useState('Still excites me') // selected mood
  const [note, setNote] = useState('') // quick note text

  // Fallback when the id does not match any project
  if (!project) {
    return (
      <div className="min-h-screen bg-black p-10 text-[#f5e6c0]">
        <p>Project not found</p>
        <Link to="/graveyard" className="text-[#f5d27a] underline">Back to Graveyard</Link>
      </div>
    )
  }

  // Safe defaults so missing fields never crash the page
  const tags = project.tags || []
  const completion = project.completion ?? project.progress ?? 0
  const reasons = project.reasons || []
  const features = project.features || []
  const stack = project.techStack || []
  // Delete this project (user-created only) and go back to the Graveyard
    const handleDelete = () => {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return
    deleteProject(project.id)
    navigate('/graveyard')
    }

  return (
    // Full-page background image
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed text-[#f5e6c0]"
      style={{ backgroundImage: "url('/images/project-detail.png')" }}
    >
      {/* Dark overlay for readability */}
      <div className="min-h-screen bg-black/55">
        <Navbar />

        <main className="mx-auto max-w-[1500px] px-8 pb-24 pt-24">
          {/* ---------- Top bar: back + edit ---------- */}
          <div className="flex items-center justify-between">
            <Link to="/graveyard" className={`${goldBtn} inline-flex items-center gap-2 text-sm`}>
              <ArrowLeft className="h-4 w-4" /> Back to Graveyard
            </Link>

            {isUser && (
            <button
                onClick={() => navigate(`/seance?edit=${project.id}`)}
                className={`${goldBtn} inline-flex items-center gap-2 text-sm`}
            >
                <Pencil className="h-4 w-4" /> Edit
            </button>
            )}
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* ============ LEFT COLUMN ============ */}
            <div className="min-w-0">
              {/* ----- Header: tombstone, title, memorial slab ----- */}
              <section className="relative flex flex-col gap-6 lg:flex-row lg:items-start">
                {/* Tombstone image with a sprout icon on top */}
                <div className="relative h-56 w-44 shrink-0">
                  <img src="/images/Tombstone.png" alt="" className="h-full w-full object-contain" />
                  <Sprout
                    strokeWidth={1.5}
                    className="absolute left-1/2 top-[40%] h-16 w-16 -translate-x-1/2 text-[#f5d27a] drop-shadow-[0_0_10px_rgba(245,210,122,0.8)]"
                  />
                </div>

                {/* Title block: status, name, years, vision, tags */}
                <div className="flex-1">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${
                      badgeClass[project.status] || badgeClass.Buried
                    }`}
                  >
                    ⚰ {project.status}
                  </span>
                  <h1 className="mt-2 font-serif text-5xl text-[#f5d27a] [text-shadow:0_0_24px_rgba(245,210,122,0.3)] md:text-6xl">
                    {project.name}
                  </h1>
                  <p className="mt-1 text-xl text-[#f5e6c0]/90">{project.years}</p>
                  <p className="mt-3 max-w-lg text-base leading-relaxed text-[#f5e6c0]/85">
                    {project.vision || project.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span key={t} className={`${pill} px-4 py-1 text-sm`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Memorial slab: epitaph and progress */}
                <div className="relative w-full shrink-0 rounded-t-[60px] rounded-b-xl border border-[#d4a537]/40 bg-black/60 px-6 pb-5 pt-8 text-center shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] lg:mt-24 lg:w-72">
                  <Skull className="absolute -top-5 left-1/2 h-9 w-9 -translate-x-1/2 text-[#f5d27a]" />
                  <Sprout className="mx-auto h-7 w-7 text-[#f5d27a]" />
                  <p className="mt-2 font-serif text-base italic">
                    “{project.epitaph || 'A better way to prepare, waiting for its next chapter.'}”
                  </p>
                  <div className="mt-4 text-left">
                    <Progress value={completion} />
                    <p className="mt-1.5 text-xs">{completion}% complete</p>
                    <p className="text-xs text-[#f5e6c0]/70">Last active: {project.lastActive || '—'}</p>
                  </div>
                </div>
              </section>

              {/* ----- Tabs ----- */}
              <nav className="mt-6 flex flex-wrap gap-2 border-b border-[#d4a537]/20">
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`inline-flex items-center gap-2 rounded-t-lg border border-b-0 px-6 py-3 text-sm transition ${
                      tab === key
                        ? 'border-[#d4a537]/60 bg-black/70 text-[#f5d27a] shadow-[inset_0_-2px_0_#d4a537]'
                        : 'border-[#d4a537]/15 bg-black/40 text-[#f5e6c0]/70 hover:text-[#f5d27a]'
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </nav>

              {/* ----- Tab content ----- */}
              {tab !== 'overview' ? (
                // Placeholder for tabs that are not built yet
                <Panel className="mt-10">
                  <p className="text-[#f5e6c0]/70">
                    {tabs.find((t) => t.key === tab).label} — coming soon.
                  </p>
                </Panel>
              ) : (
                <div className="mt-10 grid gap-x-10 gap-y-10 xl:grid-cols-[1.15fr_1fr]">
                  {/* Column A: story, reasons, features */}
                  <div className="min-w-0 space-y-10">
                    <Panel>
                      <PanelTitle icon={BookOpen}>Project Story</PanelTitle>
                      <p className="leading-relaxed text-[#f5e6c0]/85">{project.story || project.summary}</p>

                      <h3 className="mb-3 mt-6 flex items-center gap-2.5 font-serif text-xl text-[#f5d27a]">
                        <HeartCrack className="h-5 w-5 text-rose-400" /> Why it was abandoned
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {reasons.map((r, i) => {
                          const Icon = reasonIcons[i % reasonIcons.length]
                          return (
                            <div key={r.title} className={innerCard}>
                              <p className="flex items-center gap-2 text-sm underline underline-offset-2">
                                <Icon className="h-4 w-4 shrink-0 text-[#f5d27a]" /> {r.title}
                              </p>
                              <p className="mt-1 text-xs text-[#f5e6c0]/65">{r.text}</p>
                            </div>
                          )
                        })}
                      </div>
                    </Panel>

                    <Panel>
                      <PanelTitle icon={ListChecks}>Key Features (Planned)</PanelTitle>
                      <div className="grid grid-cols-2 gap-3">
                        {features.map((f, i) => {
                          const Icon = featureIcons[i % featureIcons.length]
                          return (
                            <div key={f} className={`${innerCard} text-xs`}>
                              <Icon className="mb-2 h-5 w-5 text-[#f5d27a]" />
                              {f}
                            </div>
                          )
                        })}
                      </div>
                    </Panel>
                  </div>

                  {/* Column B: project info, tech stack */}
                  <div className="min-w-0 space-y-10">
                    <Panel>
                      <PanelTitle icon={Info}>Project Info</PanelTitle>
                      <dl className="space-y-3 text-sm">
                        <Row label="Start date">{project.startDate || '—'}</Row>
                        <Row label="Last active">{project.lastActive || '—'}</Row>
                        <Row label="Status">
                          <span
                            className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                              badgeClass[project.status] || badgeClass.Buried
                            }`}
                          >
                            {project.status}
                          </span>
                        </Row>
                        <Row label="Completion">
                          <div className="flex items-center gap-3">
                            <div className="min-w-0 flex-1"><Progress value={completion} /></div>
                            <span className="shrink-0">{completion}%</span>
                          </div>
                        </Row>
                        <Row label="Visibility">
                          <span className="inline-flex items-center gap-2">
                            <Lock className="h-4 w-4 text-[#f5d27a]" /> {project.visibility || 'Private'}
                          </span>
                        </Row>
                        <Row label="Tags">
                          <div className="flex flex-wrap gap-2">
                            {tags.slice(0, 2).map((t) => (
                              <span key={t} className={`${pill} px-3 py-0.5 text-xs`}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </Row>
                        <Row label="Links">
                          <div className="space-y-1.5">
                            <a href={project.github || '#'} className="flex items-center gap-2 underline hover:text-[#f5d27a]">
                              <Code2 className="h-4 w-4 shrink-0" /> GitHub Repository
                              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                            </a>
                            <a href={project.demo || '#'} className="flex items-center gap-2 underline hover:text-[#f5d27a]">
                              <Link2 className="h-4 w-4 shrink-0" /> Live Demo (if any)
                              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                            </a>
                          </div>
                        </Row>
                      </dl>
                    </Panel>

                    <Panel>
                      <PanelTitle icon={Code2}>Tech Stack (Planned)</PanelTitle>
                      <div className="grid grid-cols-5 gap-2">
                        {stack.map((t) => (
                          <div key={t} className="flex min-w-0 flex-col items-center gap-2 text-[11px]">
                            <span
                              className={`flex h-11 w-11 items-center justify-center rounded-full border-2 bg-black/60 text-xs font-bold ${
                                techColors[t] || 'border-[#d4a537]/50 text-[#f5d27a]'
                              }`}
                            >
                              {t.slice(0, 2)}
                            </span>
                            <span className="max-w-full truncate">{t}</span>
                          </div>
                        ))}
                      </div>
                    </Panel>
                  </div>
                </div>
              )}
            </div>

            {/* ============ RIGHT SIDEBAR ============ */}
            <aside className="min-w-0 space-y-10 lg:mt-24">
              {/* Revival Compass card (no frame) */}
              <div className="relative rounded-2xl border border-[#d4a537]/30 bg-black/50 px-4 py-5 text-center backdrop-blur-[2px]">
                <div className="flex items-center gap-3 text-left">
                  <Compass className="h-9 w-9 shrink-0 text-[#f5d27a]" />
                  <div>
                    <h2 className="font-serif text-xl text-[#f5d27a]">The Revival Compass</h2>
                    <p className="text-xs text-[#f5e6c0]/70">Let’s find the right path for {project.name}</p>
                  </div>
                </div>

                <img
                  src="/images/compass.png"
                  alt="Compass"
                  className="mx-auto my-2 h-44 w-44 object-contain drop-shadow-[0_0_18px_rgba(245,210,122,0.6)]"
                />

                {/* Opens the Compass page for this project */}
                <Link
                  to={`/compass/${project.id}`}
                  className={`${goldBtn} flex w-full items-center justify-center gap-2`}
                >
                  <Compass className="h-4 w-4" /> Open Revival Compass
                </Link>
              </div>

              {/* Quick actions (buttons are placeholders for now) */}
              <Panel>
                <PanelTitle icon={Zap}>Quick Actions</PanelTitle>
                <div className="space-y-2 text-sm">
                  {isUser && (
                    <ActionBtn icon={Pencil} onClick={() => navigate(`/seance?edit=${project.id}`)}>
                        Edit Project
                    </ActionBtn>
                    )}
                  <ActionBtn icon={Archive}>Move to Archived</ActionBtn>
                  {isUser && (
                    <ActionBtn icon={Trash2} danger onClick={handleDelete}>
                        Delete
                    </ActionBtn>
                    )}
                </div>
              </Panel>

              {/* Mood selector + quick note */}
              <Panel>
                <PanelTitle icon={Skull}>Project Mood</PanelTitle>
                <div className="space-y-2 text-sm">
                  {['Still excites me', 'Maybe later', 'Not interested now'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
                        mood === m
                          ? 'border-[#f5d27a]/70 bg-[#d4a537]/15 text-[#f5d27a]'
                          : 'border-[#d4a537]/20 bg-black/50 hover:border-[#d4a537]/50'
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          mood === m ? 'border-[#f5d27a]' : 'border-[#f5e6c0]/40'
                        }`}
                      >
                        {mood === m && <span className="h-2 w-2 rounded-full bg-[#f5d27a]" />}
                      </span>
                      {m}
                    </button>
                  ))}
                </div>

                <h2 className="mb-2 mt-5 flex items-center gap-2.5 font-serif text-xl text-[#f5d27a]">
                  <FileText className="h-5 w-5" /> Notes
                </h2>
                <div className="flex gap-2">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a quick note..."
                    rows={2}
                    className="min-w-0 flex-1 resize-none rounded-lg border border-[#d4a537]/25 bg-black/50 p-2 text-sm text-[#f5e6c0] placeholder:text-[#f5d27a]/40 focus:border-[#f5d27a] focus:outline-none"
                  />
                  <button className="self-end rounded-lg border border-[#d4a537]/50 bg-black/60 p-2.5 text-[#f5d27a] transition hover:border-[#f5d27a]">
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              </Panel>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}