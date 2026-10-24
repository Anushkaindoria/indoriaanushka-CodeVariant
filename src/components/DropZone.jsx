import { useState } from 'react'

export default function DropZone({ icon, label, hint, onDrop, danger = false }) {
  const [over, setOver] = useState(false)

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setOver(true)}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        onDrop(e.dataTransfer.getData('text/plain'))
      }}
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