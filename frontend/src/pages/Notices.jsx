import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
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
      load();
    } catch {
      toast.error('Failed to post');
    }
  };

  return (
    <div className="page-container">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Notices & Alerts</h1>
        {isAdmin && <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={18} /> Post Notice</button>}
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search notices..." />
      {loading ? <TableSkeleton /> : notices.length === 0 ? <EmptyState /> : (
        <div className="space-y-4">
          {notices.map((n) => (
            <div key={n._id} className={`glass-card p-5 ${n.priority === 'Urgent' ? 'border-l-4 border-rose-500' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{n.title}</h3>
                <Badge status={n.priority} />
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{n.content}</p>
              <p className="mt-2 text-xs text-slate-400">{n.type} • {new Date(n.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Post Notice">
        <form onSubmit={handleCreate} className="space-y-3">
          <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input-field" rows={4} placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          <select className="input-field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            {['Urgent', 'General', 'Event', 'Maintenance'].map((p) => <option key={p}>{p}</option>)}
          </select>
          <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {['Water shortage', 'Power cut', 'Cleaner unavailable', 'Emergency', 'Society meeting', 'Festival', 'Maintenance work', 'General'].map((t) => <option key={t}>{t}</option>)}
          </select>
          <button type="submit" className="btn-primary w-full">Post</button>
        </form>
      </Modal>
    </div>
  );
}
