import { useState, useRef, useEffect } from 'react';
import { History, Bookmark, LogOut, User as UserIcon, ChevronDown, Settings, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  user: { name: string; email: string } | null;
  onHistoryClick: () => void;
  onSavedClick: () => void;
  onUploadClick?: () => void;
  onLogout: () => void;
  onDashboardClick: () => void;
}

export function Header({ user, onHistoryClick, onSavedClick, onUploadClick, onLogout, onDashboardClick }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] glass px-4 py-3 sm:px-8 sm:py-4 flex items-center justify-between border-b border-white/5">
      <div className="flex items-center gap-4">
        <button 
          onClick={onUploadClick}
          className="flex items-center gap-2 group outline-none"
        >
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-violet-900/20 active:scale-95 transition-all">
            S
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#fafafa] group-hover:text-violet-400 transition-colors">
            Star<span className="text-violet-500">Search</span>
          </h1>
        </button>
      </div>

      <div className="flex gap-2 sm:gap-4 items-center">
        <div className="flex items-center gap-2 sm:gap-4 relative" ref={dropdownRef}>
          <button 
            onClick={() => user ? setIsDropdownOpen(!isDropdownOpen) : onDashboardClick()}
            className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-all text-left group"
            title={user ? `Logged in as ${user.name}` : "Login / Signup"}
          >
             <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 group-hover:border-violet-500 transition-all">
               <UserIcon className="w-4 h-4" />
             </div>
             {user && (
               <div className="hidden sm:flex flex-col">
                 <span className="text-[9px] text-zinc-500 uppercase tracking-widest leading-none mb-1">Active</span>
                 <div className="flex items-center gap-1">
                   <span className="text-xs text-white font-bold leading-none truncate max-w-[100px]">{user.name}</span>
                   <ChevronDown className={isDropdownOpen ? "w-3 h-3 text-violet-500 rotate-180 transition-transform" : "w-3 h-3 text-zinc-500 transition-transform"} />
                 </div>
               </div>
             )}
          </button>

          <AnimatePresence>
            {isDropdownOpen && user && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-56 glass border border-white/10 rounded-2xl p-2 shadow-2xl z-[150]"
              >
                <div className="px-3 py-3 border-b border-white/5 mb-1">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">User Profile</p>
                  <p className="text-sm text-white font-bold truncate">{user.name}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                </div>
                
                <button 
                  onClick={() => { onDashboardClick(); setIsDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3 group"
                >
                  <ShieldCheck className="w-4 h-4 text-violet-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">Agent Terminal</span>
                </button>

                <button 
                  onClick={() => { onHistoryClick(); setIsDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3 group"
                >
                  <History className="w-4 h-4 text-violet-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">Analysis Logs</span>
                </button>

                <button 
                  onClick={() => { onSavedClick(); setIsDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3 group"
                >
                  <Bookmark className="w-4 h-4 text-violet-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold">Secure Vault</span>
                </button>

                <div className="h-px bg-white/5 my-1" />

                <button 
                  onClick={() => { onLogout(); setIsDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-semibold">Terminate Session</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {user && (
            <div className="hidden sm:flex items-center border-l border-zinc-800 pl-4 gap-3">
              <button 
                onClick={onLogout}
                className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
