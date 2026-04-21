import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Target, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthProps {
  onLogin: (userData: { name: string; email: string }) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const storedUsers = JSON.parse(localStorage.getItem('ss_users') || '[]');
      const user = storedUsers.find((u: any) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('ss_current_user', JSON.stringify({ name: user.name, email: user.email }));
        onLogin({ name: user.name, email: user.email });
      } else {
        setError('Invalid credentials.');
      }
    } else {
      if (!name || !email || !password) {
        setError('All fields are required.');
        return;
      }
      const storedUsers = JSON.parse(localStorage.getItem('ss_users') || '[]');
      if (storedUsers.some((u: any) => u.email === email)) {
        setError('Email already exists.');
        return;
      }
      const newUser = { name, email, password };
      storedUsers.push(newUser);
      localStorage.setItem('ss_users', JSON.stringify(storedUsers));
      localStorage.setItem('ss_current_user', JSON.stringify({ name: newUser.name, email: newUser.email }));
      onLogin({ name: newUser.name, email: newUser.email });
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 min-h-[60vh] relative">
      <div className="absolute inset-0 bg-violet-600/5 blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl mx-auto flex items-center justify-center font-bold text-3xl text-white mb-6 shadow-2xl shadow-violet-900/40">
            S
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Star<span className="text-violet-500">Search</span>
          </h1>
          <p className="text-zinc-500 text-xs tracking-wider">
            Discover and Identify Celebrities
          </p>
        </div>

        <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs text-zinc-400 font-medium ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input 
                      type="text" 
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-violet-500/50 outline-none transition-all placeholder:text-zinc-600"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-medium ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-violet-500/50 outline-none transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-400 font-medium ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-violet-500/50 outline-none transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1">
              <input 
                type="checkbox" 
                id="remember"
                className="accent-violet-500 rounded bg-white/5 border-white/10 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-400 transition-colors">Remember me</label>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-500 text-center font-medium bg-red-500/10 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-[0.98] shadow-lg shadow-violet-900/20 uppercase"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-zinc-500 font-medium hover:text-violet-400 transition-colors"
            >
              {isLogin ? (
                <>New here? <span className="text-violet-500">Create new account / Sign Up</span></>
              ) : (
                <>Already have an account? <span className="text-violet-500">Login</span></>
              )}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-zinc-700 uppercase tracking-[0.2em]">
          Secure Local Encryption • Private Cloud Vault
        </p>
      </motion.div>
    </div>
  );
}
