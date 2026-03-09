import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, Video, Calendar, Clock, TrendingUp, Plus, ArrowRight,
} from 'lucide-react'
import { getDashboard } from '../../api/dashboardApi'
import type { DashboardDto } from '../../types'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [data, setData] = useState<DashboardDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => toast.error('Failed to load dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  if (!data) return null

  const stats = [
    { label: 'Blog Posts', value: data.totalBlogs, icon: FileText, color: 'indigo', link: '/admin/blogs' },
    { label: 'Videos', value: data.totalVideos, icon: Video, color: 'blue', link: '/admin/videos' },
    { label: 'Total Consultations', value: data.totalConsultations, icon: Calendar, color: 'purple', link: '/admin/consultations' },
    { label: 'Pending Consultations', value: data.pendingConsultations, icon: Clock, color: 'amber', link: '/admin/consultations' },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your AI Consultant platform</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/blogs/new" className="btn-primary text-sm py-2 px-4">
            <Plus className="h-4 w-4" />
            New Blog Post
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color, link }) => (
          <Link
            key={label}
            to={link}
            className="card p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`h-10 w-10 rounded-xl bg-${color}-100 flex items-center justify-center`}>
                <Icon className={`h-5 w-5 text-${color}-600`} />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
          </Link>
        ))}
      </div>

      {/* Completion rate */}
      {data.totalConsultations > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-900">Consultation Completion Rate</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-100 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.round((data.completedConsultations / data.totalConsultations) * 100)}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              {Math.round((data.completedConsultations / data.totalConsultations) * 100)}%
              ({data.completedConsultations}/{data.totalConsultations})
            </span>
          </div>
        </div>
      )}

      {/* Recent Consultations */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Consultations</h2>
          <Link to="/admin/consultations" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            View all →
          </Link>
        </div>

        {data.recentConsultations.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No consultations yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Type', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentConsultations.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3.5 font-medium text-gray-900">{c.name}</td>
                    <td className="px-6 py-3.5 text-gray-500">{c.email}</td>
                    <td className="px-6 py-3.5">
                      <span className={`badge ${c.type === 'Free' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`badge ${c.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">
                      {new Date(c.preferredDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
