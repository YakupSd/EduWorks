import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types/auth';

interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  schoolName?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loginAsGuest: (displayName: string) => void;
  isAuthenticated: () => boolean;
  isTeacher: () => boolean;
}

const AVATARS = ['🦊','🐺','🦁','🐯','🐸','🐧','🦋','🐙','🦄','🐲'];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        /* BACKEND: replace with API call */
        try {
          const usersRaw = localStorage.getItem('edusavas_users');
          const users = usersRaw ? JSON.parse(usersRaw) : [];
          const userEntry = users.find((u: any) => u.email === email);

          if (!userEntry || userEntry.password !== btoa(password)) {
            throw new Error('E-posta veya şifre hatalı.');
          }

          const { password: _, ...user } = userEntry;
          set({ user, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        /* BACKEND: replace with API call */
        try {
          const usersRaw = localStorage.getItem('edusavas_users');
          const users = usersRaw ? JSON.parse(usersRaw) : [];

          if (users.some((u: any) => u.email === data.email)) {
            throw new Error('Bu e-posta adresi zaten kullanımda.');
          }

          const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            email: data.email,
            displayName: data.displayName,
            role: data.role,
            schoolName: data.schoolName,
            createdAt: Date.now(),
            avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
            password: btoa(data.password), // Mock hash
          };

          users.push(newUser);
          localStorage.setItem('edusavas_users', JSON.stringify(users));

          const { password: _, ...user } = newUser;
          set({ user, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      logout: () => {
        set({ user: null });
      },

      loginAsGuest: (displayName) => {
        const guestUser: User = {
          id: 'guest_' + Math.random().toString(36).substr(2, 9),
          email: '',
          displayName,
          role: 'guest',
          createdAt: Date.now(),
          avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
        };
        set({ user: guestUser });
      },

      isAuthenticated: () => !!get().user,
      isTeacher: () => get().user?.role === 'teacher',
    }),
    {
      name: 'edusavas_session',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
