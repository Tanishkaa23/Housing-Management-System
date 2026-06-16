import { useEffect, useState } from 'react';
import { MapPin, Pencil, Phone, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { lostFoundAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { resolveAssetUrl } from '../utils/assets';

export default function LostFound() {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', type: 'Lost', location: '', contactInfo: '' });
  const [image, setImage] = useState(null);

  const load = () => {
    setLoading(true);
    lostFoundAPI.getAll().then(({ data }) => setItems(data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({ title: '', description: '', type: 'Lost', location: '', contactInfo: '' });
    setImage(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'Lost',
      location: item.location || '',
      contactInfo: item.contactInfo || '',
    });
    setImage(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (image) formData.append('image', image);

      if (editingItem) {
        await lostFoundAPI.update(editingItem._id, formData);
        toast.success('Item updated');
      } else {
        await lostFoundAPI.create(formData);
        toast.success('Item posted');
      }
      closeModal();
      setForm({ title: '', description: '', type: 'Lost', location: '', contactInfo: '' });
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save item');
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
        <button onClick={openCreateModal} className="btn-primary">
          <Plus size={18} /> Post Item
        </button>
      </div>

      {loading ? <TableSkeleton /> : items.length === 0 ? <EmptyState /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item._id} className="surface-card p-5">
              {(isAdmin || item.postedBy?._id === user?._id || item.postedBy === user?._id) && (
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="float-right rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label={`Edit ${item.title}`}
                >
                  <Pencil size={16} />
                </button>
              )}
              {item.imageUrl && (
                <img
                  src={resolveAssetUrl(item.imageUrl)}
                  alt={item.title}
                  className="mb-4 h-44 w-full rounded-lg object-cover"
                  loading="lazy"
                />
              )}
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

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingItem ? 'Edit Lost/Found Item' : 'Post Lost/Found Item'}>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              {editingItem ? 'Replace Photo (Optional)' : 'Attach Photo (Optional)'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0] || null)}
              className="block w-full text-xs text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-800 dark:file:text-slate-300 dark:hover:file:bg-slate-700"
            />
          </div>
          <button type="submit" className="btn-primary w-full">{editingItem ? 'Save Changes' : 'Post Item'}</button>
        </form>
      </Modal>
    </div>
  );
}
