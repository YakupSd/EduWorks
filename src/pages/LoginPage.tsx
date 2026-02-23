import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import { Mail, Lock, Eye, EyeOff, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await auth.login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGuestLogin = () => {
    if (!guestName.trim()) return;
    auth.loginAsGuest(guestName);
    navigate('/kat');
  };

  return (
    <AppShell>
      <div className="flex-1 flex h-full">
        {/* Left Panel - Brand */}
        <div className="hidden lg:flex w-[40%] bg-gradient-to-br from-primary to-team-1 p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="text-4xl font-black tracking-tighter flex items-center gap-2">
              EduSavaş ⚡
            </Link>
            <div className="mt-20">
              <h2 className="text-6xl font-black leading-tight mb-8">
                Tekrar hoş geldin! 👋
              </h2>
              <ul className="space-y-6 text-xl font-bold opacity-90">
                <li className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
                  Ücretsiz sınıf odaları
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
                  Anlık rekabet
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
                  Detaylı istatistikler
                </li>
              </ul>
            </div>
          </div>
          
          <div className="relative z-10 opacity-40 font-bold">
            © 2026 EduSavaş
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 lg:p-24 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
          >
            <h1 className="text-4xl font-black text-text-dark mb-2">Giriş Yap</h1>
            <p className="text-text-dark/60 font-bold mb-10">Eğitime devam etmek için bilgilerini gir.</p>

            {error && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-team-2/10 text-team-2 p-4 rounded-2xl font-bold mb-6 border border-team-2/20"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-text-dark/60 ml-1">E-POSTA</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/40" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all"
                    placeholder="ornek@okul.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-text-dark/60 ml-1">ŞİFRE</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/40" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-12 font-bold outline-none transition-all"
                    placeholder="••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dark/40 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded-lg border-2 border-background text-primary focus:ring-primary" />
                  <span className="text-sm font-bold text-text-dark/60 group-hover:text-text-dark transition-colors">Beni Hatırla</span>
                </label>
                <button type="button" className="text-sm font-bold text-primary hover:underline">Şifremi Unuttum</button>
              </div>

              <Button type="submit" size="lg" className="w-full py-5" disabled={auth.isLoading}>
                {auth.isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-background"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-text-dark/40 font-black">VEYA</span>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="lg" 
              className="w-full py-5 border-2 border-background hover:bg-background"
              onClick={() => setIsGuestModalOpen(true)}
            >
              🎮 Misafir Olarak Devam Et
            </Button>

            <p className="mt-10 text-center font-bold text-text-dark/60">
              Hesabın yok mu?{' '}
              <Link to="/kayit" className="text-primary hover:underline">Kayıt Ol →</Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Guest Modal */}
      <AnimatePresence>
        {isGuestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGuestModalOpen(false)}
              className="absolute inset-0 bg-text-dark/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-3xl font-black mb-2">Hızlı Giriş</h2>
              <p className="text-text-dark/60 font-bold mb-8">Oyunlarda görünecek adını belirle.</p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-text-dark/60 ml-1">GÖRÜNEN AD</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/40" size={20} />
                    <input
                      type="text"
                      autoFocus
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all"
                      placeholder="Örn: Süper Öğrenci"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button variant="ghost" className="flex-1" onClick={() => setIsGuestModalOpen(false)}>İptal</Button>
                  <Button className="flex-1" onClick={handleGuestLogin} disabled={!guestName.trim()}>Başla!</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
