/**
 * DragCard
 * ---------------------------------------------------------------
 * A draggable project card used for the Canvas Protocol
 * (actions happen by dragging a card into a DropZone, not by buttons).
 *
 * Props:
 *  - id       : value sent to the drop target (read with dataTransfer.getData)
 *  - title    : main text on the card (e.g. project name)
 *  - subtitle : optional smaller text under the title
 *  - progress : optional number 0-100, shows a gold progress bar
 *  - icon     : emoji shown at the top (default tombstone)
 */
export default function DragCard({ id, title, subtitle, progress, icon = '🪦' }) {
  return (
    <div
      // Makes the element draggable with the browser's built-in drag & drop
      draggable
      // Store the id so the DropZone knows which card was dropped
      onDragStart={(e) => e.dataTransfer.setData('text/plain', id)}
      className="mx-auto w-full max-w-xs cursor-grab select-none rounded-2xl border-2 border-[#d4a537] bg-gradient-to-b from-[#1c1608] to-black p-5 text-center shadow-[0_0_24px_rgba(212,165,55,0.4)] transition hover:shadow-[0_0_36px_rgba(245,210,122,0.7)] active:cursor-grabbing active:scale-95"
    >
      <div className="text-5xl">{icon}</div>
      <p className="mt-2 font-serif text-2xl text-[#f5d27a]">{title}</p>

      {/* Optional subtitle */}
      {subtitle && <p className="mt-1 text-sm text-[#f5e6c0]/70">{subtitle}</p>}

      {/* Optional progress bar (only when progress is provided) */}
      {progress !== undefined && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full border border-[#d4a537]/40 bg-black/60">
          <div
            className="h-full bg-gradient-to-r from-[#b8862b] to-[#f5d27a]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Hint for the user */}
      <p className="mt-3 text-xs text-[#f5e6c0]/50">✋ Drag me into a zone</p>
    </div>
  )
}