import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertCircle, CreditCard, Building2, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import StatCard from '../components/ui/StatCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import { dashboardAPI, sosAPI } from '../api/services';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [activityFilter, setActivityFilter] = useState('all'); // all | mine | complaints

  useEffect(() => {
    dashboardAPI.admin().then(({ data: d }) => setData(d)).catch(() => toast.error('Failed to load dashboard')).finally(() => setLoading(false));
  }, []);

  const resolveSOS = async (id) => {
    await sosAPI.resolve(id);
    toast.success('SOS resolved');
    const { data: d } = await dashboardAPI.admin();
    setData(d);
  };

  if (loading) return <div className="page-container grid gap-4 md:grid-cols-4">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>;

  const complaintChart = data?.complaintAnalytics?.map((c) => ({ name: c._id, value: c.count })) || [];
  const categoryChart = data?.categoryAnalytics?.map((c) => ({ name: c._id, count: c.count })) || [];
  const monthlyChart = data?.monthlyCollection?.map((m) => ({ name: `${m._id.month}`, amount: m.amount })) || [];

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {data?.activeSOS?.length > 0 && (
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="rounded-2xl border-2 border-rose-500 bg-rose-50 p-4 dark:bg-rose-900/20">
          <div className="flex items-center gap-2 font-bold text-rose-700">
            <AlertTriangle className="animate-pulse" /> Active SOS Alerts!
          </div>
          {data.activeSOS.map((s) => (
            <div key={s._id} className="mt-2 flex items-center justify-between">
              <span>{s.resident?.name} — Flat {s.flatNumber}</span>
              <button onClick={() => resolveSOS(s._id)} className="btn-primary text-xs">Resolve</button>
            </div>
          ))}
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Residents" value={data?.totalResidents || 0} icon={Users} color="indigo" />
        <StatCard title="Total Complaints" value={data?.totalComplaints || 0} icon={AlertCircle} color="amber" />
        <StatCard title="Pending Complaints" value={data?.pendingComplaints || 0} icon={AlertCircle} color="rose" />

      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h3 className="mb-4 font-semibold">Complaint Analytics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={complaintChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {complaintChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card p-5">
          <h3 className="mb-4 font-semibold">Complaint Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryChart}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="mb-4 font-semibold">Recent Activity</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setActivityFilter('all')} className={`btn-sm ${activityFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}>All</button>
            <button onClick={() => setActivityFilter('complaints')} className={`btn-sm ${activityFilter === 'complaints' ? 'btn-primary' : 'btn-ghost'}`}>Complaints</button>
          </div>
        </div>

        {/* Scrollable container */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {(() => {
            const activities = data?.recentActivities || [];
            const normalizeUser = (u) => (u && typeof u === 'object' ? (u._id || u.id) : u);
            const filtered = activities.filter((a) => {
              if (activityFilter === 'all') return true;
              if (activityFilter === 'complaints') return a.type === 'complaint';
              return true;
            });

            if (filtered.length === 0) return <div className="text-sm text-slate-500">No activities found.</div>;

            return filtered.map((a) => (
              <div key={a._id} className="flex items-center justify-between border-b border-slate-100 py-2 text-sm last:border-0 dark:border-slate-800">
                <span>{a.message}</span>
                <span className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleString()}</span>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
