import { Link } from 'react-router-dom'
import { Brain, Mail, Linkedin, Youtube } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Brain className="h-6 w-6 text-indigo-400" />
              AI Consultant
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Expert AI consulting for Banking and Leasing industries. Transforming financial
              services through intelligent automation and data-driven strategy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/blog', label: 'Blog' },
                { to: '/videos', label: 'Videos' },
                { to: '/consultation', label: 'Book Consultation' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:contact@aiconsultant.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-indigo-400" />
                contact@aiconsultant.com
              </a>
              <a
                href="#"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Linkedin className="h-4 w-4 text-indigo-400" />
                LinkedIn Profile
              </a>
              <a
                href="#"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Youtube className="h-4 w-4 text-indigo-400" />
                YouTube Channel
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {year} AI Consultant. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/admin/login" className="hover:text-gray-300 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
