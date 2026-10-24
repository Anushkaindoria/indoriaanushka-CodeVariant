/**
 * Bury page (create + edit)
 * ---------------------------------------------------------------
 * 4-step form to bury a project.
 *  - /seance            -> create a new project
 *  - /seance?edit=<id>  -> edit an existing user-created project
 * Projects are saved in localStorage via ../utils/storage.
 * Theme: black + gold (matches the rest of the app)
 */
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { addProject, getProjects, deleteProject } from '../utils/storage'

/* ---------------- Theme constants ---------------- */
const goldBtn =
  'rounded-lg border-2 border-[#d4a537] bg-gradient-to-b from-[#1c1608] to-black px-4 py-2 font-semibold text-[#f5d27a] shadow-[0_0_16px_rgba(212,165,55,0.35)] transition hover:border-[#f5d27a] hover:text-[#ffe9a8] hover:shadow-[0_0_26px_rgba(245,210,122,0.65)]'

const inputClass =
  'w-full rounded-lg border border-[#d4a537]/30 bg-black/70 px-4 py-3 text-[#f5e6c0] placeholder:text-[#f5d27a]/40 outline-none transition focus:border-[#f5d27a] focus:shadow-[0_0_14px_rgba(245,210,122,0.35)]'

const labelClass = 'mb-2 block text-[#f5d27a]'

const steps = ['Basic Info', 'Vision & Progress', "What's Left", 'Reason & Epitaph']

// Empty form (all keys present so inputs are always controlled)
const emptyForm = {
  name: '',
  tags: '',
  link: '',
  startDate: '',
  lastActive: '',
  vision: '',
  completed: '',
  progress: 50,
  unfinished: '',
  salvage: '',
  reason: '',
  reasonNote: '',
  epitaph: '',
  wantsResume: '',
  resumeDate: '',
}

// Convert a saved project back into form values (edit mode)
const toForm = (p) => ({
  name: p.name || '',
  tags: (p.tags || []).join(', '),
  link: p.link || '',
  startDate: p.createdAt || '',
  lastActive: p.buriedAt || '',
  vision: p.vision || '',
  completed: (p.completed || []).join('\n'),
  progress: p.progress ?? 50,
  unfinished: (p.unfinished || []).join('\n'),
  salvage: (p.salvage || []).join('\n'),
  reason: p.reason || '',
  reasonNote: p.reasonNote || '',
  epitaph: p.epitaph || '',
  wantsResume: p.wantsResume ? 'yes' : 'no',
  resumeDate: p.resumeDate || '',
})

// Split a textarea into non-empty trimmed lines
const lines = (t) => t.split('\n').map((s) => s.trim()).filter(Boolean)

