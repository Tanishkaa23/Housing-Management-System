import { motion } from 'framer-motion';

const colors = {
  indigo: 'bg-[#e6e8eb] text-slate-700',
  emerald: 'bg-[#e6e8eb] text-slate-700',
  amber: 'bg-[#e6e8eb] text-slate-700',
  rose: 'bg-[#e6e8eb] text-slate-700',
  blue: 'bg-[#e6e8eb] text-slate-700',
};

export default function StatCard({ title, value, icon: Icon, color = 'indigo', subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <motion.div
        className={`mb-4 inline-flex rounded-xl p-3 ${colors[color]}`}
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
