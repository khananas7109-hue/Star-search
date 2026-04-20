import { History, Upload, Bookmark } from 'lucide-react';

interface HeaderProps {
  onHistoryClick: () => void;
  onSavedClick: () => void;
  onUploadClick?: () => void;
}

export function Header({ onHistoryClick, onSavedClick, onUploadClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-violet-900/20">
          S
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#fafafa]">
          Star<span className="text-violet-500">Search</span>
        </h1>
      </div>
      <div className="flex gap-4 items-center">
        <button 
          onClick={onHistoryClick}
          className="hidden sm:flex text-sm text-zinc-400 hover:text-white transition-colors items-center gap-2"
        >
          <History className="w-4 h-4" />
          History
        </button>
        <button 
          onClick={onSavedClick}
          className="hidden sm:flex text-sm text-zinc-400 hover:text-white transition-colors items-center gap-2"
        >
          <Bookmark className="w-4 h-4" />
          Saved
        </button>
        <button 
          onClick={onUploadClick}
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg shadow-violet-900/20 transition-all active:scale-95 leading-none"
        >
          <Upload className="w-4 h-4" /> 
          Reset
        </button>
      </div>
    </header>
  );
}
