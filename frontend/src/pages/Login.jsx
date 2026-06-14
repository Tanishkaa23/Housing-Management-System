import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Welcome back!');
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@societysync.com');
      setPassword('admin123');
    } else {
      setEmail('resident@societysync.com');
      setPassword('resident123');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e4e5e2] p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 inline-flex rounded-2xl bg-[#5f6368] p-3 text-white">
            <Building2 size={28} />
          </div>
          <h1 className="mt-2 text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-slate-500">Sign in to SocietySync</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => fillDemo('admin')} className="btn-secondary flex-1 text-xs">Admin Demo</button>
          <button type="button" onClick={() => fillDemo('resident')} className="btn-secondary flex-1 text-xs">Resident Demo</button>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          No account? <Link to="/signup" className="font-semibold text-[#5f6368] hover:text-[#4f5458]">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
