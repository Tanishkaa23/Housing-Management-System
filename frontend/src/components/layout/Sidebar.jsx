import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, MessageSquareWarning, Bell, Wrench, CreditCard,
  Users, UserCog, Calendar, UserCheck, Home, Search, X, Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/complaints', icon: MessageSquareWarning, label: 'Complaints' },
  { to: '/notices', icon: Bell, label: 'Notices' },
  { to: '/payments', icon: CreditCard, label: 'Payments' },
  { to: '/visitors', icon: UserCheck, label: 'Visitors' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/residents', icon: Users, label: 'Residents' },
  { to: '/staff', icon: UserCog, label: 'Staff' },
  { to: '/flats', icon: Building2, label: 'Flats' },
  { to: '/lost-found', icon: Search, label: 'Lost & Found' },
];

const residentLinks = [
  { to: '/resident/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/complaints', icon: MessageSquareWarning, label: 'Complaints' },
  { to: '/notices', icon: Bell, label: 'Notices' },
  { to: '/payments', icon: CreditCard, label: 'Payments' },
  { to: '/visitors', icon: UserCheck, label: 'Visitors' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/lost-found', icon: Search, label: 'Lost & Found' },
];

export default function Sidebar({ open, onClose }) {
  const { isAdmin } = useAuth();
  const links = isAdmin ? adminLinks : residentLinks;

  return (
  <>
    {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <motion.div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">S</motion.div>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">SocietySync</span>
        </div>
        <button onClick={onClose} className="lg:hidden"><X size={20} /></button>
      </div>
      <nav className="space-y-1 p-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  </>
  );
}
