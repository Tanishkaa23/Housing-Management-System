import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Shield, Bell, CreditCard, Users, ChevronDown, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const features = [
  { icon: Bell, title: 'Smart Notices', desc: 'Instant alerts for water, power cuts, and events' },
  { icon: Shield, title: 'Complaint Tracking', desc: 'Raise and track complaints with live status' },
  { icon: CreditCard, title: 'Maintenance Payments', desc: 'Pay dues, download PDF receipts instantly' },
  { icon: Users, title: 'Visitor Management', desc: 'Pre-approve visitors with digital logs' },
];

const faqs = [
  { q: 'Who can use SocietySync?', a: 'Society admins and residents with role-based dashboards.' },
  { q: 'Is my data secure?', a: 'Yes, JWT authentication and encrypted passwords protect your data.' },
  { q: 'Can I download payment receipts?', a: 'Absolutely! Generate PDF receipts with one click.' },
];

export default function Landing() {
  const { dark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950">
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 font-bold text-indigo-600">
          <Building2 /> SocietySync
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-white/50">{dark ? '☀️' : '🌙'}</button>
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-5xl font-extrabold text-transparent md:text-7xl"
        >
          Smart Housing Management
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          SocietySync streamlines complaints, maintenance, notices, visitors, and events — all in one beautiful platform.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex justify-center gap-4">
          <Link to="/signup" className="btn-primary px-8 py-3 text-base">Start Free</Link>
          <a href="#features" className="btn-secondary px-8 py-3 text-base">Learn More</a>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-12">
          <ChevronDown className="mx-auto text-slate-400" />
        </motion.div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold">Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 transition hover:-translate-y-1"
            >
              <f.icon className="mb-3 text-indigo-600" size={28} />
              <h3 className="font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="glass-card overflow-hidden p-2">
          <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white md:p-12">
            <h2 className="text-2xl font-bold">Dashboard Preview</h2>
            <p className="mt-2 opacity-90">Real-time analytics, complaint tracking, and payment overview</p>
            <motion.div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {['Residents', 'Complaints', 'Payments', 'Events'].map((l) => (
                <div key={l} className="rounded-xl bg-white/20 p-4 backdrop-blur">
                  <p className="text-2xl font-bold">{l === 'Residents' ? '24' : l === 'Complaints' ? '8' : l === 'Payments' ? '₹84K' : '3'}</p>
                  <p className="text-sm opacity-80">{l}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Testimonials</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {['Best society app we have used!', 'Maintenance tracking is seamless.', 'Love the SOS feature for emergencies.'].map((t, i) => (
            <div key={i} className="glass-card p-6">
              <div className="mb-2 flex text-amber-400">{[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}</div>
              <p className="text-slate-600 dark:text-slate-400">&ldquo;{t}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="glass-card group p-4">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 text-sm text-slate-500">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        © 2026 SocietySync. Smart Housing Management System.
      </footer>
    </div>
  );
}
