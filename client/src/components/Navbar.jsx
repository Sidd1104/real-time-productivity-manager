import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="h-20 border-b border-white/5 bg-dark-900/50 backdrop-blur-sm px-6 md:px-10 flex items-center justify-between sticky top-0 z-30">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search tasks or analytics..."
            className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-10 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:bg-white/[0.05] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-dark-900"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-white/5 hidden md:block"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-white leading-none">{user?.name}</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase mt-1 tracking-wider">Pro Account</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple p-[1px]">
            <div className="w-full h-full rounded-[11px] bg-dark-900 flex items-center justify-center overflow-hidden">
              <User size={20} className="text-white/80" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
