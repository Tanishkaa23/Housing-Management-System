import { useEffect, useState } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { noticeAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';

export default function Notices() {
  const { isAdmin } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', priority: 'General', type: 'General' });

  const load = () => {
    setLoading(true);
    noticeAPI.getAll({ search }).then(({ data }) => setNotices(data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await noticeAPI.create(form);
      toast.success('Notice posted');
      setModalOpen(false);
      setForm({ title: '', content: '', priority: 'General', type: 'General' });
      load();
    } catch {
      toast.error('Failed to post notice');
    }
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <p className="section-kicker">Announcements</p>
          <h1 className="page-title">Notices</h1>
          <p className="page-subtitle">Publish society updates and keep residents informed.</p>
        </div>
        {isAdmin && (
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus size={18} /> Post Notice
          </button>
        )}
      </div>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search notices..." />
      </div>

      {loading ? <TableSkeleton /> : notices.length === 0 ? <EmptyState /> : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <article key={notice._id} className="surface-card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge status={notice.priority} />
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {notice.type}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{notice.title}</h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <CalendarDays size={14} />
                  {new Date(notice.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
                {notice.content}
              </p>
            </article>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Post Notice">
        <form onSubmit={handleCreate} className="space-y-4">
          <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input-field" rows={5} placeholder="Write the announcement..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          <div className="grid gap-3 sm:grid-cols-2">
            <select className="input-field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              {['Urgent', 'General', 'Event', 'Maintenance'].map((p) => <option key={p}>{p}</option>)}
            </select>
            <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {['Water shortage', 'Power cut', 'Cleaner unavailable', 'Emergency', 'Society meeting', 'Festival', 'Maintenance work', 'General'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">Post Notice</button>
        </form>
      </Modal>
    </div>
  );
}
