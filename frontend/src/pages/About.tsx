import { Link } from 'react-router-dom'
import { Award, BookOpen, Briefcase, GraduationCap, ArrowRight } from 'lucide-react'

const expertise = [
  'AI/ML Strategy & Roadmap Development',
  'Credit Risk Modeling & Scoring',
  'Fraud Detection & Prevention Systems',
  'Leasing Portfolio Optimization',
  'NLP for Document Processing (KYC/AML)',
  'MLOps & Model Governance',
  'IFRS 9 / Basel III Compliant AI',
  'Customer Lifetime Value Prediction',
  'Automated Underwriting Systems',
  'Chatbots & Conversational AI for Banking',
]

const timeline = [
  {
    year: '2020 – Present',
    role: 'Independent AI Consultant',
    org: 'Banking & Leasing Domain',
    desc: 'Advising financial institutions across Europe and MENA on AI strategy and implementation.',
  },
  {
    year: '2017 – 2020',
    role: 'Head of Data Science',
    org: 'Major Commercial Bank',
    desc: 'Led a team of 15 data scientists building credit risk and fraud detection models in production.',
  },
  {
    year: '2014 – 2017',
    role: 'Senior ML Engineer',
    org: 'FinTech Scale-up',
    desc: 'Designed real-time scoring engines processing millions of lending decisions per day.',
  },
  {
    year: '2012 – 2014',
    role: 'Quantitative Analyst',
    org: 'Investment Bank',
    desc: 'Developed statistical models for market risk and structured finance products.',
  },
]

export default function About() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-indigo-300 font-medium mb-3">About Me</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
                AI Consultant &<br />
                <span className="text-indigo-300">Financial Tech Expert</span>
              </h1>
              <p className="text-indigo-100 text-lg leading-relaxed mb-8">
                I help banks, credit unions, and leasing companies build AI systems that are
                accurate, compliant, and production-ready. With 12+ years of experience at the
                intersection of finance and machine learning, I bridge the gap between data science
                research and real-world business impact.
              </p>
              <Link
                to="/consultation"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-colors"
              >
                Work With Me <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-20 w-20 rounded-2xl bg-indigo-400/30 border-2 border-indigo-400/50 flex items-center justify-center text-3xl font-bold text-white">
                  AI
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AI Consultant</h2>
                  <p className="text-indigo-300 text-sm">Banking & Leasing Specialist</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-indigo-200">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-indigo-400 shrink-0" />
                  12+ years in Financial AI
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-indigo-400 shrink-0" />
                  50+ Successful Projects
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-indigo-400 shrink-0" />
                  MSc Computer Science, MBA Finance
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-indigo-400 shrink-0" />
                  Published Researcher & Speaker
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Expertise ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Areas of Expertise</h2>
            <p className="section-subtitle mx-auto">
              Specialized knowledge across the full AI lifecycle in regulated financial environments.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {expertise.map((item) => (
              <div
                key={item}
                className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-3 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                <span className="text-gray-800 font-medium text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience Timeline ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">Professional Journey</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-indigo-100" />
            <div className="space-y-8">
              {timeline.map(({ year, role, org, desc }) => (
                <div key={year} className="relative flex gap-6 pl-14">
                  <div className="absolute left-4 top-1 h-4 w-4 rounded-full bg-indigo-600 border-4 border-indigo-100" />
                  <div className="flex-1 card p-5">
                    <p className="text-xs font-medium text-indigo-600 mb-1">{year}</p>
                    <h3 className="font-semibold text-gray-900">{role}</h3>
                    <p className="text-sm text-indigo-700 font-medium">{org}</p>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-indigo-50 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Let's Build Something Together
          </h2>
          <p className="text-gray-600 mb-8">
            Whether you're starting your AI journey or scaling existing models, I can help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/consultation?type=Free" className="btn-primary">
              Book Free Consultation
            </Link>
            <Link to="/blog" className="btn-secondary">
              Read My Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
