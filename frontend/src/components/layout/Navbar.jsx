import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { noticeAPI } from '../../api/services';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [notices, setNotices] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    noticeAPI.getAll().then(({ data }) => setNotices(data.slice(0, 5))).catch(() => {});
  }, []);

  const urgentCount = notices.filter((n) => n.priority === 'Urgent').length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 md:px-6">
      <button onClick={onMenuClick} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800">
        <Menu size={22} />
      </button>
      <div className="hidden text-sm text-slate-500 md:block">
        Welcome back, <span className="font-semibold text-slate-800 dark:text-white">{user?.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Bell size={20} />
            {urgentCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {urgentCount}
              </span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-200 p-3 font-semibold dark:border-slate-700">Notifications</div>
              <div className="max-h-64 overflow-y-auto">
                {notices.length === 0 ? (
                  <p className="p-4 text-sm text-slate-400">No notices</p>
                ) : (
                  notices.map((n) => (
                    <div key={n._id} className="border-b border-slate-100 p-3 text-sm last:border-0 dark:border-slate-700">
                      <p className="font-medium">{n.title}</p>
                      <p className="text-xs text-slate-400">{n.priority}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <Link to="/profile" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
          <User size={20} />
        </Link>
        <button onClick={logout} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
