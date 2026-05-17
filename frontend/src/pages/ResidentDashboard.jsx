import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, AlertCircle, Bell, Calendar } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { CardSkeleton } from '../components/ui/Skeleton';
import { dashboardAPI } from '../api/services';
import toast from 'react-hot-toast';

export default function ResidentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.resident()
      .then(({ data: d }) => setData(d))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold">My Dashboard</h1>

      {data?.emergencyAlerts?.length > 0 && (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 dark:bg-rose-900/20">
          <p className="font-bold text-rose-700">Emergency Alerts</p>
          {data.emergencyAlerts.map((n) => (
            <p key={n._id} className="mt-1 text-sm">{n.title}</p>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Dues" value={`₹${(data?.totalDues || 0).toLocaleString()}`} icon={CreditCard} color="rose" />
        <StatCard title="Active Complaints" value={data?.activeComplaints || 0} icon={AlertCircle} color="amber" />
        <StatCard title="Recent Notices" value={data?.notices?.length || 0} icon={Bell} color="indigo" />
        <StatCard title="Upcoming Events" value={data?.events?.length || 0} icon={Calendar} color="emerald" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Latest Notices</h3>
            <Link to="/notices" className="text-sm text-indigo-600">View all</Link>
          </div>
          {data?.notices?.map((n) => (
            <div key={n._id} className="mb-2 rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <p className="font-medium">{n.title}</p>
                <Badge status={n.priority} />
              </div>
              <p className="mt-1 text-xs text-slate-500 line-clamp-2">{n.content}</p>
            </div>
          ))}
        </div>
        <div className="glass-card p-5">
          <h3 className="mb-3 font-semibold">My Complaints</h3>
          {data?.complaints?.map((c) => (
            <div key={c._id} className="mb-2 flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span className="text-sm font-medium">{c.title}</span>
              <Badge status={c.status} />
            </div>
          ))}
        </div>
        <div className="glass-card p-5">
          <h3 className="mb-3 font-semibold">Visitor Approvals</h3>
          {data?.visitors?.map((v) => (
            <div key={v._id} className="mb-2 flex items-center justify-between text-sm">
              <span>{v.visitorName} — {v.purpose}</span>
              <Badge status={v.status} />
            </div>
          ))}
          {!data?.visitors?.length && <p className="text-sm text-slate-400">No pending visitors</p>}
        </div>
        <div className="glass-card p-5">
          <h3 className="mb-3 font-semibold">Upcoming Events</h3>
          {data?.events?.map((e) => (
            <div key={e._id} className="mb-2 text-sm">
              <p className="font-medium">{e.title}</p>
              <p className="text-xs text-slate-400">{new Date(e.date).toLocaleDateString()} — {e.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
