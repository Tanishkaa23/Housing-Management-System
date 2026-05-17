import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', flatNumber: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register({ ...form, role: 'resident' });
      toast.success('Account created!');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/resident/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 dark:from-slate-950 dark:to-indigo-950">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card p-8">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="mb-6 text-sm text-slate-500">Join your society on SocietySync</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          {['name', 'email', 'password', 'phone', 'flatNumber'].map((f) => (
            <input
              key={f}
              name={f}
              type={f === 'password' ? 'password' : f === 'email' ? 'email' : 'text'}
              placeholder={f === 'flatNumber' ? 'Flat Number (e.g. A-101)' : f.charAt(0).toUpperCase() + f.slice(1)}
              value={form[f]}
              onChange={handleChange}
              className="input-field"
              required={['name', 'email', 'password'].includes(f)}
            />
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Sign Up'}</button>
        </form>
        <p className="mt-4 text-center text-sm">
          Have an account? <Link to="/login" className="font-semibold text-indigo-600">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
