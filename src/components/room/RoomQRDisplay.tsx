import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, Copy, Printer, Zap } from 'lucide-react';
import { SubjectKey, Grade } from '../../types';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

interface RoomQRDisplayProps {
  roomCode: string;
  roomName: string;
  subject: SubjectKey;
  grade: Grade;
  size?: 'compact' | 'fullscreen' | 'large';
  onClose?: () => void;
}

export default function RoomQRDisplay({
  roomCode,
  roomName,
  subject,
  grade,
  size = 'compact',
  onClose
}: RoomQRDisplayProps) {
  const [isFullscreen, setIsFullscreen] = useState(size === 'fullscreen');
  const qrValue = `${window.location.origin}/kat/${roomCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
  };

  const handlePrint = () => {
    window.print();
  };

  const getQRSize = () => {
    if (isFullscreen) return 300;
    if (size === 'large') return 250;
    return 160;
  };

  const QRContent = (
    <div className={cn(
      "relative flex items-center justify-center bg-white p-4 rounded-3xl shadow-inner",
      size === 'large' && "p-8"
    )}>
      <QRCode
        value={qrValue}
        size={getQRSize()}
        fgColor="#6C63FF"
        bgColor="#FFFFFF"
        level="H"
      />
      <div className={cn(
        "absolute bg-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white",
        isFullscreen ? "w-16 h-16" : "w-12 h-12"
      )}>
        <span className={isFullscreen ? "text-3xl" : "text-2xl"}>⚡</span>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 qr-print-area">
        <button 
          onClick={() => {
            setIsFullscreen(false);
            onClose?.();
          }}
          className="absolute top-8 right-8 p-4 text-text-dark/40 hover:text-primary transition-colors no-print"
        >
          <X size={32} />
        </button>

        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-black text-text-dark">{roomName}</h2>
          <div className="flex justify-center gap-2">
            <span className="px-4 py-1 bg-primary/10 text-primary rounded-full font-black text-sm uppercase">
              {subject}
            </span>
            <span className="px-4 py-1 bg-background text-text-dark/40 rounded-full font-black text-sm uppercase">
              {grade}. Sınıf
            </span>
          </div>
        </div>

        {QRContent}

        <div className="text-center mt-12 space-y-6">
          <p className="text-6xl font-black text-primary tracking-[0.2em]">
            {roomCode.split('-')[0]} - {roomCode.split('-')[1]}
          </p>
          <p className="text-xl font-bold text-text-dark/60 max-w-md mx-auto no-print">
            Telefonunun kamerasını aç ve QR kodu tara veya kodu gir: <br/>
            <span className="text-primary">edusavas.com/kat</span>
          </p>
        </div>

        <div className="mt-12 flex gap-4 no-print">
          <Button variant="ghost" size="lg" onClick={handlePrint}>
            <Printer size={20} /> Yazdır
          </Button>
          <Button size="lg" onClick={handleCopy}>
            <Copy size={20} /> Kodu Kopyala
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-black/5 flex flex-col items-center gap-6">
      <div className="w-full flex items-center justify-between px-2">
        <span className="flex items-center gap-2 text-xs font-black text-success uppercase tracking-widest">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          Oda Aktif
        </span>
        <button 
          onClick={() => setIsFullscreen(true)}
          className="text-text-dark/40 hover:text-primary transition-colors"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {QRContent}

      <div className="w-full space-y-4">
        <p className={cn(
          "font-black text-primary text-center tracking-widest",
          size === 'large' ? "text-5xl" : "text-2xl"
        )}>
          {roomCode}
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="flex-1 bg-background" onClick={handleCopy}>
            <Copy size={16} /> Kopyala
          </Button>
          {size === 'large' && (
            <Button variant="ghost" size="sm" className="flex-1 bg-background" onClick={handlePrint}>
              <Printer size={16} /> Yazdır
            </Button>
          )}
          <Button variant="ghost" size="sm" className="w-12 bg-background" onClick={() => setIsFullscreen(true)}>
            <Maximize2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
