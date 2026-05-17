import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data found', description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="mb-4 text-slate-300" size={48} />
      <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
    </div>
  );
}
