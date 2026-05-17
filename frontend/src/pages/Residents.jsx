import { useEffect, useState } from 'react';
import { userAPI } from '../api/services';
import SearchBar from '../components/ui/SearchBar';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    userAPI.getResidents({ search }).then(({ data }) => setResidents(data)).finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold">Residents Management</h1>
      <SearchBar value={search} onChange={setSearch} placeholder="Search residents..." />
      {loading ? <TableSkeleton /> : residents.length === 0 ? <EmptyState /> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {residents.map((r) => (
            <div key={r._id} className="glass-card p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                {r.name.charAt(0)}
              </div>
              <h3 className="mt-3 font-semibold">{r.name}</h3>
              <p className="text-sm text-slate-500">{r.email}</p>
              <p className="text-sm">Flat: <span className="font-medium">{r.flatNumber || 'N/A'}</span></p>
              <p className="text-sm">Phone: {r.phone || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
