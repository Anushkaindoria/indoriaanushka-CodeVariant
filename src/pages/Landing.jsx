import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// skeleton ki timeline (seconds)
const WAIT = 2     // girne se pehle upar kitna ruke
const DROP = 0.3   // girne mein lagne wala waqt
const BOUNCE = 0.3 // zameen par thup + rebound
const HOLD = 5     // neeche kitni der ruka rahe
const RISE = 3     // wapas upar jaane mein
const TOTAL = WAIT + DROP + BOUNCE + HOLD + RISE

const t = (s) => s / TOTAL

function FrameButton({ to, children }) {
  return (
    <Link
      to={to}
      className="group relative inline-flex w-[260px] items-center justify-center transition duration-200 hover:scale-105 hover:brightness-110"
      style={{ aspectRatio: '1925 / 810' }}
    >
      <img
        src="/images/button-frame.png"
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-fill drop-shadow-[0_0_14px_rgba(200,116,60,0.5)]"
      />
      <span className="relative z-10 whitespace-nowrap font-serif text-xl font-semibold text-[#ffe6cc] [text-shadow:0_1px_3px_rgba(40,15,5,0.95)]">
        {children}
      </span>
    </Link>
  )
}

export default function Landing() {
  return (
    // poori screen, koi scroll nahi
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      {/* shake wala layer; extra hissa upar se cut hota hai */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: 1.04, transformOrigin: 'bottom center' }}
        animate={{
          x: [0, 0, -7, 7, -4, 4, 0, 0],
          y: [0, 0, 0, -3, 0, -2, 0, 0],
        }}
        transition={{
          duration: TOTAL,
          repeat: Infinity,
          ease: 'linear',
          times: [
            0,
            t(WAIT + DROP),
            t(WAIT + DROP + 0.08),
            t(WAIT + DROP + 0.16),
            t(WAIT + DROP + 0.24),
            t(WAIT + DROP + 0.32),
            t(WAIT + DROP + 0.4),
            1,
          ],
        }}
      >
        <img
          src="/images/gate-bg.png"
          alt="Welcome to The Project Graveyard"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover object-bottom"
        />

        {/* skeleton: WAIT sec baad dhadaam, HOLD sec ruka, RISE sec mein upar, phir dobara */}
        <motion.div
          className="pointer-events-none absolute left-[70%] top-0 w-[14%]"
          initial={{ y: '-110%' }}
          animate={{ y: ['-110%', '-110%', '0%', '-7%', '0%', '0%', '-110%'] }}
          transition={{
            duration: TOTAL,
            repeat: Infinity,
            times: [
              0,
              t(WAIT),
              t(WAIT + DROP),
              t(WAIT + DROP + BOUNCE / 2),
              t(WAIT + DROP + BOUNCE),
              t(WAIT + DROP + BOUNCE + HOLD),
              1,
            ],
            ease: ['linear', [0.75, 0, 1, 0.55], 'easeOut', 'easeIn', 'linear', 'easeInOut'],
          }}
        >
          <motion.img
            src="/images/skeleton.png"
            alt=""
            draggable={false}
            className="w-full select-none drop-shadow-[0_8px_18px_rgba(0,0,0,0.7)]"
            style={{ transformOrigin: 'top center' }}
            animate={{ rotate: [0, 0, 5, -4, 2, 0, 0, 0] }}
            transition={{
              duration: TOTAL,
              repeat: Infinity,
              ease: 'easeOut',
              times: [
                0,
                t(WAIT),
                t(WAIT + DROP),
                t(WAIT + DROP + 0.12),
                t(WAIT + DROP + 0.25),
                t(WAIT + DROP + BOUNCE),
                t(WAIT + DROP + BOUNCE + HOLD),
                1,
              ],
            }}
          />
        </motion.div>
      </motion.div>

      {/* buttons: shake layer ke bahar, isliye hilte nahi */}
      <motion.div
        className="absolute bottom-[4%] left-1/2 z-20 flex -translate-x-1/2 items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        <FrameButton to="/graveyard">Graveyard</FrameButton>
        <FrameButton to="/seance">Bury a Project</FrameButton>
      </motion.div>
    </div>
  )
}