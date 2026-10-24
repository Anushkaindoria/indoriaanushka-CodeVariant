import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getProjects, mergeProjects } from '../utils/storage'
import { sampleProjects } from '../data/projects'

const goldBtn =
  'rounded-lg border-2 border-[#d4a537] bg-gradient-to-b from-[#1c1608] to-black px-4 py-2 font-semibold text-[#f5d27a] shadow-[0_0_16px_rgba(212,165,55,0.35)] transition hover:border-[#f5d27a]'

export default function Lab() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [projects] = useState(() => [...getProjects(), ...sampleProjects])
  const [slotBId, setSlotBId] = useState(null)
  const [zapping, setZapping] = useState(false)

  const a = projects.find((p) => p.id === id)
  const b = projects.find((p) => p.id === slotBId)
  const others = projects.filter((p) => p.id !== id && p.id !== slotBId)

  if (!a) {
    return (
      <div className="min-h-screen bg-black p-10 text-[#f5e6c0]">
        <p>Project not found</p>
        <Link to="/graveyard" className="text-[#f5d27a] underline">Back to Graveyard</Link>
      </div>
    )
  }

  const pct = (p) => p.progress ?? p.completion ?? 0

  // Dropping a project into Slot B triggers the merge
  const handleSlotDrop = (dropped) => {
    if (zapping || !dropped || dropped === id) return
    const second = projects.find((p) => p.id === dropped)
    if (!second) return
    setSlotBId(dropped)
    setZapping(true)
    setTimeout(() => {
      mergeProjects(a, second)
      navigate('/graveyard')
    }, 1600)
  }

  const slotCard = (p, label) => (
    <div
      draggable={!!p && label === 'Slot A'}
      onDragStart={(e) => e.dataTransfer.setData('text/plain', p?.id || '')}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        if (label === 'Slot B') handleSlotDrop(e.dataTransfer.getData('text/plain'))
      }}
      className={`relative mx-auto h-[380px] w-full max-w-[260px] text-center ${
        zapping ? 'animate-pulse' : ''
      }`}
    >
      <img
        src="/images/jar.png"
        alt=""
        draggable={false}
        className={`pointer-events-none absolute inset-0 h-full w-full object-contain mix-blend-screen ${
          p ? 'opacity-100 drop-shadow-[0_0_30px_rgba(245,210,122,0.6)]' : 'opacity-50'
        }`}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-14">
        <p className="rounded bg-black/70 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white">{label}</p>
        {p ? (
          <div className="mt-2 rounded-lg bg-black/75 px-3 py-2 shadow-[0_0_14px_rgba(0,0,0,0.9)]">
            <p className="font-serif text-lg font-bold leading-tight text-white">{p.name}</p>
            <p className="mt-1 text-xs text-white/90">{pct(p)}% complete</p>
          </div>
        ) : (
          <p className="mt-2 rounded bg-black/70 px-2 py-1 text-xs text-white">Drop a project here</p>
        )}
      </div>
    </div>
  )

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed text-[#f5e6c0]"
      style={{ backgroundImage: "url('/images/lab-bg.jpg')" }}
    >
      {/* Lightning flash overlay */}
      {zapping && (
        <div className="pointer-events-none fixed inset-0 z-50 animate-pulse bg-[#f5d27a]/40 mix-blend-screen">
          <div className="flex h-full items-center justify-center text-[14rem] drop-shadow-[0_0_60px_rgba(245,210,122,1)]">
            ⚡
          </div>
        </div>
      )}

      <div className="min-h-screen bg-black/65">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 pb-16 pt-28">
          <Link to={`/project/${id}`} className={`${goldBtn} inline-block text-sm`}>← Back</Link>

          <h1 className="mt-6 font-metal text-5xl text-[#f5d27a] md:text-6xl">Frankenstein Lab</h1>
          <p className="mt-3 font-serif text-lg text-[#f5e6c0]/85">
            Drag a project from the shelf into Slot B to stitch it with Slot A.
          </p>

          <div className="mt-10 grid items-center gap-6 md:grid-cols-[1fr_0.8fr_1fr]">
            {slotCard(a, 'Slot A')}

            {/* Centre: lightning link between the jars */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className={`text-7xl ${zapping ? 'animate-ping' : 'animate-pulse'}`}>⚡</div>
              <p className="mt-3 font-serif text-lg text-[#f5d27a]">
                {b ? `${a.name} + ${b.name}` : 'Drag a shelf jar into Slot B'}
              </p>
              {b && (
                <p className="text-sm text-[#f5e6c0]/80">
                  ~{Math.round((pct(a) + pct(b)) / 2)}% complete
                </p>
              )}
            </div>

            {slotCard(b, 'Slot B')}
          </div>

          <h2 className="mt-12 font-serif text-2xl text-[#f5d27a]">Graveyard shelf</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', p.id)}
                className="group relative mx-auto h-[210px] w-full max-w-[140px] cursor-grab text-center transition hover:-translate-y-1 active:cursor-grabbing"
              >
                <img
                  src="/images/jar.png"
                  alt=""
                  draggable={false}
                  className="pointer-events-none absolute inset-0 h-full w-full object-contain mix-blend-screen opacity-80 drop-shadow-[0_0_14px_rgba(245,210,122,0.35)] transition group-hover:opacity-100 group-hover:drop-shadow-[0_0_24px_rgba(245,210,122,0.8)]"
                />
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6">
                  <div className="rounded-md bg-black/75 px-2 py-1.5 shadow-[0_0_10px_rgba(0,0,0,0.9)]">
                    <p className="font-serif text-xs font-bold leading-tight text-white">{p.name}</p>
                    <p className="mt-0.5 text-[10px] text-white/90">{p.status}</p>
                    <p className="text-[10px] text-white/90">{pct(p)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}