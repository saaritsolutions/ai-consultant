import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Filter, Mail, Building2 } from 'lucide-react'
import { getConsultations, updateConsultationStatus } from '../../api/consultationsApi'
import type { ConsultationDto } from '../../types'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

type StatusFilter = 'All' | 'Pending' | 'Completed'

export default function ConsultationsAdmin() {
  const [consultations, setConsultations] = useState<ConsultationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [updating, setUpdating] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    getConsultations()
      .then(setConsultations)
      .catch(() => toast.error('Failed to load consultations.'))
      .finally(() => setLoading(false))
  }, [])

  const handleMarkComplete = async (id: string) => {
    setUpdating(id)
    try {
      const updated = await updateConsultationStatus(id, 'Completed')
      setConsultations((prev) => prev.map((c) => (c.id === id ? updated : c)))
      toast.success('Marked as completed.')
    } catch {
      toast.error('Failed to update status.')
    } finally {
      setUpdating(null)
    }
  }

  const filtered = consultations.filter(
    (c) => statusFilter === 'All' || c.status === statusFilter
  )

  const pending = consultations.filter((c) => c.status === 'Pending').length
  const completed = consultations.filter((c) => c.status === 'Completed').length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          <span>{consultations.length} total</span>
          <span className="text-amber-600 font-medium">{pending} pending</span>
          <span className="text-emerald-600 font-medium">{completed} completed</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-5">
        <Filter className="h-4 w-4 text-gray-400" />
        <div className="flex gap-2">
          {(['All', 'Pending', 'Completed'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <p className="font-medium">No consultations found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div key={c.id} className="card overflow-hidden">
              <div
                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded((prev) => (prev === c.id ? null : c.id))}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span className="font-semibold text-gray-900">{c.name}</span>
                      <span className={`badge ${c.type === 'Free' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {c.type}
                      </span>
                      <span className={`badge flex items-center gap-1 ${
                        c.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {c.status === 'Pending' ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        {c.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {c.email}
                      </span>
                      {c.organization && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {c.organization}
                        </span>
                      )}
                      <span>
                        Preferred: {new Date(c.preferredDate).toLocaleString()}
                      </span>
                      <span className="text-gray-400">
                        Submitted: {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  {c.status === 'Pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkComplete(c.id)
                      }}
                      disabled={updating === c.id}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      {updating === c.id ? 'Updating...' : 'Mark Complete'}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded message */}
              {expanded === c.id && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Message</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
                    {c.message}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