export default function Bury() {
  const navigate = useNavigate()

  // Edit mode: ?edit=<id> in the URL
  const [params] = useSearchParams()
  const editId = params.get('edit')
  const existing = editId ? getProjects().find((p) => p.id === editId) : null

  /* ---------------- State ---------------- */
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [form, setForm] = useState(existing ? toForm(existing) : emptyForm)

  const update = (field, value) => setForm({ ...form, [field]: value })

  /* ---------------- Save ---------------- */
  const save = () => {
    // Years label, e.g. "2025 - 2026"
    const y1 = form.startDate.slice(0, 4)
    const y2 = form.lastActive.slice(0, 4)
    const years =
      y1 && y2 && y1 !== y2 ? `${y1} - ${y2}` : y1 || y2 || String(new Date().getFullYear())

    // In edit mode, remove the old copy first (same id is reused below)
    if (editId) deleteProject(editId)

    addProject({
      ...(existing || {}), // keep any extra fields of the old project
      id: editId || Date.now().toString(),
      name: form.name.trim(),
      icon: existing?.icon || '🪦',
      years,
      status: existing?.status || 'Buried',
      progress: form.progress,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      summary: form.vision.trim().slice(0, 100),
      vision: form.vision.trim(),
      completed: lines(form.completed),
      unfinished: lines(form.unfinished),
      reason: form.reason,
      reasonNote: form.reasonNote.trim(),
      epitaph: form.epitaph.trim(),
      wantsResume: form.wantsResume === 'yes',
      resumeDate: form.wantsResume === 'yes' ? form.resumeDate : '',
      salvage: lines(form.salvage),
      link: form.link.trim(),
      createdAt: form.startDate || new Date().toISOString().slice(0, 10),
      buriedAt: form.lastActive || new Date().toISOString().slice(0, 10),
    })
    navigate('/graveyard')
  }

  /* ---------------- Next / validation ---------------- */
  const next = () => {
    if (step === 3) {
      if (form.wantsResume === 'yes' && !form.resumeDate) {
        setError('Please pick a date to resume')
        return
      }
      save()
      return
    }
    if (step === 0 && !form.name.trim()) {
      setError('Project name is required')
      return
    }
    setError('')
    setStep(step + 1)
  }

  /* ---------------- UI ---------------- */
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/bury-bg.png')" }}
    >
      <div className="min-h-screen bg-black/55">
        <Navbar />

        <main className="mx-auto max-w-6xl px-6 pb-16 pt-28">
          <h1 className="font-metal text-5xl tracking-wide text-[#f5d27a] drop-shadow-[0_0_18px_rgba(245,210,122,0.45)] md:text-6xl">
            {editId ? 'Edit Project' : 'Bury a Project'}
          </h1>
          <p className="mt-3 font-serif text-lg text-[#f5e6c0]/85 md:text-xl">
            {editId
              ? 'Update the details of your resting project.'
              : 'Give your unfinished idea a proper resting place.'}
          </p>

          {/* ---------- Step indicator ---------- */}
          <div className="mt-10 flex items-start justify-between md:ml-auto md:w-[62%]">
            {steps.map((label, i) => (
              <div key={label} className="flex flex-1 flex-col items-center text-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold ${
                    i === step
                      ? 'border-[#f5d27a] bg-black text-[#f5d27a] shadow-[0_0_18px_rgba(245,210,122,0.7)]'
                      : i < step
                      ? 'border-[#d4a537] bg-[#d4a537] text-black'
                      : 'border-[#f5e6c0]/30 bg-black/70 text-[#f5e6c0]/60'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span
                  className={`mt-2 text-xs md:text-sm ${
                    i === step ? 'text-[#f5d27a]' : 'text-[#f5e6c0]/70'
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* ---------- Form card ---------- */}
          <div className="mt-8 rounded-2xl border-2 border-[#d4a537]/50 bg-gradient-to-b from-[#1c1608]/85 to-black/85 p-6 text-[#f5e6c0] backdrop-blur-sm md:ml-auto md:w-[62%] md:p-8">
            {/* Step 1: Basic info */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>
                    Project name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="e.g. My Next Big Idea"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                  {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
                </div>

                <div>
                  <label className={labelClass}>Tags (comma separated)</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Web, Education, AI"
                    value={form.tags}
                    onChange={(e) => update('tags', e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Link (GitHub / Drive / Figma)</label>
                  <input
                    className={inputClass}
                    placeholder="https://"
                    value={form.link}
                    onChange={(e) => update('link', e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Start date</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={form.startDate}
                      onChange={(e) => update('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last active date</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={form.lastActive}
                      onChange={(e) => update('lastActive', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Vision and progress */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>What did you want to build?</label>
                  <textarea
                    rows={4}
                    className={inputClass}
                    placeholder="Describe the original vision of your project..."
                    value={form.vision}
                    onChange={(e) => update('vision', e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>What did you complete? (one per line)</label>
                  <textarea
                    rows={4}
                    className={inputClass}
                    placeholder={'Login page\nHome UI\nBasic search'}
                    value={form.completed}
                    onChange={(e) => update('completed', e.target.value)}
                  />
                </div>

                <div>
                  <label className={`${labelClass} flex justify-between`}>
                    <span>How much was finished?</span>
                    <span className="font-semibold">{form.progress}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    className="w-full accent-[#d4a537]"
                    value={form.progress}
                    onChange={(e) => update('progress', Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* Step 3: What is left */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>What is still unfinished? (one per line)</label>
                  <textarea
                    rows={5}
                    className={inputClass}
                    placeholder={'Payment system\nMobile layout\nAdmin dashboard'}
                    value={form.unfinished}
                    onChange={(e) => update('unfinished', e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Parts worth saving (one per line)</label>
                  <textarea
                    rows={4}
                    className={inputClass}
                    placeholder={'Auth flow\nUI kit\nDataset'}
                    value={form.salvage}
                    onChange={(e) => update('salvage', e.target.value)}
                  />
                  <p className="mt-1 text-xs text-[#f5e6c0]/60">
                    These become "Organ Donors" you can reuse in a new project.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Reason, epitaph, resume */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Why did you stop?</label>
                  <select
                    className={inputClass}
                    value={form.reason}
                    onChange={(e) => update('reason', e.target.value)}
                  >
                    <option className="bg-black" value="">Pick a reason</option>
                    <option className="bg-black">Lost interest</option>
                    <option className="bg-black">Time ran out</option>
                    <option className="bg-black">Scope grew too big</option>
                    <option className="bg-black">Got stuck technically</option>
                    <option className="bg-black">Team drifted apart</option>
                    <option className="bg-black">Something else came up</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Want to add a note?</label>
                  <textarea
                    rows={3}
                    className={inputClass}
                    placeholder="What really happened..."
                    value={form.reasonNote}
                    onChange={(e) => update('reasonNote', e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Epitaph (a line for the tombstone)</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Gone too soon, but never forgotten"
                    value={form.epitaph}
                    onChange={(e) => update('epitaph', e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Do you want to resume this project?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { v: 'yes', t: '🔥 Yes, someday' },
                      { v: 'no', t: '😴 Not now' },
                    ].map((o) => (
                      <button
                        key={o.v}
                        type="button"
                        onClick={() => {
                          update('wantsResume', o.v)
                          setError('')
                        }}
                        className={`rounded-xl border px-4 py-3 text-sm transition ${
                          form.wantsResume === o.v
                            ? 'border-[#f5d27a] bg-[#d4a537]/20 text-[#f5d27a] shadow-[0_0_14px_rgba(245,210,122,0.35)]'
                            : 'border-[#d4a537]/25 bg-black/60 hover:border-[#d4a537]/60'
                        }`}
                      >
                        {o.t}
                      </button>
                    ))}
                  </div>
                </div>

                {form.wantsResume === 'yes' && (
                  <div>
                    <label className={labelClass}>I want to start again from</label>
                    <input
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      className={inputClass}
                      value={form.resumeDate}
                      onChange={(e) => {
                        update('resumeDate', e.target.value)
                        setError('')
                      }}
                    />
                    {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
                    <p className="mt-1 text-xs text-[#f5e6c0]/60">We'll remind you on this date.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---------- Back / Next buttons ---------- */}
          <div className="mt-6 flex justify-between md:ml-auto md:w-[62%]">
            <button
              onClick={() => (step === 0 ? navigate('/graveyard') : setStep(step - 1))}
              className={`${goldBtn} px-6 py-3`}
            >
              {step === 0 ? 'Cancel' : '← Back'}
            </button>
            <button onClick={next} className={`${goldBtn} px-7 py-3`}>
              {step === 3 ? (editId ? 'Save changes' : 'Bury it ⚰️') : 'Next →'}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}