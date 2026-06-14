import { useState, useEffect } from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { noticeAPI } from '../../api/services';
import Modal from '../ui/Modal';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [notices, setNotices] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  useEffect(() => {
    noticeAPI.getAll().then(({ data }) => setNotices(data.slice(0, 5))).catch(() => {});
  }, []);

  const urgentCount = notices.filter((n) => n.priority === 'Urgent').length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#d1d5db] bg-[#e4e5e2] px-4 md:px-6">
      <button onClick={onMenuClick} className="rounded-xl bg-[#f7f7f6] p-2.5 shadow-sm hover:bg-white lg:hidden">
        <Menu size={20} />
      </button>
      <div className="hidden items-center gap-3 text-sm text-slate-600 md:flex">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#5f6368] text-xs font-bold text-white">
          {user?.name?.slice(0, 1)?.toUpperCase() || 'U'}
        </span>
        Welcome back, <span className="font-semibold text-slate-900">{user?.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative rounded-xl bg-[#f7f7f6] p-2.5 shadow-sm hover:bg-white"
          >
            <Bell size={20} />
            {urgentCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {urgentCount}
              </span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#d1d5db] bg-[#f7f7f6] shadow-xl">
              <div className="border-b border-[#e1e5ea] p-3 font-semibold">Notifications</div>
              <div className="max-h-64 overflow-y-auto">
                {notices.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500">No notices</p>
                ) : (
                  notices.map((n) => (
                    <div key={n._id} className="border-b border-[#e6e8eb] p-3 text-sm last:border-0">
                      <p className="font-medium">{n.title}</p>
                      <p className="text-xs text-slate-500">{n.priority}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <button onClick={() => setConfirmLogoutOpen(true)} className="rounded-xl bg-[#f7f7f6] p-2.5 text-rose-600 shadow-sm hover:bg-white">
          <LogOut size={20} />
        </button>
      </div>

      <Modal isOpen={confirmLogoutOpen} onClose={() => setConfirmLogoutOpen(false)} title="Confirm Logout" size="sm">
        <p className="text-sm text-slate-600">Are you sure you want to log out?</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setConfirmLogoutOpen(false)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmLogoutOpen(false);
              logout();
            }}
            className="btn-primary"
          >
            Yes, Log Out
          </button>
        </div>
      </Modal>
    </header>
  );
}
