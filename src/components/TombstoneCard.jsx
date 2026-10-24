import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * Colors and glow for each project status.
 *  - badge : pill color for the status label
 *  - text  : skull icon color
 *  - bar   : progress bar fill color
 *  - glow  : drop-shadow around the tombstone (stronger on hover)
 */
const statusConfig = {
  Buried: {
    badge: 'bg-amber-300 text-stone-900 shadow-[0_0_16px_rgba(252,211,77,0.95)]',
    text: 'text-amber-100',
    bar: 'bg-amber-100/80',
    glow: 'drop-shadow-[0_0_8px_rgba(230,200,150,0.12)] group-hover:drop-shadow-[0_0_22px_rgba(230,200,150,0.45)]',
  },
  Haunting: {
    badge: 'bg-orange-400 text-stone-900 shadow-[0_0_16px_rgba(251,146,60,0.95)]',
    text: 'text-orange-300',
    bar: 'bg-orange-400',
    glow: 'drop-shadow-[0_0_14px_rgba(251,146,60,0.35)] group-hover:drop-shadow-[0_0_26px_rgba(251,146,60,0.65)]',
  },
  Resurrected: {
    badge: 'bg-[#39ff88] text-stone-900 shadow-[0_0_18px_rgba(57,255,136,0.95)]',
    text: 'text-emerald-300',
    bar: 'bg-emerald-400',
    glow: 'drop-shadow-[0_0_14px_rgba(52,211,153,0.4)] group-hover:drop-shadow-[0_0_26px_rgba(52,211,153,0.7)]',
  },
  Repurposed: {
    badge: 'bg-cyan-300 text-stone-900 shadow-[0_0_16px_rgba(103,232,249,0.95)]',
    text: 'text-sky-300',
    bar: 'bg-sky-300',
    glow: 'drop-shadow-[0_0_8px_rgba(125,211,252,0.15)] group-hover:drop-shadow-[0_0_22px_rgba(125,211,252,0.5)]',
  },
  Archived: {
    badge: 'bg-violet-300 text-stone-900 shadow-[0_0_16px_rgba(196,181,253,0.95)]',
    text: 'text-slate-300',
    bar: 'bg-slate-300',
    glow: 'drop-shadow-[0_0_8px_rgba(203,213,225,0.12)] group-hover:drop-shadow-[0_0_22px_rgba(203,213,225,0.4)]',
  },
}

// Small skull icon (inline SVG) shown next to the progress bar
function Skull({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" className={className}>
      <path d="M12 2a9 9 0 0 0-9 9c0 2.9 1.4 5.4 3.5 7v2.5A1.5 1.5 0 0 0 8 22h1v-2h2v2h2v-2h2v2h1a1.5 1.5 0 0 0 1.5-1.5V18c2.1-1.6 3.5-4.1 3.5-7a9 9 0 0 0-9-9zM8.5 14a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm7 0a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM12 14.5l1.3 2.3h-2.6z" />
    </svg>
  )
}

/**
 * TombstoneCard
 * ---------------------------------------------------------------
 * One project shown as a tombstone image with its details written
 * on the stone. Clicking it opens /project/:id.
 * Sizes use container query units (cqw) so the text scales with
 * the width of the card.
 */
export default function TombstoneCard({ project }) {
  // Pick colors for this status (fallback to Buried)
  const cfg = statusConfig[project.status] || statusConfig.Buried
  const progress = project.progress ?? 0
  // Show at most 3 tags so the stone does not overflow
  const tags = (project.tags || []).slice(0, 3)

  return (
    // Lifts the card slightly on hover
    <motion.div className="@container" whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Link to={`/project/${project.id}`} className="group relative block aspect-[1086/1448] w-full">
        {/* Tombstone background image */}
        <img
          src="/images/Tombstone.png"
          alt=""
          className={`absolute inset-0 h-full w-full object-contain transition duration-300 ${cfg.glow}`}
        />

        {/* Text area placed only on the stone face */}
        <div className="absolute bottom-[15%] left-[28%] right-[21%] top-[36%] flex flex-col items-center overflow-hidden rounded-xl bg-black/35 px-[2.5cqw] py-[2cqw] text-center [text-shadow:0_1px_4px_rgba(0,0,0,0.95)]">
          {/* Status badge */}
          <span
            className={`rounded-full px-[4cqw] py-[1cqw] font-semibold [font-size:3.6cqw] [text-shadow:none] ${cfg.badge}`}
          >
            {project.status}
          </span>

          {/* Project name, years and short summary */}
          <h3 className="mt-[1.8cqw] max-w-full break-words font-serif leading-tight text-stone-100 [font-size:6.6cqw]">
            {project.name}
          </h3>
          <p className="text-stone-300 [font-size:3.8cqw]">{project.years}</p>
          <p className="mt-[1.5cqw] line-clamp-2 leading-snug text-stone-300/90 [font-size:3.8cqw]">
            {project.summary}
          </p>

          {/* Bottom part: progress bar and tags */}
          <div className="mt-auto w-full">
            <div className="flex items-center gap-[2cqw] text-stone-100 [font-size:3.8cqw]">
              <Skull className={`h-[4.6cqw] w-[4.6cqw] shrink-0 ${cfg.text}`} />
              <div className="h-[1.6cqw] flex-1 overflow-hidden rounded-full bg-stone-700/80">
                <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${progress}%` }} />
              </div>
              <span>{progress}%</span>
            </div>

            <div className="mt-[1.8cqw] flex flex-wrap justify-center gap-[1.2cqw]">
              {tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-stone-400/40 bg-black/40 px-[2.2cqw] py-[0.5cqw] text-stone-200 [font-size:3.2cqw]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}