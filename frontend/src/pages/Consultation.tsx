import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, Calendar, DollarSign, Clock, AlertCircle } from 'lucide-react'
import { createConsultation } from '../api/consultationsApi'
import type { CreateConsultationDto } from '../types'
import toast from 'react-hot-toast'

const initialForm: CreateConsultationDto = {
  name: '',
  email: '',
  organization: '',
  message: '',
  type: 'Free',
  preferredDate: '',
}

export default function Consultation() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState<CreateConsultationDto>({
    ...initialForm,
    type: searchParams.get('type') === 'Paid' ? 'Paid' : 'Free',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<CreateConsultationDto>>({})

  useEffect(() => {
    const t = searchParams.get('type')
    if (t === 'Free' || t === 'Paid') setForm((f) => ({ ...f, type: t }))
  }, [searchParams])

  const validate = () => {
    const errs: Partial<CreateConsultationDto> = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.message.trim()) errs.message = 'Please describe your needs'
    if (!form.preferredDate) errs.preferredDate = 'Select a preferred date/time'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name as keyof CreateConsultationDto]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await createConsultation({
        ...form,
        preferredDate: new Date(form.preferredDate).toISOString(),
      })
      setSubmitted(true)
      toast.success('Consultation request submitted!')
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to submit. Please try again.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out. I'll review your request and get back to you within 24 hours
            to confirm the consultation details.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm(initialForm) }}
            className="btn-primary"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-950 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Book a Consultation</h1>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto">
            Let's discuss how AI can transform your banking or leasing operations.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info cards */}
            <div className="space-y-4">
              <div
                onClick={() => setForm((f) => ({ ...f, type: 'Free' }))}
                className={`card p-5 cursor-pointer transition-all ${
                  form.type === 'Free'
                    ? 'border-2 border-indigo-500 shadow-md'
                    : 'hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Free Consultation</p>
                    <p className="text-xs text-gray-500">15 minutes</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  A quick discovery call to understand your challenge and explore if we're a good fit.
                </p>
                {form.type === 'Free' && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
                    <CheckCircle className="h-4 w-4" /> Selected
                  </div>
                )}
              </div>

              <div
                onClick={() => setForm((f) => ({ ...f, type: 'Paid' }))}
                className={`card p-5 cursor-pointer transition-all ${
                  form.type === 'Paid'
                    ? 'border-2 border-indigo-500 shadow-md'
                    : 'hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Paid Consultation</p>
                    <p className="text-xs text-gray-500">Custom duration</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Deep-dive session on AI strategy, technical review, or roadmap planning. Pricing discussed upfront.
                </p>
                {form.type === 'Paid' && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
                    <CheckCircle className="h-4 w-4" /> Selected
                  </div>
                )}
              </div>

              <div className="card p-5 bg-indigo-50 border border-indigo-100">
                <div className="flex items-start gap-2 text-sm text-indigo-800">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-indigo-500" />
                  <p>All consultations are conducted via video call. You'll receive a calendar link after confirmation.</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 card p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {form.type === 'Free' ? 'Free 15-min Consultation' : 'Paid Consultation'} Request
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Type toggle */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                  {(['Free', 'Paid'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        form.type === t
                          ? 'bg-white text-indigo-700 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {t === 'Free' ? 'Free (15 min)' : 'Paid (Custom)'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`input-field ${errors.name ? 'border-red-400' : ''}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Organization / Company
                  </label>
                  <input
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    placeholder="Acme Bank Ltd."
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Preferred Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="preferredDate"
                    type="datetime-local"
                    value={form.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className={`input-field ${errors.preferredDate ? 'border-red-400' : ''}`}
                  />
                  {errors.preferredDate && (
                    <p className="text-xs text-red-500 mt-1">{errors.preferredDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    What would you like to discuss? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your AI challenge, project, or question. The more detail you provide, the more productive our session will be."
                    className={`input-field resize-none ${errors.message ? 'border-red-400' : ''}`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                  {submitting ? 'Submitting...' : `Request ${form.type} Consultation`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
