import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', flatNumber: '', role: 'resident' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const isAdminRole = form.role === 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created!');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e4e5e2] p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md overflow-hidden rounded-2xl border border-[#d1d5db] bg-[#f7f7f6] shadow-lg">
        <div className={`p-6 ${isAdminRole ? 'bg-[#5f6368] text-white' : 'bg-white text-slate-900'}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider ${isAdminRole ? 'text-slate-200' : 'text-slate-500'}`}>
            {isAdminRole ? 'Admin Access' : 'Resident Access'}
          </p>
          <h1 className="mt-2 text-2xl font-bold">{isAdminRole ? 'Create Admin Account' : 'Create Account'}</h1>
          <p className={`mt-2 text-sm ${isAdminRole ? 'text-slate-200' : 'text-slate-500'}`}>
            {isAdminRole
              ? 'Admin users can manage notices, staff, complaints, and analytics.'
              : 'Join your society on SocietySync and track your resident activity.'}
          </p>
        </div>
        <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="input-field"
          >
            <option value="resident">Resident</option>
            <option value="admin">Admin</option>
          </select>
          {['name', 'email', 'password', 'phone', 'flatNumber'].map((f) => (
            f === 'flatNumber' && isAdminRole ? null : (
            <input
              key={f}
              name={f}
              type={f === 'password' ? 'password' : f === 'email' ? 'email' : 'text'}
              placeholder={f === 'flatNumber'
                ? isAdminRole
                  ? 'Flat Number (optional for admin)'
                  : 'Flat Number (e.g. A-101)'
                : f.charAt(0).toUpperCase() + f.slice(1)}
              value={form[f]}
              onChange={handleChange}
              className="input-field"
              required={['name', 'email', 'password'].includes(f)}
            />
            )
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating...' : isAdminRole ? 'Create Admin Account' : 'Sign Up'}
          </button>
        </form>
        </div>
        <p className="mt-4 text-center text-sm">
          Have an account? <Link to="/login" className="font-semibold text-[#5f6368] hover:text-[#4f5458]">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
