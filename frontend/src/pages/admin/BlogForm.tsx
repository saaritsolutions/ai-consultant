import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import { createBlog, updateBlog, getBlogById } from '../../api/blogsApi'
import type { CreateBlogPostDto } from '../../types'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const emptyForm: CreateBlogPostDto = {
  title: '',
  content: '',
  category: '',
  tags: [],
}

const CATEGORIES = [
  'AI Strategy',
  'Banking AI',
  'Leasing AI',
  'Risk Management',
  'ML Engineering',
  'Regulatory Compliance',
  'Case Studies',
  'Industry News',
]

export default function BlogForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState<CreateBlogPostDto>(emptyForm)
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    getBlogById(id)
      .then((post) => {
        setForm({
          title: post.title,
          content: post.content,
          category: post.category,
          tags: post.tags,
        })
      })
      .catch(() => {
        toast.error('Failed to load blog post.')
        navigate('/admin/blogs')
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }))
    }
    setTagInput('')
  }

  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim() || !form.category) {
      toast.error('Title, content, and category are required.')
      return
    }

    setSaving(true)
    try {
      if (isEdit && id) {
        await updateBlog(id, form)
        toast.success('Blog post updated!')
      } else {
        await createBlog(form)
        toast.success('Blog post created!')
      }
      navigate('/admin/blogs')
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to save blog post.'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/blogs" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Blog Post' : 'New Blog Post'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {isEdit ? 'Update the content and metadata.' : 'Write and publish a new article.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="AI-Powered Credit Scoring: A Practical Guide"
            className="input-field text-lg"
            required
          />
          <p className="text-xs text-gray-400 mt-1.5">
            A URL-friendly slug will be generated automatically from the title.
          </p>
        </div>

        {/* Category & Tags */}
        <div className="card p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="input-field"
              required
            >
              <option value="">Select a category...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tag, press Enter"
                className="input-field flex-1"
              />
              <button type="button" onClick={addTag} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900 ml-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Content <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Supports HTML markup. For rich formatting, use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;code&gt;, etc.
          </p>
          <textarea
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            rows={24}
            placeholder="<h2>Introduction</h2>
<p>Write your blog content here...</p>"
            className="input-field font-mono text-sm resize-y"
            required
          />
          <p className="text-xs text-gray-400 mt-1.5">
            {form.content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length} words
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Publish Post'}
          </button>
          <Link to="/admin/blogs" className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
