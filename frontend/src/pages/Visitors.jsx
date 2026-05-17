import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { visitorAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';

export default function Visitors() {
  const { isAdmin } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ visitorName: '', purpose: '', expectedDate: '' });

  const load = () => {
    setLoading(true);
    visitorAPI.getAll().then(({ data }) => setVisitors(data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await visitorAPI.create(form);
      toast.success('Visitor added');
      setModalOpen(false);
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const approve = async (id) => {
    await visitorAPI.approve(id);
    toast.success('Approved');
    load();
  };

  const checkIn = async (id) => {
    await visitorAPI.update(id, { status: 'Checked In' });
    toast.success('Checked in');
    load();
  };

  return (
    <div className="page-container">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Visitor Management</h1>
        {!isAdmin && <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={18} /> Add Visitor</button>}
      </div>
      {loading ? <TableSkeleton /> : visitors.length === 0 ? <EmptyState /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {visitors.map((v) => (
            <div key={v._id} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{v.visitorName}</h3>
                  <p className="text-xs text-slate-500">Flat {v.flatNumber} • {v.purpose}</p>
                </div>
                <Badge status={v.status} />
              </div>
              <p className="mt-2 text-xs text-slate-400">Expected: {new Date(v.expectedDate).toLocaleString()}</p>
              <div className="mt-3 flex gap-2">
                {v.status === 'Expected' && !isAdmin && (
                  <button onClick={() => approve(v._id)} className="btn-primary text-xs">Approve</button>
                )}
                {isAdmin && v.status === 'Approved' && (
                  <button onClick={() => checkIn(v._id)} className="btn-secondary text-xs">Check In</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Expected Visitor">
        <form onSubmit={handleCreate} className="space-y-3">
          <input className="input-field" placeholder="Visitor Name" value={form.visitorName} onChange={(e) => setForm({ ...form, visitorName: e.target.value })} required />
          <input className="input-field" placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required />
          <input type="datetime-local" className="input-field" value={form.expectedDate} onChange={(e) => setForm({ ...form, expectedDate: e.target.value })} required />
          <button type="submit" className="btn-primary w-full">Add</button>
        </form>
      </Modal>
    </div>
  );
}
