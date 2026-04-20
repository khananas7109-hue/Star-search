import { History, Upload, Bookmark, LogOut, User as UserIcon, Target } from 'lucide-react';

interface HeaderProps {
  user: { name: string; email: string } | null;
  onHistoryClick: () => void;
  onSavedClick: () => void;
  onUploadClick?: () => void;
  onLogout: () => void;
  onDashboardClick: () => void;
}

export function Header({ user, onHistoryClick, onSavedClick, onUploadClick, onLogout, onDashboardClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-violet-900/20">
            S
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#fafafa]">
            Star<span className="text-violet-500">Search</span>
          </h1>
        </div>
        
        {user && (
          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-zinc-800">
             <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
               <UserIcon className="w-4 h-4" />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none mb-1">Active Agent</span>
               <span className="text-xs text-white font-bold leading-none">{user.name}</span>
             </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {user && (
          <>
            <button 
              onClick={onHistoryClick}
              className="hidden sm:flex text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors items-center gap-2 font-bold"
            >
              <History className="w-3.5 h-3.5" />
              Logs
            </button>
            <button 
              onClick={onSavedClick}
              className="hidden sm:flex text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors items-center gap-2 font-bold"
            >
              <Bookmark className="w-3.5 h-3.5" />
              Vault
            </button>
            <button 
              onClick={onDashboardClick}
              className="hidden sm:flex text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors items-center gap-2 font-bold"
            >
              <Target className="w-3.5 h-3.5" />
              Stats
            </button>
            <button 
              onClick={onLogout}
              className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        )}
        <button 
          onClick={onUploadClick}
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-violet-900/20 transition-all active:scale-95"
        >
          <Upload className="w-3.5 h-3.5" /> 
          Reset
        </button>
      </div>
    </header>
  );
}
