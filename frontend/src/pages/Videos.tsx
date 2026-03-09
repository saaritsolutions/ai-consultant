import { useState, useEffect } from 'react'
import { Play, Calendar } from 'lucide-react'
import { getVideos } from '../api/videosApi'
import type { VideoDto } from '../types'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function Videos() {
  const [videos, setVideos] = useState<VideoDto[]>([])
  const [loading, setLoading] = useState(true)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .catch(() => toast.error('Failed to load videos.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-950 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Video Library</h1>
          <p className="text-indigo-200 text-lg max-w-xl mx-auto">
            Tutorials, webinars, and expert discussions on AI in Banking and Leasing.
          </p>
        </div>
      </section>

      {/* ── Grid ───────────────────────────────────────────────────────── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingSpinner />
          ) : videos.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Play className="h-14 w-14 mx-auto mb-4 text-gray-200" />
              <p className="text-lg font-medium text-gray-500">No videos yet</p>
              <p className="text-sm">Check back soon for new content.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="card hover:shadow-md transition-shadow">
                  {/* Embed or thumbnail */}
                  <div className="relative bg-gray-900 aspect-video overflow-hidden">
                    {activeVideo === video.id ? (
                      <iframe
                        src={`${video.embedUrl}?autoplay=1&rel=0`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <button
                        onClick={() => setActiveVideo(video.id)}
                        className="group relative w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${extractVideoId(video.embedUrl)}/mqdefault.jpg`}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                        <div className="relative z-10 h-14 w-14 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center transition-colors shadow-lg">
                          <Play className="h-6 w-6 text-indigo-700 ml-0.5" />
                        </div>
                      </button>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 leading-snug">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(video.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function extractVideoId(embedUrl: string): string {
  const match = embedUrl.match(/embed\/([^?&]+)/)
  return match ? match[1] : ''
}
