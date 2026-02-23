import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useRoomStore } from '../../store/roomStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Trophy, 
  Gamepad2, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  Filter
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { subjectColors } from '../../styles/theme';
import Button from '../../components/ui/Button';

export default function StatsPage() {
  const { roomHistory } = useRoomStore();

  const stats = useMemo(() => {
    const total = roomHistory.length;
    const team1Wins = roomHistory.filter(h => h.winner === 1).length;
    const team2Wins = roomHistory.filter(h => h.winner === 2).length;
    const draws = roomHistory.filter(h => h.winner === 'draw').length;
    
    const totalDuration = roomHistory.reduce((acc, h) => acc + h.duration, 0);
    const avgDuration = total > 0 ? Math.round(totalDuration / total / 60) : 0;

    return {
      total,
      team1Wins,
      team2Wins,
      draws,
      avgDuration,
      winRate: total > 0 ? Math.round((team1Wins / total) * 100) : 0
    };
  }, [roomHistory]);

  const subjectData = useMemo(() => {
    const subjects = ['matematik', 'turkce', 'fen', 'sosyal', 'ingilizce', 'din'];
    return subjects.map(s => ({
      name: s.charAt(0).toUpperCase() + s.slice(1),
      count: roomHistory.filter(h => h.subject === s).length,
      color: subjectColors[s as keyof typeof subjectColors] || '#6C63FF'
    })).filter(d => d.count > 0);
  }, [roomHistory]);

  const winRateData = [
    { name: 'Takım 1', value: stats.team1Wins, color: '#3B82F6' },
    { name: 'Takım 2', value: stats.team2Wins, color: '#EF4444' },
    { name: 'Beraberlik', value: stats.draws, color: '#94A3B8' },
  ].filter(d => d.value > 0);

  return (
    <DashboardLayout title="İstatistikler">
      <div className="space-y-10">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
              <Gamepad2 size={24} />
            </div>
            <p className="text-sm font-bold text-text-dark/40 uppercase tracking-wider">Toplam Oyun</p>
            <p className="text-3xl font-black text-text-dark">{stats.total}</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
            <div className="w-12 h-12 bg-success/10 text-success rounded-2xl flex items-center justify-center mb-4">
              <Trophy size={24} />
            </div>
            <p className="text-sm font-bold text-text-dark/40 uppercase tracking-wider">Kazanma Oranı</p>
            <p className="text-3xl font-black text-text-dark">%{stats.winRate}</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
            <div className="w-12 h-12 bg-team-1/10 text-team-1 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-sm font-bold text-text-dark/40 uppercase tracking-wider">Doğru Cevap</p>
            <p className="text-3xl font-black text-text-dark">842</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
            <div className="w-12 h-12 bg-warning/10 text-warning rounded-2xl flex items-center justify-center mb-4">
              <Clock size={24} />
            </div>
            <p className="text-sm font-bold text-text-dark/40 uppercase tracking-wider">Ort. Süre</p>
            <p className="text-3xl font-black text-text-dark">{stats.avgDuration} dk</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Subject Breakdown */}
          <div className="bg-white rounded-[48px] p-10 shadow-sm border border-black/5">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-text-dark">Ders Dağılımı</h3>
              <button className="text-text-dark/40 hover:text-primary transition-colors">
                <Filter size={20} />
              </button>
            </div>
            <div className="h-[300px] w-full">
              {subjectData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#1E1B4B', fontWeight: 700, fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#F8FAFC' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={32}>
                      {subjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-text-dark/20 font-bold">
                  Veri bulunamadı.
                </div>
              )}
            </div>
          </div>

          {/* Win Rate Chart */}
          <div className="bg-white rounded-[48px] p-10 shadow-sm border border-black/5">
            <h3 className="text-2xl font-black text-text-dark mb-10">Kazanma Oranları</h3>
            <div className="h-[300px] w-full">
              {winRateData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={winRateData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {winRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-text-dark/20 font-bold">
                  Veri bulunamadı.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Games Table */}
        <div className="bg-white rounded-[48px] p-10 shadow-sm border border-black/5">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-text-dark">Son Oyunlar</h3>
            <Button variant="ghost" size="sm">
              Tümünü Dışa Aktar <ChevronRight size={16} />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="pb-6 text-xs font-black text-text-dark/40 uppercase tracking-widest">Tarih</th>
                  <th className="pb-6 text-xs font-black text-text-dark/40 uppercase tracking-widest">Ders</th>
                  <th className="pb-6 text-xs font-black text-text-dark/40 uppercase tracking-widest">Konu</th>
                  <th className="pb-6 text-xs font-black text-text-dark/40 uppercase tracking-widest">Sınıf</th>
                  <th className="pb-6 text-xs font-black text-text-dark/40 uppercase tracking-widest">Kazanan</th>
                  <th className="pb-6 text-xs font-black text-text-dark/40 uppercase tracking-widest">Süre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {roomHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-text-dark/20 font-bold">Henüz oyun oynanmadı.</td>
                  </tr>
                ) : (
                  roomHistory.map((h, i) => (
                    <tr key={i} className="group hover:bg-background transition-colors">
                      <td className="py-6 font-bold text-text-dark/60">23.02.2026</td>
                      <td className="py-6">
                        <span className="font-black text-text-dark uppercase text-xs px-3 py-1 bg-background rounded-full">
                          {h.subject}
                        </span>
                      </td>
                      <td className="py-6 font-black text-text-dark">{h.topicTitle}</td>
                      <td className="py-6 font-bold text-text-dark/60">{h.grade}. Sınıf</td>
                      <td className="py-6">
                        <span className={cn(
                          "text-xs font-black px-3 py-1 rounded-full uppercase",
                          h.winner === 1 ? "bg-team-1/10 text-team-1" : h.winner === 2 ? "bg-team-2/10 text-team-2" : "bg-text-dark/10 text-text-dark"
                        )}>
                          {h.winner === 'draw' ? 'Beraberlik' : h.winner === 1 ? h.team1Name : h.team2Name}
                        </span>
                      </td>
                      <td className="py-6 font-bold text-text-dark/60">{Math.round(h.duration / 60)} dk</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
