import { Instagram, Twitter, Globe, Zap, Newspaper, User, Share2, Bookmark, BookmarkCheck, Heart, Calendar, DollarSign, Film, Music, Lightbulb, Facebook, Link, Check, Send } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import type { StarProfile } from '../lib/gemini';

interface ProfileCardProps {
  profile: StarProfile;
  isBookmarked: boolean;
  onToggleBookmark: (profile: StarProfile) => void;
}

export function ProfileCard({ profile, isBookmarked, onToggleBookmark }: ProfileCardProps) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const shareUrl = window.location.href;
  const shareText = `Check out ${profile.name}'s profile on StarSearch!`;

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full glass p-8 md:p-12 rounded-[2rem] relative overflow-hidden flex flex-col gap-8 shadow-2xl"
    >
      <motion.div 
        style={{ y: y1, opacity }}
        className="absolute -top-24 -right-24 w-64 h-64 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" 
      />
      
      <motion.div 
        style={{ y: y2 }}
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-900/10 rounded-full blur-[100px] pointer-events-none" 
      />
      
      <div className="relative">
        {/* Header Actions */}
        <div className="flex flex-wrap justify-end gap-2 mb-6">
          <button 
            onClick={copyLink}
            title="Copy Link"
            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#fafafa] hover:bg-zinc-700 transition-all active:scale-95 shadow-lg"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Link className="w-3.5 h-3.5 text-zinc-400" />}
            {copied ? 'Copied' : 'Link'}
          </button>
          
          <button 
            onClick={shareOnWhatsApp}
            title="Share on WhatsApp"
            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#fafafa] hover:bg-green-600 transition-all active:scale-95 shadow-lg"
          >
            <Send className="w-3.5 h-3.5" />
            WA
          </button>

          <button 
            onClick={shareOnTwitter}
            title="Share on Twitter"
            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#fafafa] hover:bg-sky-500 transition-all active:scale-95 shadow-lg"
          >
            <Twitter className="w-3.5 h-3.5" />
            TW
          </button>

          <button 
            onClick={shareOnFacebook}
            title="Share on Facebook"
            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#fafafa] hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
          >
            <Facebook className="w-3.5 h-3.5" />
            FB
          </button>

          <button 
            onClick={() => onToggleBookmark(profile)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-black/20 ${
              isBookmarked 
                ? 'bg-violet-600 border-violet-500 text-white' 
                : 'bg-white/5 border-white/10 text-[#fafafa] hover:border-violet-500/50'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Identity Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10">
          <div className="space-y-1">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#fafafa] leading-none mb-2">{profile.name}</h2>
            <p className="text-violet-400 font-medium text-xl uppercase tracking-wider">{profile.profession}</p>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-xl border border-zinc-800">
                <Calendar className="w-4 h-4 text-violet-500" />
                <span className="text-xs text-zinc-300 font-medium">{profile.birthDate} ({profile.age} yrs)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-xl border border-zinc-800">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-xs text-zinc-300 font-medium">{profile.netWorth}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {profile.socialMedia.instagram && (
              <a href={profile.socialMedia.instagram} target="_blank" className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-300 hover:bg-violet-600 hover:border-violet-500 hover:text-white transition-all shadow-xl">
                IG
              </a>
            )}
            {profile.socialMedia.twitter && (
              <a href={profile.socialMedia.twitter} target="_blank" className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-300 hover:bg-violet-600 hover:border-violet-500 hover:text-white transition-all shadow-xl">
                TW
              </a>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-12">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <User className="w-3 h-3" /> Target Bio
          </h3>
          <p className="text-zinc-300 leading-relaxed text-lg max-w-3xl font-light italic">
            "{profile.bio}"
          </p>
        </div>

        {/* Core Intel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Highlights & Notable Works */}
          <div className="space-y-12 lg:col-span-2">
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Career Highlights
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.careerHighlights.map((highlight, i) => (
                  <li key={i} className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="w-1.5 h-1.5 bg-violet-500 rounded-full shrink-0" />
                    <span className="text-sm text-zinc-300">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Film className="w-4 h-4 text-violet-500" /> Notable Media / Works
              </h3>
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4">
                  {profile.notableWorks.map((work, i) => (
                    <div key={i} className="shrink-0 min-w-[200px] p-5 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:bg-violet-500/10 hover:border-violet-500/30 transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter shadow-inner">{work.year}</span>
                        {work.type === 'movie' ? <Film className="w-4 h-4 text-zinc-600 group-hover:text-violet-400" /> : <Music className="w-4 h-4 text-zinc-600 group-hover:text-violet-400" />}
                      </div>
                      <h4 className="text-white font-bold leading-tight group-hover:text-violet-100 transition-colors">{work.title}</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{work.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="space-y-8">
            <div className="glass p-8 rounded-[3rem] border-violet-500/20 bg-violet-600/[0.02]">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Fun Facts
              </h3>
              <div className="space-y-6">
                {profile.funFacts.map((fact, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-violet-500/20">
                    <p className="text-xs text-zinc-400 leading-relaxed font-mono italic">
                      "{fact}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Target Analysis */}
        <div className="mb-12">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6 px-4">Similar Profiles Detected</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile.similarCelebrities.map((similar, i) => (
              <div key={i} className="glass p-6 rounded-[2rem] border-white/5 hover:border-violet-500/30 transition-all hover:-translate-y-1">
                <h4 className="text-white font-bold mb-2">{similar.name}</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed">{similar.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* News Intel */}
        <div className="border-t border-zinc-800 pt-8 relative">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-8 px-4">Recent Media Intel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile.recentNews.map((news, i) => (
              <div key={i} className="group cursor-pointer p-6 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-violet-500/5 hover:border-violet-500/20 transition-all">
                <span className="text-[10px] text-violet-400 font-mono tracking-wider font-bold">INTEL_ENTRY_{i + 1}</span>
                <p className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors mt-3 leading-relaxed">
                  {news}
                </p>
                <div className="mt-4 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-bold">Verified Feed</span>
                </div>
              </div>
            ))}
          </div>

          {profile.source && (
            <div className="mt-12 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
              <span>Data Integrity: High</span>
              <span className="flex items-center gap-2">
                Source: <span className="text-violet-500">{profile.source}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
