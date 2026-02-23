import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import { ArrowLeft, Volume2, Moon, Sun, Info } from 'lucide-react';
import Button from '../components/ui/Button';

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="flex-1 flex flex-col p-8 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft /> Geri
          </Button>
          <h1 className="text-4xl font-black text-text-dark">Ayarlar</h1>
          <div className="w-24" />
        </div>

        <div className="bg-white rounded-[40px] p-10 shadow-xl flex flex-col gap-8">
          {/* Sound Setting */}
          <div className="flex items-center justify-between p-6 bg-background rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Volume2 />
              </div>
              <div>
                <h3 className="text-xl font-black">Ses Efektleri</h3>
                <p className="text-sm text-text-dark/60">Oyun içi sesleri aç/kapat</p>
              </div>
            </div>
            <Button variant="primary" size="sm">AÇIK</Button>
          </div>

          {/* Theme Setting */}
          <div className="flex items-center justify-between p-6 bg-background rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-2xl flex items-center justify-center text-warning">
                <Sun />
              </div>
              <div>
                <h3 className="text-xl font-black">Görünüm</h3>
                <p className="text-sm text-text-dark/60">Aydınlık veya Karanlık mod</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm">AYDINLIK</Button>
              <Button variant="ghost" size="sm">KARANLIK</Button>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-4 p-6 border-2 border-dashed border-primary/20 rounded-3xl flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary font-black">
              <Info size={20} />
              EduSavaş Hakkında
            </div>
            <p className="text-text-dark/70 leading-relaxed">
              EduSavaş, ilkokul öğrencilerinin ders konularını eğlenceli bir şekilde tekrar etmeleri için tasarlanmış bir platformdur. 
              Sınıf içi akıllı tahta kullanımına uygundur.
            </p>
            <div className="flex justify-between items-center pt-4 border-t border-primary/10 text-xs font-bold opacity-40">
              <span>Versiyon 1.0.0</span>
              <span>© 2026 EduSavaş Ekibi</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
