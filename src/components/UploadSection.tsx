import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
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

  const handleFileChange = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
      const base64Data = base64.split(',')[1];
      onUpload(base64Data, file.type);
    };
    reader.readAsDataURL(file);
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
              "relative group aspect-[4/5] rounded-3xl border-2 border-dashed transition-all duration-500 overflow-hidden glass glow flex flex-col items-center justify-center p-8",
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
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Initialize Scanner</h3>
              <p className="text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">
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
              className="relative rounded-3xl overflow-hidden aspect-[4/5] glass glow group"
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

              <div className="absolute bottom-4 left-4 flex gap-2 items-center bg-black/40 backdrop-blur-md p-2 px-3 rounded-xl border border-white/10">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isLoading ? "bg-amber-500 animate-pulse" : "bg-green-500"
                )} />
                <span className={cn(
                  "text-[10px] font-mono uppercase tracking-[0.2em]",
                  isLoading ? "text-amber-400" : "text-green-400"
                )}>
                  {isLoading ? "Searching Database..." : "Identification Complete 98.4%"}
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
              <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">Processed in {isLoading ? "..." : "120ms"}</div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
