import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JoinRoomPage from './pages/JoinRoomPage';
import HomePage from './pages/HomePage';
import SubjectsPage from './pages/SubjectsPage';
import GameSelectPage from './pages/GameSelectPage';
import TugOfWarPage from './pages/TugOfWarPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardHome from './pages/dashboard/DashboardHome';
import CreateRoom from './pages/dashboard/CreateRoom';
import RoomManage from './pages/dashboard/RoomManage';
import StatsPage from './pages/dashboard/StatsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/giris" element={<LoginPage />} />
        <Route path="/kayit" element={<RegisterPage />} />
        <Route path="/kat" element={<JoinRoomPage />} />
        
        {/* Quick Play Routes (Legacy/Direct) */}
        <Route path="/hizli-oyna" element={<HomePage />} />
        <Route path="/dersler" element={<SubjectsPage />} />
        <Route path="/oyun-sec" element={<GameSelectPage />} />
        <Route path="/ip-cekme" element={<TugOfWarPage />} />
        <Route path="/ayarlar" element={<SettingsPage />} />
        
        {/* Room Routes */}
        <Route path="/kat/:roomCode" element={<JoinRoomPage />} />
        <Route path="/kat/:roomCode/oyun" element={<TugOfWarPage />} />
        
        {/* Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute role="teacher">
              <DashboardHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/yeni-oda" 
          element={
            <ProtectedRoute role="teacher">
              <CreateRoom />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/oda/:roomId" 
          element={
            <ProtectedRoute role="teacher">
              <RoomManage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/istatistikler" 
          element={
            <ProtectedRoute role="teacher">
              <StatsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/odalar" 
          element={
            <ProtectedRoute role="teacher">
              <DashboardHome /> {/* Reuse for now */}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/ayarlar" 
          element={
            <ProtectedRoute role="teacher">
              <div className="p-20 text-center font-black text-4xl">Dashboard Ayarları (Yapım Aşamasında)</div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
