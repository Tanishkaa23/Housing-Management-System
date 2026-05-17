import { useEffect, useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { eventAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';

function Countdown({ date }) {
  const [left, setLeft] = useState('');
  useEffect(() => {
    const tick = () => {
      const diff = new Date(date) - new Date();
      if (diff <= 0) { setLeft('Started'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      setLeft(`${d}d ${h}h`);
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [date]);
  return <span className="flex items-center gap-1 text-xs text-indigo-600"><Clock size={14} /> {left}</span>;
}

export default function Events() {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Society meeting', date: '', location: 'Community Hall' });

  const load = () => {
    setLoading(true);
    eventAPI.getAll().then(({ data }) => setEvents(data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await eventAPI.create(form);
      toast.success('Event created');
      setModalOpen(false);
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const rsvp = async (id) => {
    await eventAPI.rsvp(id);
    toast.success('RSVP updated');
    load();
  };

  return (
    <div className="page-container">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Society Events</h1>
        {isAdmin && <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={18} /> Create Event</button>}
      </div>
      {loading ? <TableSkeleton /> : events.length === 0 ? <EmptyState /> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <div key={e._id} className="glass-card p-5">
              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-xs text-indigo-600">{e.category}</p>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{e.description}</p>
              <p className="mt-2 text-xs">{new Date(e.date).toLocaleString()} • {e.location}</p>
              <Countdown date={e.date} />
              <p className="mt-2 text-xs text-slate-400">{e.rsvps?.length || 0} RSVPs</p>
              <button onClick={() => rsvp(e._id)} className="btn-secondary mt-3 w-full text-xs">RSVP</button>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Event">
        <form onSubmit={handleCreate} className="space-y-3">
          <input className="input-field" placeholder="Title" value={form.title} onChange={(ev) => setForm({ ...form, title: ev.target.value })} required />
          <textarea className="input-field" rows={3} placeholder="Description" value={form.description} onChange={(ev) => setForm({ ...form, description: ev.target.value })} required />
          <select className="input-field" value={form.category} onChange={(ev) => setForm({ ...form, category: ev.target.value })}>
            {['Society meeting', 'Festival', 'Sports', 'Maintenance drive', 'Other'].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="datetime-local" className="input-field" value={form.date} onChange={(ev) => setForm({ ...form, date: ev.target.value })} required />
          <input className="input-field" placeholder="Location" value={form.location} onChange={(ev) => setForm({ ...form, location: ev.target.value })} />
          <button type="submit" className="btn-primary w-full">Create</button>
        </form>
      </Modal>
    </div>
  );
}
