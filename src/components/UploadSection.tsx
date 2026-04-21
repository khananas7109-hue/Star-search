import { useState, useCallback, DragEvent, ChangeEvent, FormEvent } from 'react';
import { Upload, X, Search, Globe, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface UploadSectionProps {
  onSearch: (name: string) => void;
  isLoading: boolean;
}

export function UploadSection({ onSearch, isLoading }: UploadSectionProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [name, setName] = useState('');

  const handleFileChange = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    // Instant feedback: set preview first
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSearch(name.trim());
    }
  };

  const openGoogleSearch = () => {
    // Opening a general search or explaining how to identify
    window.open(`https://www.google.com/search?q=identify+celebrity+from+photo`, '_blank');
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              "relative group w-full aspect-[4/5] sm:aspect-video rounded-3xl border-2 border-dashed transition-all duration-500 overflow-hidden glass glow flex flex-col items-center justify-center p-4 sm:p-8",
              isDragging 
                ? "border-violet-500 bg-violet-500/5 shadow-[0_0_20px_rgba(139,92,246,0.2)]" 
                : "border-white/10 hover:border-violet-500/30"
            )}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              disabled={isLoading}
            />
            <div className="p-5 bg-violet-600/10 rounded-2xl ring-1 ring-violet-500/20 group-hover:ring-violet-500/40 transition-all mb-6">
              <Upload className="w-8 h-8 text-violet-400 group-hover:scale-110 transition-all" />
            </div>
            <div className="text-center mb-6 w-full px-2">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 truncate">Registry Scanner</h3>
              <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest leading-relaxed line-clamp-2">
                Upload Photo to Initialize Identification
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-video glass glow group w-full"
            >
              <img 
                src={preview} 
                alt="Analyzed Target" 
                className="w-full h-full object-cover opacity-60 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                <div className="glass p-8 rounded-3xl border-white/10 w-full max-w-sm space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Manual Registry Entry</h4>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">Identity unknown? Use search tools below.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ENTER CELEBRITY NAME..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 uppercase tracking-widest focus:border-violet-500 outline-none transition-all"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isLoading || !name.trim()}
                      className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-violet-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isLoading ? "Synchronizing..." : "Sync Wikipedia Registry"}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </form>

                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[8px] text-zinc-600 uppercase tracking-widest">OR USE EXTERNAL SCAN</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <button 
                    onClick={openGoogleSearch}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-xl text-[9px] font-bold uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Globe className="w-3 h-3" />
                    Explore on Google Lens
                  </button>
                </div>
              </div>

              <button 
                onClick={() => { setPreview(null); setName(''); }}
                className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-xl text-white hover:bg-black/60 transition-all border border-white/10 z-20"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            <div className="glass p-4 rounded-2xl flex items-center justify-between">
              <div className="text-[10px] text-zinc-400 uppercase tracking-[0.2em]">Open Registry Protocol v4.5</div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="text-[10px] text-green-400 uppercase tracking-[0.2em] font-mono">
                  100% Free Access
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
