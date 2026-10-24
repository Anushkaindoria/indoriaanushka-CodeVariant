import { Link } from 'react-router-dom'


// Frame image ka aspect ratio (1925 x 810). Width className se do, height apne aap banegi.
export default function FrameButton({ to, onClick, children, className = '', textClass = 'text-base' }) {
  const Tag = to ? Link : 'button'
  const props = to ? { to } : { onClick, type: 'button' }

  return (
    <Tag
      {...props}
      className={`group relative inline-flex items-center justify-center transition duration-200 hover:scale-105 hover:brightness-110 ${className}`}
      style={{ aspectRatio: '1925 / 810' }}
    >
      <img
        src="/images/button-frame.png"
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-fill drop-shadow-[0_0_14px_rgba(200,116,60,0.5)]"
      />
      <span
        className={`relative z-10 whitespace-nowrap font-serif font-semibold text-[#ffe6cc] [text-shadow:0_1px_3px_rgba(40,15,5,0.95)] ${textClass}`}
      >
        {children}
      </span>
    </Tag>
  )
}