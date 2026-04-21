import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { Auth } from './components/Auth';
import { SplashScreen } from './components/SplashScreen';
import { identifyCelebrity, type StarProfile } from './lib/gemini';
import { Sparkles, Clock, Bookmark, X, Target, Zap, Shield, Database, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Lazy load heavy components
const ProfileCard = lazy(() => import('./components/ProfileCard').then(m => ({ default: m.ProfileCard })));

export default function App() {
  const [isMounted, setIsMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<StarProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [history, setHistory] = useState<StarProfile[]>([]);
  const [bookmarks, setBookmarks] = useState<StarProfile[]>([]);
  const [searchCount, setSearchCount] = useState(0);
  
  const [showHistory, setShowHistory] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Load user from local storage
  useEffect(() => {
    setIsMounted(true);
    
    // Simulate initial system check
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    const currentUser = localStorage.getItem('ss_current_user');
    if (currentUser) {
      try {
        const parsedUser = JSON.parse(currentUser);
        if (parsedUser && parsedUser.email) {
          setUser(parsedUser);
          loadUserData(parsedUser.email);
        }
      } catch (e) {
        console.error("Session restoration failed:", e);
        localStorage.removeItem('ss_current_user');
      }
    }

    return () => clearTimeout(timer);
  }, []);

  const loadUserData = (email: string) => {
    const savedHistory = localStorage.getItem(`ss_history_${email}`);
    const savedBookmarks = localStorage.getItem(`ss_bookmarks_${email}`);
    const savedCount = localStorage.getItem(`ss_count_${email}`);
    
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    else setHistory([]);
    
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    else setBookmarks([]);
    
    if (savedCount) setSearchCount(parseInt(savedCount));
    else setSearchCount(0);
  };

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    setShowAuth(false);
    loadUserData(userData.email);
  };

  const handleLogout = () => {
    localStorage.removeItem('ss_current_user');
    setUser(null);
    setHistory([]);
    setBookmarks([]);
    setSearchCount(0);
    setProfile(null);
  };

  const incrementSearchCount = (email: string) => {
    const newCount = searchCount + 1;
    setSearchCount(newCount);
    localStorage.setItem(`ss_count_${email}`, newCount.toString());
  };

  const saveHistory = (newProfile: StarProfile) => {
    if (!user) return;
    const updatedHistory = [newProfile, ...history.filter(h => h.name !== newProfile.name)].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem(`ss_history_${user.email}`, JSON.stringify(updatedHistory));
    incrementSearchCount(user.email);
  };

  const toggleBookmark = (star: StarProfile) => {
    if (!user) return;
    const isBookmarked = bookmarks.some(b => b.name === star.name);
    let updatedBookmarks;
    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter(b => b.name !== star.name);
    } else {
      updatedBookmarks = [star, ...bookmarks];
    }
    setBookmarks(updatedBookmarks);
    localStorage.setItem(`ss_bookmarks_${user.email}`, JSON.stringify(updatedBookmarks));
  };

  if (!isMounted) return null;

  if (showSplash) {
    return <SplashScreen />;
  }

  // Allow browsing without forced auth, but identification requires user

  const handleUpload = async (base64: string, mimeType: string) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setIsLoading(true);
    setProfile(null);
    setError(null);
    
    try {
      const result = await identifyCelebrity(base64, mimeType);
      if (result) {
        setProfile(result);
        saveHistory(result);
      } else {
        setError("Identification failed. Please ensure the person is a public figure and the photo is clear.");
      }
    } catch (err: any) {
      if (err.message) {
        setError(err.message);
      } else {
        setError("System override: data processing error.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-[1400px] mx-auto relative pt-20 sm:pt-24 px-4 md:px-8">
      <Header 
        user={user}
        onHistoryClick={() => user ? setShowHistory(true) : setShowAuth(true)} 
        onSavedClick={() => user ? setShowBookmarks(true) : setShowAuth(true)} 
        onUploadClick={() => { setProfile(null); setShowDashboard(false); setShowAuth(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onLogout={handleLogout}
        onDashboardClick={() => user ? setShowDashboard(true) : setShowAuth(true)}
      />
      
      <main className="flex-1 flex flex-col gap-8 pb-12 w-full max-w-5xl mx-auto">
        {/* Top Section: Upload / Auth */}
        <div className="w-full">
          {showAuth ? (
            <div className="w-full py-8">
              <Auth onLogin={handleLogin} />
            </div>
          ) : (
            <div className="w-full max-w-xl mx-auto">
              <UploadSection onUpload={handleUpload} isLoading={isLoading} />
              
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass p-4 rounded-2xl border-red-500/20 bg-red-500/5 flex flex-col gap-3 mt-6"
                  >
                    <p className="text-xs text-red-100 font-medium text-center leading-relaxed">
                      {error}
                    </p>
                    <button 
                      onClick={() => setError(null)}
                      className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] uppercase font-bold tracking-widest text-zinc-400 transition-all active:scale-95"
                    >
                      <RefreshCcw className="w-3 h-3" />
                      Try Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Bottom Section: Results / Dashboard */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {showDashboard ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full glass p-8 md:p-12 rounded-[2.5rem] flex flex-col gap-12"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                  <div className="space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-4">
                      Agent Terminal <Target className="w-8 h-8 text-violet-500" />
                    </h2>
                    <p className="text-zinc-500 text-sm uppercase tracking-[0.2em] font-mono">Registry Metadata Controller</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Authenticated Profile</span>
                    <p className="text-lg text-violet-400 font-bold break-all">{user?.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-violet-500/30 transition-all">
                    <Database className="w-6 h-6 text-violet-500 mb-6 group-hover:scale-110 transition-transform" />
                    <span className="text-3xl font-bold text-white block mb-1">{searchCount}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Scans</span>
                  </div>
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-violet-500/30 transition-all">
                    <Clock className="w-6 h-6 text-violet-500 mb-6 group-hover:scale-110 transition-transform" />
                    <span className="text-3xl font-bold text-white block mb-1">{history.length}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Recent Logs</span>
                  </div>
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-violet-500/30 transition-all">
                    <Bookmark className="w-6 h-6 text-violet-500 mb-6 group-hover:scale-110 transition-transform" />
                    <span className="text-3xl font-bold text-white block mb-1">{bookmarks.length}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Secure Vault</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                       <Shield className="w-4 h-4 text-violet-400" /> System Integrity
                    </h3>
                    <div className="space-y-4">
                       <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 flex justify-between items-center text-xs">
                          <span className="text-zinc-400 uppercase tracking-widest">Protocol Version</span>
                          <span className="text-violet-400 font-bold">v4.2.0-STABLE</span>
                       </div>
                       <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 flex justify-between items-center text-xs">
                          <span className="text-zinc-400 uppercase tracking-widest">Data Encryption</span>
                          <span className="text-green-500 font-bold">AEGIS-256 ACTIVE</span>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                       <Zap className="w-4 h-4 text-amber-500" /> Recent Identification
                    </h3>
                    {history.length > 0 ? (
                      <div className="glass p-6 rounded-3xl border-white/5 flex items-center justify-between gap-4">
                         <div className="min-w-0">
                            <h4 className="text-white font-bold truncate">{history[0].name}</h4>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest truncate">{history[0].profession}</p>
                         </div>
                         <button 
                          onClick={() => { setProfile(history[0]); setShowDashboard(false); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                          className="p-3 bg-violet-600 rounded-xl text-white shadow-lg shadow-violet-900/20 active:scale-95 transition-all text-[10px] font-bold uppercase shrink-0"
                         >
                           View
                         </button>
                      </div>
                    ) : (
                      <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl">
                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest">No target data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : profile ? (
              <Suspense fallback={
                <div className="w-full glass p-12 rounded-[2rem] animate-pulse flex flex-col gap-8 min-h-[600px]">
                  <div className="h-12 w-1/2 bg-white/5 rounded-2xl" />
                  <div className="h-6 w-1/4 bg-white/5 rounded-2xl" />
                  <div className="grid grid-cols-2 gap-8 mt-12">
                    <div className="h-40 bg-white/5 rounded-3xl" />
                    <div className="h-40 bg-white/5 rounded-3xl" />
                  </div>
                  <div className="h-64 bg-white/5 rounded-3xl" />
                </div>
              }>
                <ProfileCard 
                  profile={profile} 
                  isBookmarked={bookmarks.some(b => b.name === profile.name)}
                  onToggleBookmark={toggleBookmark}
                />
              </Suspense>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-[2rem] min-h-[400px] flex flex-col items-center justify-center p-8 sm:p-12 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-violet-600/5 blur-[100px] -z-10" />
                <div className="w-16 h-16 bg-violet-600/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-violet-500/10">
                  <Sparkles className="w-6 h-6 text-violet-500/40" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white/80 mb-2 font-sans italic">Registry Awaiting Data</h2>
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
            className="fixed inset-y-0 right-0 w-full sm:w-80 glass z-[160] p-8 border-l border-white/10 flex flex-col"
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
                  onClick={() => { setProfile(h); setShowHistory(false); setShowDashboard(false); }}
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
            className="fixed inset-y-0 right-0 w-full sm:w-80 glass z-[160] p-8 border-l border-white/10 flex flex-col"
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
                  onClick={() => { setProfile(b); setShowBookmarks(false); setShowDashboard(false); }}
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

      {/* Removed footer for clean minimal look */}
    </div>
  );
}
