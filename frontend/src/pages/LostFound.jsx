import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
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
      toast.success('Posted');
      setModalOpen(false);
      load();
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <div className="page-container">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Lost & Found</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={18} /> Post Item</button>
      </div>
      {loading ? <TableSkeleton /> : items.length === 0 ? <EmptyState /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item._id} className={`glass-card p-5 border-l-4 ${item.type === 'Lost' ? 'border-amber-500' : 'border-emerald-500'}`}>
              <span className={`text-xs font-bold uppercase ${item.type === 'Lost' ? 'text-amber-600' : 'text-emerald-600'}`}>{item.type}</span>
              <h3 className="mt-1 font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              <p className="mt-2 text-xs text-slate-400">{item.location} • Contact: {item.contactInfo}</p>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Post Lost/Found">
        <form onSubmit={handleCreate} className="space-y-3">
          <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>Lost</option>
            <option>Found</option>
          </select>
          <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input-field" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <input className="input-field" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input className="input-field" placeholder="Contact Info" value={form.contactInfo} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} />
          <button type="submit" className="btn-primary w-full">Post</button>
        </form>
      </Modal>
    </div>
  );
}
