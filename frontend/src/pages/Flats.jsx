import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { flatAPI, userAPI } from '../api/services';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import StatCard from '../components/ui/StatCard';
import { Building2, Home, DoorOpen } from 'lucide-react';

export default function Flats() {
  const [flats, setFlats] = useState([]);
  const [stats, setStats] = useState(null);
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ flatNumber: '', floor: 1, block: 'A', bedrooms: 2 });

  const load = () => {
    flatAPI.getAll({ search }).then(({ data }) => setFlats(data));
    flatAPI.stats().then(({ data }) => setStats(data));
    userAPI.getResidents().then(({ data }) => setResidents(data));
  };

  useEffect(() => { load(); }, [search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await flatAPI.create(form);
      toast.success('Flat added');
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="page-container">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Flat & Occupancy</h1>
        <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus size={18} /> Add Flat</button>
      </div>
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Total Flats" value={stats.total} icon={Building2} color="indigo" />
          <StatCard title="Occupied" value={stats.occupied} icon={Home} color="emerald" />
          <StatCard title="Vacant" value={stats.vacant} icon={DoorOpen} color="amber" />
        </div>
      )}
      <SearchBar value={search} onChange={setSearch} placeholder="Search flat number..." />
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {flats.map((f) => (
          <div key={f._id} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{f.flatNumber}</h3>
              <Badge status={f.status === 'Occupied' ? 'Paid' : 'Pending'}>{f.status}</Badge>
            </div>
            <p className="text-sm text-slate-500">Block {f.block} • Floor {f.floor}</p>
            {f.resident && <p className="mt-2 text-sm font-medium">{f.resident.name}</p>}
          </div>
        ))}
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Flat">
        <form onSubmit={handleCreate} className="space-y-3">
          <input className="input-field" placeholder="Flat Number" value={form.flatNumber} onChange={(e) => setForm({ ...form, flatNumber: e.target.value })} required />
          <input type="number" className="input-field" placeholder="Floor" value={form.floor} onChange={(e) => setForm({ ...form, floor: +e.target.value })} />
          <input className="input-field" placeholder="Block" value={form.block} onChange={(e) => setForm({ ...form, block: e.target.value })} />
          <button type="submit" className="btn-primary w-full">Add</button>
        </form>
      </Modal>
    </div>
  );
}
