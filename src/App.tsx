import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { ProfileCard } from './components/ProfileCard';
import { identifyCelebrity, type StarProfile } from './lib/gemini';
import { Sparkles, Clock, Bookmark, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<StarProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<StarProfile[]>([]);
  const [bookmarks, setBookmarks] = useState<StarProfile[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem('starsearch_history');
    const savedBookmarks = localStorage.getItem('starsearch_bookmarks');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
  }, []);

  const saveHistory = (newProfile: StarProfile) => {
    const updatedHistory = [newProfile, ...history.filter(h => h.name !== newProfile.name)].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('starsearch_history', JSON.stringify(updatedHistory));
  };

  const toggleBookmark = (star: StarProfile) => {
    const isBookmarked = bookmarks.some(b => b.name === star.name);
    let updatedBookmarks;
    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter(b => b.name !== star.name);
    } else {
      updatedBookmarks = [star, ...bookmarks];
    }
    setBookmarks(updatedBookmarks);
    localStorage.setItem('starsearch_bookmarks', JSON.stringify(updatedBookmarks));
  };

  const handleUpload = async (base64: string, mimeType: string) => {
    setIsLoading(true);
    setProfile(null);
    setError(null);
    
    try {
      const result = await identifyCelebrity(base64, mimeType);
      if (result) {
        setProfile(result);
        saveHistory(result);
      } else {
        setError("Identification failed: target not found in public registry.");
      }
    } catch (err) {
      setError("System override: data processing error.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen p-8 max-w-[1400px] mx-auto overflow-hidden relative">
      <Header 
        onHistoryClick={() => setShowHistory(true)} 
        onSavedClick={() => setShowBookmarks(true)} 
        onUploadClick={() => setProfile(null)}
      />
      
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 items-start overflow-y-auto pr-2 custom-scrollbar pb-12">
        {/* Interaction Pane */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6 sticky top-0">
          <UploadSection onUpload={handleUpload} isLoading={isLoading} />
          
          {/* History/Bookmarks Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                showHistory ? 'glass border-violet-500 text-violet-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">History</span>
            </button>
            <button 
              onClick={() => setShowBookmarks(!showBookmarks)}
              className={`flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                showBookmarks ? 'glass border-violet-500 text-violet-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Saved</span>
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass p-4 rounded-2xl border-red-500/20 bg-red-500/5"
              >
                <p className="text-xs text-red-400 font-mono uppercase tracking-widest text-center">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Pane */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {profile ? (
              <ProfileCard 
                profile={profile} 
                isBookmarked={bookmarks.some(b => b.name === profile.name)}
                onToggleBookmark={toggleBookmark}
              />
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-[2rem] min-h-[500px] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-violet-600/5 blur-[100px] -z-10" />
                <div className="w-16 h-16 bg-violet-600/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-violet-500/10">
                  <Sparkles className="w-6 h-6 text-violet-500/40" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white/80 mb-2 font-sans italic">Registry Awaiting Data</h2>
                <p className="text-zinc-500 text-sm max-w-sm font-light leading-relaxed">
                  Awaiting visual target metadata. Upload a photo or select an entry from history to initialize identification.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Slide-over Sidebars */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 w-full sm:w-80 glass z-[60] p-8 border-l border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-violet-500" /> Scanner History
              </h2>
              <button onClick={() => setShowHistory(false)} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {history.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-zinc-600 text-xs uppercase tracking-widest leading-loose">Internal Logs Empty</p>
                </div>
              )}
              {history.map((h, i) => (
                <div 
                  key={i} 
                  onClick={() => { setProfile(h); setShowHistory(false); }}
                  className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-violet-500/30 hover:bg-violet-600/5 transition-all cursor-pointer group"
                >
                  <h4 className="text-sm font-bold text-white group-hover:text-violet-300">{h.name}</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">{h.profession}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {showBookmarks && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 w-full sm:w-80 glass z-[60] p-8 border-l border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-violet-500" /> Saved Records
              </h2>
              <button onClick={() => setShowBookmarks(false)} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {bookmarks.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-zinc-600 text-xs uppercase tracking-widest leading-loose">No Records Stored</p>
                </div>
              )}
              {bookmarks.map((b, i) => (
                <div 
                  key={i} 
                  onClick={() => { setProfile(b); setShowBookmarks(false); }}
                  className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-violet-500/30 hover:bg-violet-600/5 transition-all cursor-pointer group"
                >
                  <h4 className="text-sm font-bold text-white group-hover:text-violet-300">{b.name}</h4>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">{b.profession}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-auto flex justify-between border-t border-zinc-800 pt-4 text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium">
        <div>&copy; 2026 StarSearch Artificial Vision</div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            System Status: Operational
          </span>
          <span>v4.2.0-stable</span>
        </div>
      </footer>
    </div>
  );
}
