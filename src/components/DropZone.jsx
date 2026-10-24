import { useState } from 'react'

/**
 * DropZone
 * ---------------------------------------------------------------
 * An "Action Zone" for the Canvas Protocol. Instead of a button,
 * the user drags a card (see DragCard) and drops it here to run
 * an action (bury, repurpose, archive, delete, ...).
 *
 * Props:
 *  - icon   : emoji shown at the top
 *  - label  : zone title (e.g. "Bury Zone")
 *  - hint   : small helper text under the title
 *  - onDrop : function called with the dropped card's id
 *  - danger : true -> red style (used for destructive actions)
 */
export default function DropZone({ icon, label, hint, onDrop, danger = false }) {
  // True while a card is hovering over the zone (used for the glow effect)
  const [over, setOver] = useState(false)

  return (
    <div
      // Required so the browser allows dropping on this element
      onDragOver={(e) => e.preventDefault()}
      // Highlight the zone when a card enters / leaves
      onDragEnter={() => setOver(true)}
      onDragLeave={() => setOver(false)}
      // On drop: stop highlighting and pass the card id to the parent
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        onDrop(e.dataTransfer.getData('text/plain'))
      }}
      // Style changes: red for danger zones, gold glow while hovering
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
        danger
          ? over
            ? 'border-red-400 bg-red-950/40 shadow-[0_0_24px_rgba(248,113,113,0.5)]'
            : 'border-red-500/40 bg-black/50'
          : over
          ? 'border-[#f5d27a] bg-[#d4a537]/25 shadow-[0_0_28px_rgba(245,210,122,0.6)]'
          : 'border-[#d4a537]/40 bg-black/50'
      }`}
    >
      <div className="text-4xl">{icon}</div>
      <p className="mt-2 font-serif text-lg text-[#f5d27a]">{label}</p>
      <p className="mt-1 text-xs text-[#f5e6c0]/60">{hint}</p>
    </div>
  )
}