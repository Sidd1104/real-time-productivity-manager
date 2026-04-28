import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, color, trend }) => {
  const colorVariants = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/10',
    cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/10',
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/10',
    rose: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/10',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`glass-card p-6 rounded-2xl border relative overflow-hidden bg-gradient-to-br ${colorVariants[color]}`}
    >
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          {trend && (
            <p className="text-[10px] font-bold text-green-400 mt-2 flex items-center gap-1">
              <span>↑</span> {trend} from yesterday
            </p>
          )}
        </div>
        <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.05]">
          {icon}
        </div>
      </div>
      
      {/* Decorative background glow */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-20 bg-current`} />
    </motion.div>
  );
};

export default StatsCard;
