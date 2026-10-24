import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

// Labels for the four steps of the project burial form.
const steps = ['Basic Info', 'Vision & Progress', "What's Left", 'Reason & Epitaph']

// Common Tailwind CSS classes used by all form inputs.
// This avoids repeating the same styling for every input field.
const inputClass =
  'w-full rounded-lg border border-fern/20 bg-night/70 px-4 py-3 text-moon placeholder:text-moon/40 outline-none focus:border-fern'

export default function Bury() {
  // Allows navigation to another page, such as the Graveyard page.
  const navigate = useNavigate()

  // Tracks the current step of the multi-step form.
  // Step 0 represents the Basic Info section.
  const [step, setStep] = useState(0)

  // Stores the validation error message displayed to the user.
  const [error, setError] = useState('')

  // Stores all the information entered by the user about their project.
  const [form, setForm] = useState({
    name: '',
    tags: '',
    link: '',
    startDate: '',
    lastActive: '',
    vision: '',
    completed: '',
    progress: 50,
  })

  // Updates a specific form field while preserving the other field values.
  // Example: update('name', 'My Project') updates only the project name.
  const update = (field, value) => setForm({ ...form, [field]: value })

  // Validates the current step and moves to the next step if validation passes.
  const next = () => {
    // The project name is mandatory in the Basic Info step.
    if (step === 0 && !form.name.trim()) {
      setError('Project name is required')
      return // Stop here if the project name is empty.
    }

    // Clear any previous validation error before proceeding.
    setError('')

    // Move to the next step of the form.
    setStep(step + 1)
  }

  return (
    // Main page background image.
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/bury-bg.jpg')" }}
    >
      {/* Adds a dark overlay so the text remains readable over the background. */}
      <div className="min-h-screen bg-night/50">
        {/* Shared navigation bar displayed at the top of the page. */}
        <Navbar />

        <main className="mx-auto max-w-6xl px-6 pb-16 pt-28">
          {/* Page heading and short description. */}
          <h1 className="font-metal text-5xl tracking-wide text-moon drop-shadow-[0_0_18px_rgba(142,230,160,0.45)] md:text-6xl">
            Bury a Project
          </h1>
          <p className="mt-3 font-serif text-lg md:text-xl">
            Give your unfinished idea a proper resting place.
          </p>

          {/* Progress indicator showing the four steps and the current step. */}
          <div className="mt-10 flex items-start justify-between md:ml-auto md:w-[62%]">
            {steps.map((label, i) => (
              // Each step gets a number, label, and visual state.
              <div key={label} className="flex flex-1 flex-col items-center text-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold ${
                    i === step
                      ? 'border-fern bg-moss text-fern shadow-[0_0_18px_rgba(142,230,160,0.7)]'
                      : i < step
                      ? 'border-fern bg-fern text-night'
                      : 'border-moon/30 bg-night/70 text-moon/60'
                  }`}
                >
                  {/* Completed steps show a checkmark; other steps show their number. */}
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`mt-2 text-xs md:text-sm ${i === step ? 'text-fern' : 'text-moon/70'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Form container: its content changes according to the current step. */}
          <div className="mt-8 rounded-2xl border border-fern/25 bg-night/75 p-6 backdrop-blur-sm md:ml-auto md:w-[62%] md:p-8">
            {/* Step 1: collect the project's basic information. */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block">
                    Project name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="e.g. My Next Big Idea"
                    value={form.name}
                    // Update the project name whenever the user types.
                    onChange={(e) => update('name', e.target.value)}
                  />
                  {/* Show a validation message if the required name is missing. */}
                  {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
                </div>

                <div>
                  <label className="mb-2 block">Tags (comma separated)</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Web, Education, AI"
                    value={form.tags}
                    // Store project categories or tags entered by the user.
                    onChange={(e) => update('tags', e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block">Link (GitHub / Drive / Figma)</label>
                  <input
                    className={inputClass}
                    placeholder="https://"
                    value={form.link}
                    // Store an optional link to the project's files or design.
                    onChange={(e) => update('link', e.target.value)}
                  />
                </div>

                {/* Display the two date inputs side by side on wider screens. */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block">Start date</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={form.startDate}
                      // Record when the project was started.
                      onChange={(e) => update('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block">Last active date</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={form.lastActive}
                      // Record the last date on which the project was worked on.
                      onChange={(e) => update('lastActive', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder content for steps 2, 3, and 4.
                These sections can be implemented later. */}
            {step > 0 && (
              <p className="py-10 text-center text-moon/70">
                Step {step + 1} coming next...
              </p>
            )}
          </div>

          {/* Navigation buttons for moving between form steps or leaving the page. */}
          <div className="mt-6 flex justify-between md:ml-auto md:w-[62%]">
            <button
              // On the first step, return to the Graveyard page.
              // On later steps, go back to the previous step.
              onClick={() => (step === 0 ? navigate('/graveyard') : setStep(step - 1))}
              className="rounded-lg border border-moon/30 bg-night/70 px-6 py-3 transition hover:border-fern"
            >
              {step === 0 ? 'Cancel' : '← Back'}
            </button>

            <button
              // Validate the current step and proceed to the next one.
              onClick={next}
              className="rounded-lg bg-fern/90 px-7 py-3 font-semibold text-night shadow-[0_0_20px_rgba(142,230,160,0.4)] transition hover:bg-fern"
            >
              Next →
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}