import { useEffect, useState } from 'react';
import { Plus, Mic, Droplet, Zap, Sparkles, Shield, Wifi, ArrowUpDown, User, Home, Clock, AlertCircle, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { complaintAPI, staffAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import ComplaintTimeline from '../components/ui/ComplaintTimeline';
import { TableSkeleton } from '../components/ui/Skeleton';
import VoiceRecorder from '../components/ui/VoiceRecorder';
import { resolveAssetUrl } from '../utils/assets';

const categories = ['Water', 'Electricity', 'Cleaning', 'Security', 'Internet', 'Lift Issue'];

const categoryThemes = {
  Water: {
    icon: Droplet,
    colorClass: 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/30',
    borderClass: 'hover:border-sky-500/30 dark:hover:border-sky-500/20',
    bgLight: 'bg-sky-500/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400'
  },
  Electricity: {
    icon: Zap,
    colorClass: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30',
    borderClass: 'hover:border-amber-500/30 dark:hover:border-amber-500/20',
    bgLight: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
  },
  Cleaning: {
    icon: Sparkles,
    colorClass: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30',
    borderClass: 'hover:border-emerald-500/30 dark:hover:border-emerald-500/20',
    bgLight: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
  },
  Security: {
    icon: Shield,
    colorClass: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30',
    borderClass: 'hover:border-rose-500/30 dark:hover:border-rose-500/20',
    bgLight: 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
  },
  Internet: {
    icon: Wifi,
    colorClass: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/30',
    borderClass: 'hover:border-indigo-500/30 dark:hover:border-indigo-500/20',
    bgLight: 'bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'
  },
  'Lift Issue': {
    icon: ArrowUpDown,
    colorClass: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30',
    borderClass: 'hover:border-purple-500/30 dark:hover:border-purple-500/20',
    bgLight: 'bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
  }
};

export default function Complaints() {
  const { user, isAdmin, isStaff } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'Water' });
  const [image, setImage] = useState(null);
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  const load = () => {
    setLoading(true);
    complaintAPI.getAll({ search, status: statusFilter || undefined })
      .then(({ data }) => setComplaints(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, statusFilter]);
  useEffect(() => { if (isAdmin) staffAPI.getAll().then(({ data }) => setStaff(data)); }, [isAdmin]);

  const openCreateModal = () => {
    setEditingComplaint(null);
    setForm({ title: '', description: '', category: 'Water' });
    setImage(null);
    setModalOpen(true);
  };

  const openEditModal = (complaint) => {
    setEditingComplaint(complaint);
    setForm({
      title: complaint.title || '',
      description: complaint.description || '',
      category: complaint.category || 'Water',
    });
    setImage(null);
    setSelected(null);
    setModalOpen(true);
  };

  const closeFormModal = () => {
    setModalOpen(false);
    setEditingComplaint(null);
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('category', form.category);
    if (image) fd.append('image', image);
    try {
      if (editingComplaint) {
        await complaintAPI.update(editingComplaint._id, fd);
        toast.success('Complaint updated');
      } else {
        await complaintAPI.create(fd);
        toast.success('Complaint submitted');
      }
      closeFormModal();
      setForm({ title: '', description: '', category: 'Water' });
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save complaint');
    }
  };

  const handleVoiceSubmit = async (formData) => {
    try {
      await complaintAPI.create(formData);
      toast.success('Complaint submitted');
      load();
    } catch {
      toast.error('Failed to submit');
      throw new Error('API Submission failed'); // propagate to voice component
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
  };

  return (
    <div className="page-container">
      {/* Title Header area */}
      <div className="module-header">
        <div>
          <p className="section-kicker">{isStaff ? 'Assigned work' : 'Issue tracking'}</p>
          <h1 className="page-title">
            {isStaff ? 'My Assigned Tasks' : 'Complaints Hub'}
          </h1>
          <p className="page-subtitle">
            {isStaff 
              ? 'Manage maintenance calls, review details, and update repair progress.' 
              : 'Raise issues, track resolve progress, and coordinate with maintenance staff.'}
          </p>
        </div>
        {!isStaff && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setVoiceModalOpen(true)}
              className="btn-secondary"
            >
              <Mic size={18} />
              <span>Voice Assist</span>
            </button>
            <button
              onClick={openCreateModal}
              className="btn-primary"
            >
              <Plus size={18} />
              <span>Raise Complaint</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Total complaints', value: totalCount, tone: 'bg-[#5f6368] text-white' },
          { label: 'Pending', value: pendingCount, tone: 'bg-[#dde1e6] text-[#4f5458]' },
          { label: 'Resolved', value: resolvedCount, tone: 'bg-[#dde1e6] text-[#4f5458]' },
        ].map((item) => (
          <div key={item.label} className="surface-card flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-950">{item.value}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Filter and Search Section */}
      <div className="toolbar flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search complaints by title, description..." />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:inline">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full cursor-pointer px-3 py-2 sm:w-44"
          >
            <option value="">All Statuses</option>
            {['Pending', 'In Progress', 'Resolved'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid area */}
      {loading ? (
        <TableSkeleton />
      ) : complaints.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-5 md:grid-cols-2"
        >
          {complaints.map((c) => {
            const theme = categoryThemes[c.category] || {
              icon: AlertCircle,
              colorClass: 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-800',
              borderClass: 'hover:border-slate-500/30',
              bgLight: 'bg-slate-500/10 text-slate-700'
            };
            const IconComponent = theme.icon;

            return (
              <motion.div
                key={c._id}
                variants={cardVariants}
                className={`surface-card relative cursor-pointer p-5 premium-card-transition ${theme.borderClass}`}
                onClick={() => setSelected(c)}
              >
                {/* Accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-lg opacity-80 ${
                  c.status === 'Resolved' ? 'bg-emerald-500' : c.status === 'In Progress' ? 'bg-indigo-500' : 'bg-amber-500'
                }`} />

                {/* Card Header */}
                <div className="flex items-start justify-between gap-4 mt-1">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.colorClass}`}>
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <span className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-0.5 ${theme.bgLight}`}>
                        {c.category}
                      </span>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                        {c.title}
                      </h3>
                    </div>
                  </div>
                  <Badge status={c.status} />
                </div>
                {/* Card Body */}
                <p className="mt-3.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                {/* Uploaded Image thumbnail */}
                {c.image && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <img
                      src={resolveAssetUrl(c.image)}
                      alt="Complaint attachment"
                      className="h-28 w-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Card Footer details */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-50 dark:border-slate-800/40 pt-3.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Home size={13} className="text-slate-300 dark:text-slate-600" />
                    <span>Flat {c.flatNumber}</span>
                    {c.resident && (
                      <>
                        <span className="text-slate-200 dark:text-slate-800">•</span>
                        <User size={13} className="text-slate-300 dark:text-slate-600" />
                        <span className="truncate max-w-[100px]">{c.resident.name}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Clock size={13} className="text-slate-300 dark:text-slate-600" />
                      <span>{new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                    {(isAdmin || c.resident?._id === user?._id || c.resident === user?._id) && !isStaff && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditModal(c);
                        }}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        aria-label={`Edit ${c.title}`}
                      >
                        <Pencil size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Voice Recorder Assistant Modal */}
      <VoiceRecorder
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSubmit={handleVoiceSubmit}
      />

      {/* Manual Registration Modal */}
      <Modal isOpen={modalOpen} onClose={closeFormModal} title={editingComplaint ? 'Edit Complaint' : 'Raise Complaint'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Complaint Title</label>
            <input
              className="input-field py-3 rounded-xl focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="e.g. Broken corridor light bulb"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Category</label>
            <select
              className="input-field py-3 rounded-xl focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((cat) => <option key={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Description</label>
            <textarea
              className="input-field py-3 rounded-xl focus:ring-indigo-500/20 focus:border-indigo-500"
              rows={4}
              placeholder="Provide a detailed description of the issue..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              {editingComplaint ? 'Replace Photo (Optional)' : 'Attach Photo (Optional)'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0] || null)}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-800 dark:file:text-slate-300 dark:hover:file:bg-slate-700 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3"
          >
            {editingComplaint ? 'Save Changes' : 'Submit Complaint'}
          </button>
        </form>
      </Modal>

      {/* Details Viewer Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Complaint Details" size="lg">
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{selected.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Category: <span className="font-semibold">{selected.category}</span></p>
              </div>
              <Badge status={selected.status} />
            </div>
            {(isAdmin || selected.resident?._id === user?._id || selected.resident === user?._id) && !isStaff && (
              <button
                type="button"
                onClick={() => openEditModal(selected)}
                className="btn-secondary"
              >
                <Pencil size={16} />
                <span>Edit Complaint</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 dark:bg-slate-900/30 p-4 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Resident Details</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 block mt-0.5">{selected.resident?.name}</span>
                <span className="text-xs text-slate-400">{selected.resident?.email}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Flat & Date</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 block mt-0.5">Flat {selected.flatNumber}</span>
                <span className="text-xs text-slate-400">{new Date(selected.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Description</span>
              <p className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800/60 dark:bg-slate-900/10 dark:text-slate-300">
                {selected.description}
              </p>
            </div>

            {selected.image && (
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Attached Photograph</span>
                <div className="overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800 shadow">
                  <a href={resolveAssetUrl(selected.image)} target="_blank" rel="noopener noreferrer">
                    <img src={resolveAssetUrl(selected.image)} alt="Complaint detail attachment" className="w-full max-h-80 object-cover" />
                  </a>
                </div>
              </div>
            )}

            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Progress History</span>
              <div className="rounded-lg border border-slate-100 dark:border-slate-800/80 p-4 dark:bg-slate-900/20">
                <ComplaintTimeline status={selected.status} timeline={selected.timeline} />
              </div>
            </div>

            {/* Admin & Staff Management Section */}
            {(isAdmin || isStaff) && (
              <div className="border-t border-slate-100 dark:border-slate-800 pb-2 pt-4">
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3">
                  {isAdmin ? 'Admin Actions' : 'Update Task Status'}
                </span>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex gap-2 shrink-0">
                    {['Pending', 'In Progress', 'Resolved'].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected._id, s, selected.assignedStaff?._id || selected.assignedStaff)}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold border transition ${
                          selected.status === s
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {isAdmin && (
                    <div className="flex-1">
                      <select
                        className="input-field py-2 rounded-xl text-xs focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                        value={selected.assignedStaff?._id || selected.assignedStaff || ''}
                        onChange={(e) => updateStatus(selected._id, selected.status, e.target.value)}
                      >
                        <option value="">Assign Staff Representative</option>
                        {staff.map((s) => (
                          <option key={s._id} value={s._id}>{s.name} ({s.role})</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
