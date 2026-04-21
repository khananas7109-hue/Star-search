import { useState, useCallback, DragEvent, ChangeEvent, FormEvent } from 'react';
import { Upload, X, Search, Globe, ChevronRight, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface UploadSectionProps {
  onSearch: (name: string, uploadedImage?: string | null) => void;
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
      onSearch(name.trim(), preview);
    }
  };

  const openGoogleLens = () => {
    // Simulate a high-tech scanning phase before opening the external link
    // This gives the user the "Scanning" feel they expect
    setIsDragging(true); // Re-use dragging state for a quick pulse effect
    
    setTimeout(() => {
      setIsDragging(false);
      // High-intent visual identification query
      // Using searchbyimage-like intent keywords to force Google to look for visual matches
      const visualQuery = name 
        ? encodeURIComponent(`site:wikipedia.org "${name}" official celebrity portrait visual match`) 
        : encodeURIComponent(`"reverse image search" identify person visual scan`);
      
      // tbm=isch forces Google Images, which is the closest we can get to a "scan result" without a public URL
      window.open(`https://www.google.com/search?q=${visualQuery}&tbm=isch&source=lnms`, '_blank');
    }, 800);
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
              "relative group w-full min-h-[320px] aspect-[4/5] sm:aspect-video lg:aspect-[21/9] rounded-[2.5rem] border-2 border-dashed transition-all duration-700 overflow-hidden glass glow flex flex-col items-center justify-center p-8",
              isDragging 
                ? "border-violet-500 bg-violet-500/20 shadow-[0_0_50px_rgba(139,92,246,0.4)]" 
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
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              animate={isDragging ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              className="p-6 bg-violet-600/20 rounded-3xl ring-1 ring-violet-500/30 group-hover:ring-violet-500/60 transition-all mb-8 shadow-2xl shadow-violet-900/20"
            >
              <Upload className="w-10 h-10 text-violet-400" />
            </motion.div>
            <div className="text-center w-full px-4">
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Initialize Registry Scan</h3>
              <p className="text-[11px] text-zinc-500 uppercase tracking-[0.3em] font-medium max-w-sm mx-auto leading-relaxed">
                Drop Target Photo or Browse System Files
              </p>
            </div>
            
            <div className="absolute bottom-6 flex items-center gap-2 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
              <div className={cn("w-1.5 h-1.5 rounded-full", isDragging ? "bg-red-500 animate-ping" : "bg-violet-500 animate-pulse")} />
              {isDragging ? "Optical Sensors Active" : "Sensor Array: Active"}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-[2.5rem] overflow-hidden min-h-[520px] sm:aspect-video lg:aspect-[21/9] glass glow group w-full border border-white/5 flex flex-col sm:justify-center"
            >
              <img 
                src={preview} 
                alt="Analyzed Target" 
                className="absolute inset-0 w-full h-full object-cover opacity-25 scale-105 group-hover:scale-100 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              
              {/* Scanline Effect */}
              <div className="absolute inset-x-0 h-1 bg-violet-500/30 blur-sm shadow-[0_0_20px_rgba(139,92,246,0.5)] animate-scan z-10 pointer-events-none" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent" />
              
              <div className="relative flex-1 flex flex-col items-center justify-center p-4 sm:p-10 text-center z-10 overflow-y-auto pt-16 pb-12 sm:py-20">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="glass p-6 sm:p-10 rounded-[2rem] border-white/10 w-full max-w-md space-y-6 sm:space-y-8 shadow-2xl backdrop-blur-3xl"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-600/20 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-violet-500/20">
                      <Target className="w-5 h-5 sm:w-6 h-6 text-violet-400" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-[0.2em]">Identify Synchronized Target</h4>
                    <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Verify identity via Wikipedia Registry</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="relative">
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="NAME OF CELEBRITY..."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 text-xs text-white placeholder:text-zinc-600 uppercase tracking-widest focus:border-violet-500/50 focus:bg-white/[0.05] outline-none transition-all shadow-inner"
                        required
                        autoFocus
                        disabled={isLoading}
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isLoading || !name.trim()}
                      className="w-full py-4 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 text-white rounded-2xl text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] shadow-xl shadow-violet-900/40 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                    >
                      {isLoading ? "Synchronizing..." : "Start Analysis"}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  <div className="flex items-center gap-4 py-1">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[8px] text-zinc-600 uppercase tracking-[0.2em] font-bold whitespace-nowrap">Protocol Hybrid Link</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <button 
                    onClick={openGoogleLens}
                    className="w-full py-3 bg-white/[0.02] hover:bg-white/[0.05] text-zinc-400 hover:text-white rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border border-white/10 hover:border-violet-500/30 transition-all flex items-center justify-center gap-3 shadow-md group/btn"
                  >
                    <Globe className="w-4 h-4 text-violet-500 group-hover/btn:animate-spin-slow" />
                    Perform Optical Search (Google)
                  </button>
                </motion.div>
              </div>

              <button 
                onClick={() => { setPreview(null); setName(''); }}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all border border-white/10 z-20 group"
              >
                <X className="w-5 h-5 sm:w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </motion.div>

            <div className="glass p-5 rounded-[1.5rem] border-white/5 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                 <div className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-bold">Hardware Acceleration Active</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[10px] text-green-400 uppercase tracking-[0.2em] font-bold font-mono">
                  No Usage Quota
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
