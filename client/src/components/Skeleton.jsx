import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-800/50 rounded-lg ${className}`}></div>
  );
};

export const TaskSkeleton = () => (
  <div className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
    <div className="flex gap-4 w-full">
      <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
      <div className="w-full space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </div>
  </div>
);

export const StatSkeleton = () => (
  <div className="glass-card p-6 rounded-2xl border border-white/5">
    <Skeleton className="w-10 h-10 mb-4" />
    <Skeleton className="h-4 w-2/3 mb-2" />
    <Skeleton className="h-8 w-1/2" />
  </div>
);

export default Skeleton;
