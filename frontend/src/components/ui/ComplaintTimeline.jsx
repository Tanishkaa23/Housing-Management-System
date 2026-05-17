import { CheckCircle2, Circle, Clock } from 'lucide-react';

const steps = ['Pending', 'In Progress', 'Resolved'];

export default function ComplaintTimeline({ status, timeline = [] }) {
  const currentIdx = steps.indexOf(status);

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-1 flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                i <= currentIdx ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400 dark:bg-slate-700'
              }`}
            >
              {i < currentIdx ? <CheckCircle2 size={16} /> : i === currentIdx ? <Clock size={16} /> : <Circle size={16} />}
            </div>
            <span className="mt-1 text-xs font-medium">{step}</span>
          </div>
        ))}
      </div>
      {timeline.length > 0 && (
        <div className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-700">
          {timeline.map((t, i) => (
            <div key={i} className="text-xs text-slate-500">
              <span className="font-medium text-slate-700 dark:text-slate-300">{t.status}</span> — {t.note}
              <span className="ml-2">{new Date(t.date).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
