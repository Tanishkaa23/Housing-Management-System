import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { complaintAPI, staffAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import ComplaintTimeline from '../components/ui/ComplaintTimeline';
import { TableSkeleton } from '../components/ui/Skeleton';

const categories = ['Water', 'Electricity', 'Cleaning', 'Security', 'Internet', 'Lift Issue'];

export default function Complaints() {
  const { isAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'Water' });
  const [image, setImage] = useState(null);

  const load = () => {
    setLoading(true);
    complaintAPI.getAll({ search, status: statusFilter || undefined })
      .then(({ data }) => setComplaints(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, statusFilter]);
  useEffect(() => { if (isAdmin) staffAPI.getAll().then(({ data }) => setStaff(data)); }, [isAdmin]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('category', form.category);
    if (image) fd.append('image', image);
    try {
      await complaintAPI.create(fd);
      toast.success('Complaint submitted');
      setModalOpen(false);
      setForm({ title: '', description: '', category: 'Water' });
      load();
    } catch {
      toast.error('Failed to submit');
    }
  };

  const updateStatus = async (id, status, assignedStaff) => {
    try {
      await complaintAPI.update(id, { status, assignedStaff, note: `Updated to ${status}` });
      toast.success('Updated');
      load();
      setSelected(null);
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div className="page-container">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Complaints</h1>
        {!isAdmin && (
          <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={18} /> Raise Complaint</button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]"><SearchBar value={search} onChange={setSearch} placeholder="Search complaints..." /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="">All Status</option>
          {['Pending', 'In Progress', 'Resolved'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <TableSkeleton /> : complaints.length === 0 ? <EmptyState /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {complaints.map((c) => (
            <div key={c._id} className="glass-card cursor-pointer p-5 transition hover:shadow-lg" onClick={() => setSelected(c)}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-xs text-slate-500">{c.category} • Flat {c.flatNumber}</p>
                </div>
                <Badge status={c.status} />
              </div>
              <p className="mt-2 text-sm text-slate-600 line-clamp-2 dark:text-slate-400">{c.description}</p>
              {c.image && <img src={c.image} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Raise Complaint">
        <form onSubmit={handleCreate} className="space-y-3">
          <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((cat) => <option key={cat}>{cat}</option>)}
          </select>
          <textarea className="input-field" rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="text-sm" />
          <button type="submit" className="btn-primary w-full">Submit</button>
        </form>
      </Modal>
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.title} size="lg">
        {selected && (
          <>
            <Badge status={selected.status} />
            <p className="mt-2 text-sm">{selected.description}</p>
            <ComplaintTimeline status={selected.status} timeline={selected.timeline} />
            {isAdmin && (
              <div className="mt-4 flex flex-wrap gap-2">
                {['Pending', 'In Progress', 'Resolved'].map((s) => (
                  <button key={s} onClick={() => updateStatus(selected._id, s, selected.assignedStaff)} className="btn-secondary text-xs">{s}</button>
                ))}
                <select className="input-field mt-2" onChange={(e) => updateStatus(selected._id, selected.status, e.target.value)}>
                  <option value="">Assign Staff</option>
                  {staff.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.role})</option>)}
                </select>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
