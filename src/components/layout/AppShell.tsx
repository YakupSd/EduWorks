import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-background to-white flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-20 w-64 h-64 bg-team-1/5 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-team-2/5 rounded-full blur-3xl animate-float-slow" />
        
        {/* Floating Shapes */}
        <div className="absolute top-10 right-[10%] text-4xl opacity-10 animate-float">⭐</div>
        <div className="absolute bottom-20 left-[15%] text-5xl opacity-10 animate-float-delayed">🚀</div>
        <div className="absolute top-1/3 right-[20%] text-3xl opacity-10 animate-float-slow">🎨</div>
        <div className="absolute bottom-1/3 left-[5%] text-4xl opacity-10 animate-float">📚</div>
      </div>

      {/* Content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 flex-1 flex flex-col"
      >
        {children}
      </motion.main>
    </div>
  );
}
