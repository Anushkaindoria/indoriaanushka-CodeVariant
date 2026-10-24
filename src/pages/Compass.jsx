import { useState } from 'react'
import Navbar from '../components/Navbar'

const questions = [
  { q: 'Do you still care about this idea?', options: ['Not really', 'A little', 'Absolutely'] },
  { q: 'Has the reason you stopped changed?', options: ['No, still a blocker', 'Partially', 'Yes, resolved'] },
  { q: 'How much useful work is already done?', options: ['Very little', 'Some progress', 'Most of it'] },
  { q: 'Is the technology still relevant?', options: ['Outdated', 'Not sure', 'Yes, relevant'] },
  { q: 'How much time can you give it now?', options: ['Almost none', 'A little', 'Enough to make progress'] },
]

const actions = {
  Continue: [
    'Pick one small feature and finish it this week',
    'Set a fixed daily time slot, even 30 minutes',
    'Update your last-active date today',
  ],
  Pivot: [
    'List the parts worth reusing',
    'Shrink the idea to one core goal',
    'Rebuild a simple version in two weeks',
  ],
  'Let It Rest': [
    'Save the useful parts as Organ Donors',
    'Set a restart date and reminder',
    'Write a short note on what you learned',
  ],
}

export default function Compass() {
  const [answers, setAnswers] = useState([null, null, null, null, null])
  const answered = answers.every((a) => a !== null)
  const score = answers.reduce((sum, a) => sum + (a ?? 0), 0)

  const path =
    score >= 7
      ? { name: 'Continue', text: 'You care, the blockers are gone, and real progress exists. Pick up where you left off.', next: 'Pick one small feature and finish it this week.' }
      : score >= 4
      ? { name: 'Pivot', text: 'There is value here, but the original plan needs a new direction.', next: 'Reuse the best parts and rebuild around a smaller goal.' }
      : { name: 'Let It Rest', text: 'Right now this idea needs more than you can give it.', next: 'Save the useful parts and revisit it later.' }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/revival-bg.jpg')" }}
    >
      <div className="min-h-screen bg-night/50">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 pb-16 pt-28">
          <h1 className="font-metal text-5xl tracking-wide text-moon md:text-6xl">
            Revival Compass
          </h1>
          <p className="mt-3 font-serif text-lg md:text-xl">
            Find your way back to what you left behind.
          </p>

          <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* Left: questions */}
            <div className="space-y-4">
              {questions.map((item, i) => (
                <div
                  key={item.q}
                  className="rounded-xl border border-fern/25 bg-night/75 p-4 backdrop-blur-sm"
                >
                  <p className="mb-3 font-semibold">
                    {i + 1}. {item.q}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.options.map((opt, j) => (
                      <button
                        key={opt}
                        onClick={() => {
                          const next = [...answers]
                          next[i] = j
                          setAnswers(next)
                        }}
                        className={`rounded-lg border px-4 py-2 text-sm transition ${
                          answers[i] === j
                            ? 'border-fern bg-moss text-fern shadow-[0_0_14px_rgba(245,210,122,0.5)]'
                            : 'border-moon/30 bg-night/70 text-moon/80 hover:border-fern'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right: recommended path */}
            <div className="rounded-2xl border border-fern/40 bg-night/80 p-6 shadow-[0_0_24px_rgba(245,210,122,0.25)] backdrop-blur-sm lg:self-stretch">
              <p className="text-sm text-moon/70">Recommended Path</p>
              {answered ? (
                <>
                  <h2 className="mt-1 font-metal text-4xl text-fern">{path.name}</h2>
                  <p className="mt-3">{path.text}</p>

                  <p className="mt-4 text-sm text-moon/70">Suggested next step</p>
                  <p className="mt-1">{path.next}</p>

                  <div className="mt-6 border-t border-fern/20 pt-4">
                    <p className="mb-3 text-sm text-moon/70">What you can do</p>
                    <ul className="space-y-2 text-sm">
                      {actions[path.name].map((a) => (
                        <li key={a} className="flex gap-2">
                          <span className="text-fern">→</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button className="rounded-lg bg-fern/90 px-5 py-2 font-semibold text-night hover:bg-fern">
                      Apply This Path
                    </button>
                    <button
                      onClick={() => setAnswers([null, null, null, null, null])}
                      className="rounded-lg border border-moon/30 px-5 py-2 hover:border-fern"
                    >
                      Choose Another Path
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                  <div className="text-6xl">🧭</div>
                  <p className="mt-4 font-metal text-2xl text-fern">Your path awaits</p>
                  <p className="mt-2 text-moon/70">
                    Answer all 5 questions to reveal where to go next.
                  </p>
                  <p className="mt-4 text-sm text-fern">
                    {answers.filter((a) => a !== null).length} / 5 answered
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}