import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Youtube } from 'lucide-react'
import { createVideo, updateVideo, getVideoById } from '../../api/videosApi'
import type { CreateVideoDto } from '../../types'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const emptyForm: CreateVideoDto = { title: '', description: '', youTubeUrl: '' }

export default function VideoForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState<CreateVideoDto>(emptyForm)
  const [embedPreview, setEmbedPreview] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    getVideoById(id)
      .then((v) => {
        setForm({ title: v.title, description: v.description, youTubeUrl: v.youTubeUrl })
        setEmbedPreview(v.embedUrl)
      })
      .catch(() => {
        toast.error('Failed to load video.')
        navigate('/admin/videos')
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleUrlChange = (url: string) => {
    setForm((f) => ({ ...f, youTubeUrl: url }))
    const embed = convertToEmbedUrl(url)
    setEmbedPreview(embed || '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.youTubeUrl.trim()) {
      toast.error('Title and YouTube URL are required.')
      return
    }

    setSaving(true)
    try {
      if (isEdit && id) {
        await updateVideo(id, form)
        toast.success('Video updated!')
      } else {
        await createVideo(form)
        toast.success('Video added!')
      }
      navigate('/admin/videos')
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to save video.'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/videos" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Video' : 'Add Video'}
          </h1>
          <p className="text-gray-500 text-sm">Paste a YouTube URL to embed the video.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Building AI Fraud Detection for Banks"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              YouTube URL <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
              <input
                value={form.youTubeUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="input-field pl-9"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Supports youtube.com/watch, youtu.be, and Shorts URLs.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the video content..."
              rows={3}
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Preview */}
        {embedPreview && (
          <div className="card p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
              <iframe
                src={embedPreview}
                title="Preview"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : isEdit ? 'Update Video' : 'Add Video'}
          </button>
          <Link to="/admin/videos" className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

function convertToEmbedUrl(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&?/\s]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : ''
}
