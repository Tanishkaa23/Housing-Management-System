import { motion } from 'framer-motion';

const colors = {
  indigo: 'from-indigo-500 to-purple-600',
  emerald: 'from-emerald-500 to-teal-600',
  amber: 'from-amber-500 to-orange-600',
  rose: 'from-rose-500 to-pink-600',
  blue: 'from-blue-500 to-cyan-600',
};

export default function StatCard({ title, value, icon: Icon, color = 'indigo', subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden p-5"
    >
      <motion.div
        className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${colors[color]} p-3 text-white shadow-lg`}
        whileHover={{ scale: 1.05 }}
      >
        {Icon && <Icon size={22} />}
      </motion.div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </motion.div>
  );
}
