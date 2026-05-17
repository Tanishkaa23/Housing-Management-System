import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { sosAPI } from '../../api/services';

export default function SOSButton() {
  const [loading, setLoading] = useState(false);

  const handleSOS = async () => {
    if (!window.confirm('Trigger emergency SOS alert? Admin will be notified immediately.')) return;
    setLoading(true);
    try {
      await sosAPI.trigger({ message: 'Emergency SOS triggered by resident' });
      toast.success('SOS alert sent! Help is on the way.');
    } catch {
      toast.error('Failed to send SOS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSOS}
      disabled={loading}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/40 hover:bg-rose-700 disabled:opacity-50"
    >
      <AlertTriangle size={18} className="animate-pulse" />
      {loading ? 'Sending...' : 'SOS'}
    </motion.button>
  );
}
