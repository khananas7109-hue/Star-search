import { useState, useCallback, useEffect, DragEvent, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface UploadSectionProps {
  onUpload: (file: string, mimeType: string) => void;
  isLoading: boolean;
}

export function UploadSection({ onUpload, isLoading }: UploadSectionProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          // Faster initial jump, then slows down
          const increment = prev < 50 ? 5 : prev < 80 ? 2 : 0.5;
          return prev + increment;
        });
      }, 100);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileChange = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    // Instant feedback: set preview first
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Fast resize helper
    const resizeImage = (file: File): Promise<{ base64: string, mime: string }> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1024; // Balanced for speed and detail
            const MAX_HEIGHT = 1024;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const base64 = canvas.toDataURL('image/jpeg', 0.8); // High enough quality for AI
            resolve({ base64, mime: 'image/jpeg' });
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    };

    const { base64, mime } = await resizeImage(file);
    const base64Data = base64.split(',')[1];
    onUpload(base64Data, mime);
  }, [onUpload]);

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
              "relative group w-full aspect-[4/5] rounded-3xl border-2 border-dashed transition-all duration-500 overflow-hidden glass glow flex flex-col items-center justify-center p-4 sm:p-8",
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
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 truncate">Initialize Scanner</h3>
              <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest leading-relaxed line-clamp-2">
                Upload Target Metadata
              </p>
            </div>
            <div className="flex gap-2">
              <span className="stat-badge">Ready</span>
              <span className="stat-badge">v4.2</span>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl overflow-hidden aspect-[4/5] glass glow group w-full"
            >
              <img 
                src={preview} 
                alt="Analyzed Target" 
                className={cn(
                  "w-full h-full object-cover transition-all duration-700",
                  isLoading ? "opacity-50 grayscale" : "opacity-80"
                )}
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
              
              {/* Scanline Effect */}
              <div className="scanline pointer-events-none" />

              {/* Progress UI */}
              {isLoading && (
                <div className="absolute inset-x-8 bottom-20 z-20 space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-violet-400 font-mono tracking-widest uppercase">Target Analysis</span>
                    <span className="text-xl font-bold text-white font-mono">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      className="h-full bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ type: 'spring', damping: 15, stiffness: 40 }}
                    />
                  </div>
                  <p className="text-[8px] text-zinc-500 uppercase tracking-[0.3em] animate-pulse">Synchronizing with Satellite Registry...</p>
                </div>
              )}

              <div className="absolute bottom-4 left-4 flex gap-2 items-center bg-black/40 backdrop-blur-md p-2 px-3 rounded-xl border border-white/10 z-20">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isLoading ? "bg-amber-500 animate-pulse" : "bg-green-500"
                )} />
                <span className={cn(
                  "text-[10px] font-mono uppercase tracking-[0.2em]",
                  isLoading ? "text-amber-400" : "text-green-400"
                )}>
                  {isLoading ? "Analyzing..." : "Target Identified"}
                </span>
              </div>
              
              {!isLoading && (
                <button 
                  onClick={() => setPreview(null)}
                  className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-xl text-white hover:bg-black/60 transition-all border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </motion.div>

            <div className="glass p-4 rounded-2xl flex items-center justify-between">
              <div className="text-[10px] text-zinc-400 uppercase tracking-[0.2em]">AI Engine v4.2</div>
              <div className="text-[10px] text-violet-400 uppercase tracking-[0.2em] font-mono">
                {isLoading ? (
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    Lat: <span className="text-zinc-400">OPTIMIZING...</span>
                  </motion.span>
                ) : (
                  "Processed in 42ms"
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
