export default function DragCard({ id, title, subtitle, progress, icon = '🪦' }) {
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', id)}
      className="mx-auto w-full max-w-xs cursor-grab select-none rounded-2xl border-2 border-[#d4a537] bg-gradient-to-b from-[#1c1608] to-black p-5 text-center shadow-[0_0_24px_rgba(212,165,55,0.4)] transition hover:shadow-[0_0_36px_rgba(245,210,122,0.7)] active:cursor-grabbing active:scale-95"
    >
      <div className="text-5xl">{icon}</div>
      <p className="mt-2 font-serif text-2xl text-[#f5d27a]">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-[#f5e6c0]/70">{subtitle}</p>}
      {progress !== undefined && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full border border-[#d4a537]/40 bg-black/60">
          <div
            className="h-full bg-gradient-to-r from-[#b8862b] to-[#f5d27a]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <p className="mt-3 text-xs text-[#f5e6c0]/50">✋ Drag me into a zone</p>
    </div>
  )
}