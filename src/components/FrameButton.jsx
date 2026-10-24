import { Link } from 'react-router-dom'

/**
 * FrameButton
 * ---------------------------------------------------------------
 * A decorative button drawn on top of a frame image
 * (/images/button-frame.png). Works as a router link or a normal button.
 *
 * Props:
 *  - to        : if given, renders a <Link> to this route
 *  - onClick   : if no "to", renders a <button> with this handler
 *  - children  : the text shown inside the frame
 *  - className : sizing classes (give a width; height follows the ratio)
 *  - textClass : font size class for the label (default text-base)
 */
export default function FrameButton({ to, onClick, children, className = '', textClass = 'text-base' }) {
  // Link when "to" is provided, otherwise a plain button
  const Tag = to ? Link : 'button'
  const props = to ? { to } : { onClick, type: 'button' }

  return (
    <Tag
      {...props}
      className={`group relative inline-flex items-center justify-center transition duration-200 hover:scale-105 hover:brightness-110 ${className}`}
      // Keeps the frame image ratio (1925 x 810) so it never stretches
      style={{ aspectRatio: '1925 / 810' }}
    >
      {/* Frame image as the background of the button */}
      <img
        src="/images/button-frame.png"
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-fill drop-shadow-[0_0_14px_rgba(200,116,60,0.5)]"
      />
      {/* Button label on top of the frame */}
      <span
        className={`relative z-10 whitespace-nowrap font-serif font-semibold text-[#ffe6cc] [text-shadow:0_1px_3px_rgba(40,15,5,0.95)] ${textClass}`}
      >
        {children}
      </span>
    </Tag>
  )
}