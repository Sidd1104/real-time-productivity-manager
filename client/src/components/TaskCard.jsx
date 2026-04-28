import React from 'react';
import { Calendar, TrendingUp, CheckCircle, Trash2, Clock, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const TaskCard = ({ task, onUpdateStatus, onDelete }) => {
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed';
  const isHighPriority = task.priorityScore > 500;

  const getPriorityStyles = (score) => {
    if (score >= 1000) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (score >= 400) return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    return 'text-green-400 bg-green-400/10 border-green-400/20';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`glass-card p-5 rounded-2xl group relative overflow-hidden transition-all duration-300 ${
        isOverdue ? 'shadow-[0_0_25px_rgba(248,113,113,0.05)] border-red-500/20' : ''
      }`}
    >
      {/* Dynamic Glow Accent */}
      <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${
        isOverdue ? 'bg-red-500' : isHighPriority ? 'bg-orange-500' : 'bg-primary-500/30 group-hover:bg-primary-500'
      }`} />

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex gap-4">
          <button 
            onClick={() => onUpdateStatus(task._id, task.status === 'completed' ? 'pending' : 'completed')}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
              task.status === 'completed' 
                ? 'bg-primary-500 border-primary-500 text-white' 
                : 'border-white/10 hover:border-primary-500/50'
            }`}
          >
            {task.status === 'completed' && <CheckCircle className="w-3.5 h-3.5" />}
          </button>
          
          <div>
            <h3 className={`text-base font-semibold transition-all duration-300 ${
              task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'
            }`}>
              {task.title}
            </h3>
            <p className="text-sm text-slate-500 line-clamp-1 mt-1 leading-relaxed">
              {task.description || 'No description provided'}
            </p>
          </div>
        </div>
        
        <button className="text-slate-600 hover:text-white transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/[0.03] text-slate-400 rounded-md border border-white/5">
            {task.category}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border flex items-center gap-1.5 ${getPriorityStyles(task.priorityScore)}`}>
            <TrendingUp size={12} />
            Score: {task.priorityScore}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? 'text-red-400' : 'text-slate-500'}`}>
            <Clock size={14} />
            {format(new Date(task.deadline), 'MMM d, h:mm a')}
          </div>
          
          <button 
            onClick={() => onDelete(task._id)}
            className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
