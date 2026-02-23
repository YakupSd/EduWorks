import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  DoorOpen, 
  PlusCircle, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { cn } from '../utils/cn';
import Button from '../components/ui/Button';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { path: '/dashboard', icon: <Home size={20} />, label: 'Ana Panel' },
    { path: '/dashboard/odalar', icon: <DoorOpen size={20} />, label: 'Odalarım' },
    { path: '/dashboard/yeni-oda', icon: <PlusCircle size={20} />, label: 'Yeni Oda Oluştur' },
    { path: '/dashboard/istatistikler', icon: <BarChart3 size={20} />, label: 'İstatistikler' },
    { path: '/dashboard/ayarlar', icon: <Settings size={20} />, label: 'Ayarlar' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-black/5 flex flex-col z-30 relative"
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <Link to="/" className="text-2xl font-black tracking-tighter text-primary flex items-center gap-2 overflow-hidden whitespace-nowrap">
            EduSavaş ⚡
          </Link>
        </div>

        {/* User Info */}
        <div className={cn(
          "px-6 py-8 border-b border-black/5 flex items-center gap-4 transition-all",
          !isSidebarOpen && "justify-center px-0"
        )}>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl shrink-0">
            {user?.avatar || '🎓'}
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden">
              <p className="font-black text-text-dark truncate">{user?.displayName}</p>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Öğretmen</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl font-bold transition-all group",
                location.pathname === item.path 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-text-dark/60 hover:bg-background hover:text-text-dark",
                !isSidebarOpen && "justify-center p-4"
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-black/5">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-team-2 hover:bg-team-2/5 transition-all",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Çıkış Yap</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-black/5 rounded-full flex items-center justify-center shadow-md z-40 hover:text-primary transition-colors"
        >
          {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-black/5 px-8 flex items-center justify-between shrink-0 z-20">
          <h1 className="text-2xl font-black text-text-dark">{title}</h1>
          
          <div className="flex items-center gap-6">
            <Button 
              size="sm" 
              className="hidden md:flex"
              onClick={() => navigate('/dashboard/yeni-oda')}
            >
              <PlusCircle size={18} /> Yeni Oda Oluştur
            </Button>
            
            <button className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-text-dark/40 hover:text-primary transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-team-2 rounded-full border-2 border-white" />
            </button>

            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-xl">
                {user?.avatar || '🎓'}
              </div>
              <ChevronDown size={16} className="text-text-dark/40 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
}
