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
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={onDashboardClick}
            className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-all text-left"
          >
             <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
               <UserIcon className="w-4 h-4" />
             </div>
             {user && (
               <div className="hidden sm:flex flex-col">
                 <span className="text-[9px] text-zinc-500 uppercase tracking-widest leading-none mb-1">Active</span>
                 <span className="text-xs text-white font-bold leading-none truncate max-w-[80px]">{user.name}</span>
               </div>
             )}
          </button>
          
          {user && (
            <div className="flex items-center border-l border-zinc-800 pl-2 sm:pl-4 gap-1 sm:gap-3">
              <button 
                onClick={onHistoryClick}
                className="p-2 text-zinc-500 hover:text-white transition-colors flex items-center"
                title="History"
              >
                <History className="w-4 h-4" />
              </button>
              <button 
                onClick={onSavedClick}
                className="p-2 text-zinc-500 hover:text-white transition-colors flex items-center"
                title="Bookmarks"
              >
                <Bookmark className="w-4 h-4" />
              </button>
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
