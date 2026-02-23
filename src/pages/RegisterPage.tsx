import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import AppShell from '../components/layout/AppShell';
import Button from '../components/ui/Button';
import { Mail, Lock, User as UserIcon, School, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types/auth';
import { cn } from '../utils/cn';

const AVATARS = ['🦊','🐺','🦁','🐯','🐸','🐧','🦋','🐙','🦄','🐲'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const auth = useAuthStore();
  
  const [role, setRole] = useState<UserRole>('teacher');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }, [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    try {
      await auth.register({
        email,
        password,
        displayName,
        role,
        schoolName: role === 'teacher' ? schoolName : undefined,
      });
      navigate(role === 'teacher' ? '/dashboard' : '/kat');
    } catch (err: any) {
      setError(err.message);
    }
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
                Aramıza katıl! 🚀
              </h2>
              <p className="text-2xl font-bold opacity-80 mb-12">
                Eğitimi oyunla birleştiren binlerce öğretmenden biri ol.
              </p>
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
            className="w-full max-w-md my-auto"
          >
            <h1 className="text-4xl font-black text-text-dark mb-2">Kayıt Ol</h1>
            <p className="text-text-dark/60 font-bold mb-8">Hemen hesabını oluştur ve başla.</p>

            {error && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-team-2/10 text-team-2 p-4 rounded-2xl font-bold mb-6 border border-team-2/20"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 font-black",
                    role === 'teacher' ? "border-primary bg-primary/5 text-primary" : "border-background text-text-dark/40"
                  )}
                >
                  <span className="text-3xl">🎓</span>
                  Öğretmenim
                </button>
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 font-black",
                    role === 'student' ? "border-primary bg-primary/5 text-primary" : "border-background text-text-dark/40"
                  )}
                >
                  <span className="text-3xl">🎒</span>
                  Öğrenciyim
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-text-dark/60 ml-1">AD SOYAD</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/40" size={20} />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all"
                    placeholder="Adın Soyadın"
                  />
                </div>
              </div>

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

              {role === 'teacher' && (
                <div className="space-y-2">
                  <label className="text-sm font-black text-text-dark/60 ml-1">OKUL ADI</label>
                  <div className="relative">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/40" size={20} />
                    <input
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all"
                      placeholder="Okulunun Adı"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-black text-text-dark/60 ml-1">ŞİFRE</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/40" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all"
                    placeholder="••••••"
                  />
                </div>
                {/* Strength Indicator */}
                <div className="flex gap-1 mt-2 px-1">
                  {[1, 2, 3, 4].map((s) => (
                    <div 
                      key={s} 
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-all",
                        passwordStrength >= s 
                          ? (passwordStrength <= 2 ? "bg-warning" : "bg-success") 
                          : "bg-background"
                      )} 
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-text-dark/60 ml-1">ŞİFRE TEKRAR</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark/40" size={20} />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-background border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none transition-all"
                    placeholder="••••••"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" required className="mt-1 w-5 h-5 rounded-lg border-2 border-background text-primary focus:ring-primary" />
                <span className="text-sm font-bold text-text-dark/60 group-hover:text-text-dark transition-colors">
                  Kullanım koşullarını ve gizlilik politikasını kabul ediyorum.
                </span>
              </label>

              <Button type="submit" size="lg" className="w-full py-5" disabled={auth.isLoading}>
                {auth.isLoading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
              </Button>
            </form>

            <p className="mt-10 text-center font-bold text-text-dark/60">
              Zaten hesabın var mı?{' '}
              <Link to="/giris" className="text-primary hover:underline">Giriş Yap →</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
