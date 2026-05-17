import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { staffAPI } from '../api/services';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', role: 'Cleaner', phone: '', email: '' });

  const load = () => {
    setLoading(true);
    staffAPI.getAll().then(({ data }) => setStaff(data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await staffAPI.create(form);
      toast.success('Staff added');
      setModalOpen(false);
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const toggleAvailability = async (s) => {
    await staffAPI.update(s._id, { isAvailable: !s.isAvailable });
    load();
  };

  const markPresent = async (id) => {
    await staffAPI.attendance(id, { present: true });
    toast.success('Attendance marked');
    load();
  };

  return (
    <div className="page-container">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={18} /> Add Staff</button>
      </div>
      {loading ? <TableSkeleton /> : staff.length === 0 ? <EmptyState /> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {staff.map((s) => (
            <div key={s._id} className="glass-card p-5">
              <h3 className="font-semibold">{s.name}</h3>
              <p className="text-sm text-indigo-600">{s.role}</p>
              <p className="text-sm text-slate-500">{s.phone}</p>
              <div className="mt-2">
                <Badge status={s.isAvailable ? 'Approved' : 'Pending'}>
                  {s.isAvailable ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => toggleAvailability(s)} className="btn-secondary text-xs flex-1">Toggle</button>
                <button onClick={() => markPresent(s._id)} className="btn-primary text-xs flex-1">Attendance</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff">
        <form onSubmit={handleCreate} className="space-y-3">
          <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {['Cleaner', 'Electrician', 'Plumber', 'Security', 'Other'].map((r) => <option key={r}>{r}</option>)}
          </select>
          <input className="input-field" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <button type="submit" className="btn-primary w-full">Add</button>
        </form>
      </Modal>
    </div>
  );
}
