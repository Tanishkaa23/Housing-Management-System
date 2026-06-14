import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`glass-card p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="mb-2 border-b border-slate-200 pb-2 dark:border-slate-800">{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="text-xl font-semibold">{children}</h3>;
}

export function CardContent({ children }) {
  return <div className="pt-3">{children}</div>;
}
