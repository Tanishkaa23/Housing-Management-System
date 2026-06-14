import { useEffect, useState } from 'react';
import { MapPin, Phone, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { lostFoundAPI } from '../api/services';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';

export default function LostFound() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'Lost', location: '', contactInfo: '' });

  const load = () => {
    setLoading(true);
    lostFoundAPI.getAll().then(({ data }) => setItems(data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await lostFoundAPI.create(form);
      toast.success('Item posted');
      setModalOpen(false);
      setForm({ title: '', description: '', type: 'Lost', location: '', contactInfo: '' });
      load();
    } catch {
      toast.error('Failed to post item');
    }
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <p className="section-kicker">Community desk</p>
          <h1 className="page-title">Lost & Found</h1>
          <p className="page-subtitle">Track missing and found items inside the society.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={18} /> Post Item
        </button>
      </div>

      {loading ? <TableSkeleton /> : items.length === 0 ? <EmptyState /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item._id} className="surface-card p-5">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                item.type === 'Lost'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
              }`}>
                {item.type}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                {item.location && <p className="flex items-center gap-2"><MapPin size={15} /> {item.location}</p>}
                {item.contactInfo && <p className="flex items-center gap-2"><Phone size={15} /> {item.contactInfo}</p>}
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Post Lost/Found Item">
        <form onSubmit={handleCreate} className="space-y-4">
          <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>Lost</option>
            <option>Found</option>
          </select>
          <input className="input-field" placeholder="Item title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input-field" rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input-field" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <input className="input-field" placeholder="Contact info" value={form.contactInfo} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary w-full">Post Item</button>
        </form>
      </Modal>
    </div>
  );
}
