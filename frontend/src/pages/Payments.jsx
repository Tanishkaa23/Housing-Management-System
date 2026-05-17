import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { generateReceipt } from '../utils/pdfReceipt';

export default function Payments() {
  const { user, isAdmin } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ flatNumber: '', amount: 3500, month: 'June', year: 2026, dueDate: '' });

  const load = () => {
    setLoading(true);
    paymentAPI.getAll({ search }).then(({ data }) => setPayments(data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const markPaid = async (id) => {
    try {
      const { data } = await paymentAPI.markPaid(id, { paymentMode: 'UPI' });
      toast.success('Marked as paid');
      load();
      generateReceipt(data, user?.name);
    } catch {
      toast.error('Failed');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await paymentAPI.create({ ...form, resident: user._id });
      toast.success('Payment record created');
      setModalOpen(false);
      load();
    } catch {
      toast.error('Failed');
    }
  };

  return (
    <div className="page-container">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Maintenance Payments</h1>
        {isAdmin && <button onClick={() => setModalOpen(true)} className="btn-primary">Add Payment Record</button>}
      </div>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by flat or month..." />
      {loading ? <TableSkeleton /> : payments.length === 0 ? <EmptyState /> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="p-3 text-left">Flat</th>
                <th className="p-3 text-left">Month</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Fine</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Due</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-3">{p.flatNumber}</td>
                  <td className="p-3">{p.month} {p.year}</td>
                  <td className="p-3">₹{p.amount}</td>
                  <td className="p-3 text-rose-600">{p.fine > 0 ? `₹${p.fine}` : '-'}</td>
                  <td className="p-3 font-semibold">₹{p.totalAmount}</td>
                  <td className="p-3">{new Date(p.dueDate).toLocaleDateString()}</td>
                  <td className="p-3"><Badge status={p.status} /></td>
                  <td className="p-3 flex gap-2">
                    {p.status === 'Paid' && (
                      <button onClick={() => generateReceipt(p, p.resident?.name || user?.name)} className="btn-secondary text-xs">
                        <Download size={14} /> Receipt
                      </button>
                    )}
                    {isAdmin && p.status !== 'Paid' && (
                      <button onClick={() => markPaid(p._id)} className="btn-primary text-xs">Mark Paid</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Payment">
        <form onSubmit={handleCreate} className="space-y-3">
          <input className="input-field" placeholder="Flat Number" value={form.flatNumber} onChange={(e) => setForm({ ...form, flatNumber: e.target.value })} required />
          <input type="number" className="input-field" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: +e.target.value })} />
          <input className="input-field" placeholder="Month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} />
          <input type="date" className="input-field" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          <button type="submit" className="btn-primary w-full">Create</button>
        </form>
      </Modal>
    </div>
  );
}
