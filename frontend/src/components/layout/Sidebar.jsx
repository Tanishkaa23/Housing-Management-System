import { NavLink } from 'react-router-dom';
import {
  MessageSquareWarning, Bell, UserCog, Search, X, Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const adminLinks = [
  { to: '/complaints', icon: MessageSquareWarning, label: 'Complaints' },
  { to: '/notices', icon: Bell, label: 'Notices' },  
  { to: '/lost-found', icon: Search, label: 'Lost & Found' },
  { to: '/staff', icon: UserCog, label: 'Staff' },
];

const residentLinks = [
  { to: '/complaints', icon: MessageSquareWarning, label: 'Complaints' },
  { to: '/notices', icon: Bell, label: 'Notices' },
  { to: '/lost-found', icon: Search, label: 'Lost & Found' },
];

const staffLinks = [
  { to: '/complaints', icon: MessageSquareWarning, label: 'Assigned Complaints' },
  { to: '/notices', icon: Bell, label: 'Notices' },
  { to: '/lost-found', icon: Search, label: 'Lost & Found' },
];

export default function Sidebar({ open, onClose }) {
  const { isAdmin, isStaff } = useAuth();
  const links = isAdmin ? adminLinks : isStaff ? staffLinks : residentLinks;

  return (
  <>
    {open && <div className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden" onClick={onClose} />}
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[#d1d5db] bg-[#ececea] transition-transform lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-[#d1d5db] px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5f6368] text-white shadow-sm">
            <Building2 size={19} />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-950">SocietySync</span>
            <span className="block text-[11px] text-slate-500">Housing management</span>
          </div>
        </div>
        <button onClick={onClose} className="rounded-xl p-2 hover:bg-[#dde1e6] lg:hidden"><X size={20} /></button>
      </div>
      <nav className="space-y-2 p-3">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive
                    ? 'bg-[#5f6368] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-[#dde1e6]'
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
