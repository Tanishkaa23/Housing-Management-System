import { useEffect, useState } from 'react';
import { Mail, Phone, Plus } from 'lucide-react';
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
      setForm({ name: '', role: 'Cleaner', phone: '', email: '' });
      load();
    } catch {
      toast.error('Failed to add staff');
    }
  };

  const toggleAvailability = async (member) => {
    await staffAPI.update(member._id, { isAvailable: !member.isAvailable });
    load();
  };

  const markPresent = async (id) => {
    await staffAPI.attendance(id, { present: true });
    toast.success('Attendance marked');
    load();
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <p className="section-kicker">Operations</p>
          <h1 className="page-title">Staff</h1>
          <p className="page-subtitle">Manage staff profiles, availability, and daily attendance.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={18} /> Add Staff
        </button>
      </div>

      {loading ? <TableSkeleton /> : staff.length === 0 ? <EmptyState /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {staff.map((member) => (
            <article key={member._id} className="surface-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{member.name}</h2>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{member.role}</p>
                </div>
                <Badge status={member.isAvailable ? 'Approved' : 'Pending'}>
                  {member.isAvailable ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <p className="flex items-center gap-2"><Phone size={15} /> {member.phone}</p>
                <p className="flex items-center gap-2 truncate"><Mail size={15} /> {member.email}</p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button onClick={() => toggleAvailability(member)} className="btn-secondary text-xs">
                  Toggle Status
                </button>
                <button onClick={() => markPresent(member._id)} className="btn-primary text-xs">
                  Attendance
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff">
        <form onSubmit={handleCreate} className="space-y-4">
          <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {['Cleaner', 'Electrician', 'Plumber', 'Security', 'Other'].map((role) => <option key={role}>{role}</option>)}
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input-field" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <input type="email" className="input-field" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary w-full">Add Staff</button>
        </form>
      </Modal>
    </div>
  );
}
