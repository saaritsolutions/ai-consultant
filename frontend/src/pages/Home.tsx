import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Calendar,
  BookOpen,
  Play,
  Building2,
  TrendingUp,
  Shield,
  Cpu,
  BarChart3,
  Workflow,
  CheckCircle,
} from 'lucide-react'

const services = [
  {
    icon: Building2,
    title: 'Banking AI Strategy',
    desc: 'Design and implement AI roadmaps for retail and commercial banks — from credit scoring to fraud detection.',
  },
  {
    icon: TrendingUp,
    title: 'Leasing Automation',
    desc: 'Streamline lease origination, portfolio management, and risk assessment with intelligent ML models.',
  },
  {
    icon: Shield,
    title: 'Risk & Compliance AI',
    desc: 'Build explainable AI solutions that meet regulatory requirements — IFRS 9, Basel III, AML/KYC.',
  },
  {
    icon: Cpu,
    title: 'Process Automation (RPA + AI)',
    desc: 'Replace manual workflows with cognitive automation, reducing operational costs by up to 60%.',
  },
  {
    icon: BarChart3,
    title: 'Predictive Analytics',
    desc: 'Leverage customer data to predict churn, cross-sell opportunities, and default probability.',
  },
  {
    icon: Workflow,
    title: 'AI Integration & MLOps',
    desc: 'End-to-end model deployment, monitoring, and governance for production-grade AI systems.',
  },
]

const benefits = [
  'Reduce loan processing time by up to 70%',
  'Improve fraud detection accuracy to 99.2%',
  'Cut operational costs by 40–60%',
  'Achieve regulatory compliance with explainable AI',
  'Boost customer satisfaction with AI-driven personalization',
  'Accelerate digital transformation with proven frameworks',
]

export default function Home() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, #6366f1 0%, transparent 50%), radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 50%)'
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-indigo-800/50 border border-indigo-600/50 rounded-full px-4 py-1.5 text-sm font-medium text-indigo-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for Consulting Engagements
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              AI Consultant for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300">
                Banking & Leasing
              </span>
            </h1>

            <p className="text-lg md:text-xl text-indigo-200 leading-relaxed mb-10 max-w-2xl">
              Helping financial institutions and leasing companies leverage the full potential of
              artificial intelligence — from strategy to production-grade deployment.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/consultation?type=Free"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
              >
                <Calendar className="h-5 w-5" />
                Book Free 15-min Consultation
              </Link>

              <Link
                to="/consultation?type=Paid"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl border border-indigo-500 hover:bg-indigo-700 transition-colors shadow-lg"
              >
                <ArrowRight className="h-5 w-5" />
                Book Paid Consultation
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 mt-10">
              <Link
                to="/blog"
                className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors font-medium"
              >
                <BookOpen className="h-5 w-5" />
                Read the Blog
              </Link>
              <Link
                to="/videos"
                className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors font-medium"
              >
                <Play className="h-5 w-5" />
                Watch Videos
              </Link>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 20C480 40 240 0 0 30L0 60Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Services</h2>
            <p className="section-subtitle mx-auto">
              Deep domain expertise in AI for financial services — practical solutions that deliver
              measurable ROI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 hover:shadow-md transition-shadow group">
                <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                  <Icon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Work With Me ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title">Why Work With Me?</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                With deep expertise at the intersection of AI and financial services, I bring
                practical, battle-tested approaches that go beyond theory — delivering real value
                in regulated environments.
              </p>
              <ul className="space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                    <span className="text-gray-700">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '50+', label: 'Banking Projects' },
                { value: '12+', label: 'Years Experience' },
                { value: '30+', label: 'AI Models Deployed' },
                { value: '98%', label: 'Client Satisfaction' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 text-center">
                  <p className="text-4xl font-bold text-indigo-700 mb-1">{value}</p>
                  <p className="text-sm text-gray-600 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business with AI?
          </h2>
          <p className="text-indigo-100 text-lg mb-8">
            Start with a free 15-minute discovery call — no commitment required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/consultation?type=Free"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              Book Free Consultation
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Learn More About Me
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
