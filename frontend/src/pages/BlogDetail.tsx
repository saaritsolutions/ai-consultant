import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag, Clock } from 'lucide-react'
import { getBlogBySlug } from '../api/blogsApi'
import type { BlogPostDto } from '../types'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPostDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    getBlogBySlug(slug)
      .then(setPost)
      .catch(() => {
        toast.error('Blog post not found.')
        navigate('/blog')
      })
      .finally(() => setLoading(false))
  }, [slug, navigate])

  if (loading) return <LoadingSpinner fullPage />

  if (!post) return null

  const readTime = Math.max(1, Math.ceil(post.content.replace(/<[^>]+>/g, '').split(/\s+/).length / 200))

  return (
    <div className="min-h-screen bg-white">
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Article ────────────────────────────────────────────────────── */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Category */}
        <div className="mb-4">
          <span className="badge bg-indigo-100 text-indigo-700 text-sm px-3 py-1">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {readTime} min read
          </span>
          {post.updatedAt !== post.createdAt && (
            <span className="text-gray-400">
              Updated {new Date(post.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Content */}
        <div
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-700 rounded-full text-sm transition-colors"
                >
                  <Tag className="h-3.5 w-3.5" />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Want to discuss this topic further?
          </h3>
          <p className="text-gray-600 mb-5">
            Book a consultation and let's explore how AI can solve your specific challenges.
          </p>
          <Link to="/consultation?type=Free" className="btn-primary">
            Book Free Consultation
          </Link>
        </div>
      </article>
    </div>
  )
}
