import { motion } from 'motion/react';
import { Target } from 'lucide-react';

export function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.1)_0%,transparent_100%)]" />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="absolute -inset-8 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <Target className="w-16 h-16 text-violet-500 relative" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center relative"
      >
        <h1 className="text-4xl font-bold text-[#fafafa] tracking-tight mb-2">STAR SEARCH</h1>
        <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.3em]">AI Celeb Intel Subsystem</p>
      </motion.div>

      <motion.div 
        className="mt-12 w-48 h-1 bg-zinc-900 rounded-full overflow-hidden relative"
      >
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 bg-violet-600"
        />
      </motion.div>
    </motion.div>
  );
}
