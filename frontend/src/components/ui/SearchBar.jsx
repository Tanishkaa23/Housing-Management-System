import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm transition focus-within:border-slate-500 focus-within:ring-2 focus-within:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-slate-400 dark:focus-within:ring-slate-700">
      <Search className="shrink-0 text-slate-400" size={16} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
      />
    </div>
  );
}
