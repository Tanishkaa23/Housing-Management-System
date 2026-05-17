const styles = {
  Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  Paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  Overdue: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  Urgent: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  General: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  Event: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  Maintenance: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  Expected: 'bg-amber-100 text-amber-800',
  Approved: 'bg-emerald-100 text-emerald-800',
  Active: 'bg-rose-100 text-rose-800 animate-pulse',
};

export default function Badge({ status, children }) {
  const label = children || status;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] || styles.General}`}>
      {label}
    </span>
  );
}
