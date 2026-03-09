import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/common/ProtectedRoute'

// Public pages
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Videos from './pages/Videos'
import Consultation from './pages/Consultation'

// Admin pages
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import BlogsAdmin from './pages/admin/BlogsAdmin'
import BlogForm from './pages/admin/BlogForm'
import VideosAdmin from './pages/admin/VideosAdmin'
import VideoForm from './pages/admin/VideoForm'
import ConsultationsAdmin from './pages/admin/ConsultationsAdmin'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* ── Public Routes ─────────────────────────────────────────────────── */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/blog/:slug" element={<PublicLayout><BlogDetail /></PublicLayout>} />
      <Route path="/videos" element={<PublicLayout><Videos /></PublicLayout>} />
      <Route path="/consultation" element={<PublicLayout><Consultation /></PublicLayout>} />

      {/* ── Admin Login ───────────────────────────────────────────────────── */}
      <Route path="/admin/login" element={<Login />} />

      {/* ── Protected Admin Routes ────────────────────────────────────────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="blogs" element={<BlogsAdmin />} />
        <Route path="blogs/new" element={<BlogForm />} />
        <Route path="blogs/:id/edit" element={<BlogForm />} />
        <Route path="videos" element={<VideosAdmin />} />
        <Route path="videos/new" element={<VideoForm />} />
        <Route path="videos/:id/edit" element={<VideoForm />} />
        <Route path="consultations" element={<ConsultationsAdmin />} />
      </Route>

      {/* ── Fallback ──────────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
