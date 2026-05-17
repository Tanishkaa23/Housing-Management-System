import { useState } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', flatNumber: user?.flatNumber || '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const { data } = await authAPI.updateProfile(payload);
      updateUser(data);
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-lg">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="glass-card p-6">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-3xl font-bold text-white">
          {user?.name?.charAt(0)}
        </div>
        <p className="text-sm text-slate-500">{user?.email}</p>
        <p className="mb-4 text-sm capitalize text-indigo-600">{user?.role}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input-field" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="input-field" placeholder="Flat Number" value={form.flatNumber} onChange={(e) => setForm({ ...form, flatNumber: e.target.value })} disabled={user?.role === 'admin'} />
          <input type="password" className="input-field" placeholder="New Password (optional)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}
