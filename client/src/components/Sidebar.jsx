import React from 'react';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { motion } from 'framer-motion';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: CheckCircle2, label: 'Tasks', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      className="h-screen glass-panel sticky top-0 left-0 z-40 flex flex-col transition-all duration-300 border-r border-white/5"
    >
      {/* Logo Section */}
      <div className="h-24 flex items-center px-6 gap-3 overflow-hidden border-b border-white/5">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.6)]">
          <Zap className="text-white w-6 h-6 fill-white" />
        </div>
        {!isCollapsed && (
          <span className="font-extrabold text-2xl tracking-tighter text-white whitespace-nowrap text-glow">
            NOVA<span className="text-primary-500">TASK</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`w-full nav-link ${item.active ? 'nav-link-active' : ''}`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="p-4 border-t border-white/5">
        {!isCollapsed && (
          <div className="bg-white/[0.03] rounded-xl p-3 mb-4">
            <p className="text-xs text-slate-500 font-medium mb-1">CURRENT USER</p>
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          </div>
        )}
        <button 
          onClick={() => dispatch(logout())}
          className="w-full nav-link text-red-400/80 hover:text-red-400 hover:bg-red-400/5"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 w-6 h-6 bg-dark-700 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
