import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialMotifs, initialHistoryChapters, Motif, HistoryChapter } from '../data/initialData';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface TryOnResult {
  id: string;
  userId: string;
  motifId: string;
  fotoAsliUrl: string;
  fotoHasilUrl: string; // Generated SVG base64 or custom styling data
  warnaDipilih: string; // hex
  jenisProduk: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  created_at: string;
}

interface DatabaseState {
  users: User[];
  currentUser: User | null;
  motifs: Motif[];
  historyChapters: HistoryChapter[];
  favorites: string[]; // array of motifIds for the current user
  tryOnResults: TryOnResult[];
  
  // Auth actions
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  updateProfile: (name: string, avatarUrl?: string) => { success: boolean };
  
  // Motif CRUD
  addMotif: (motif: Omit<Motif, 'id' | 'created_at' | 'updated_at'>) => { success: boolean; motif: Motif };
  updateMotif: (id: string, updatedMotif: Partial<Motif>) => { success: boolean };
  deleteMotif: (id: string) => { success: boolean };
  
  // Favorites
  toggleFavorite: (motifId: string) => void;
  isFavorite: (motifId: string) => boolean;
  
  // Try-on simulation
  addTryOnResult: (result: TryOnResult) => void;
  updateTryOnStatus: (id: string, status: 'PROCESSING' | 'COMPLETED' | 'FAILED', fotoHasilUrl?: string) => void;
  
  // Admin User Management
  toggleUserStatus: (userId: string) => void;
  
  // Admin Content Management
  updateHistoryChapter: (id: string, konten: string, speech: string) => void;
  
  // Reset database to initial defaults
  resetDatabase: () => void;
}

export const useDatabase = create<DatabaseState>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: "admin-1",
          name: "Hj. Rahmah",
          email: "admin@sasitra.com",
          role: "ADMIN",
          avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
          is_active: true,
          created_at: new Date("2026-06-01").toISOString()
        },
        {
          id: "user-1",
          name: "Budi",
          email: "user@sasitra.com",
          role: "USER",
          avatar_url: "/assets/profil/mbappe.png",
          is_active: true,
          created_at: new Date("2026-06-02").toISOString()
        }
      ],
      currentUser: null,
      motifs: initialMotifs,
      historyChapters: initialHistoryChapters,
      favorites: [],
      tryOnResults: [],

      // AUTH ACTIONS
      login: (email, password) => {
        // Mock simple authentication
        const dbUsers = get().users;
        const user = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
          return { success: false, message: "Email tidak terdaftar" };
        }

        if (!user.is_active) {
          return { success: false, message: "Akun Anda dinonaktifkan oleh Admin" };
        }

        // Mock password matching (passwords are user123 for user, admin123 for admin)
        const expectedPassword = user.role === 'ADMIN' ? 'admin123' : 'user123';
        if (password !== expectedPassword && password !== 'password123') {
          return { success: false, message: "Kata sandi salah" };
        }

        set({ currentUser: user });
        return { success: true, message: `Selamat datang kembali, ${user.name}!` };
      },

      logout: () => {
        set({ currentUser: null });
      },

      register: (name, email, _password) => {
        void _password;
        const dbUsers = get().users;
        const exists = dbUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

        if (exists) {
          return { success: false, message: "Email sudah terdaftar" };
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          role: 'USER',
          is_active: true,
          avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
          created_at: new Date().toISOString()
        };

        set({
          users: [...dbUsers, newUser],
          currentUser: newUser
        });

        return { success: true, message: "Pendaftaran berhasil! Anda telah masuk otomatis." };
      },

      updateProfile: (name, avatarUrl) => {
        const { currentUser, users } = get();
        if (!currentUser) return { success: false };

        const updatedUser = {
          ...currentUser,
          name,
          avatar_url: avatarUrl || currentUser.avatar_url
        };

        const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);

        set({
          currentUser: updatedUser,
          users: updatedUsers
        });

        return { success: true };
      },

      // MOTIF CRUD ACTIONS
      addMotif: (motifData) => {
        const newId = motifData.nama_motif.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newMotif: Motif = {
          ...motifData,
          id: newId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        set(state => ({
          motifs: [...state.motifs, newMotif]
        }));

        return { success: true, motif: newMotif };
      },

      updateMotif: (id, updatedFields) => {
        set(state => ({
          motifs: state.motifs.map(m => m.id === id ? {
            ...m,
            ...updatedFields,
            updated_at: new Date().toISOString()
          } : m)
        }));
        return { success: true };
      },

      deleteMotif: (id) => {
        set(state => ({
          motifs: state.motifs.filter(m => m.id !== id)
        }));
        return { success: true };
      },

      // FAVORITES ACTIONS
      toggleFavorite: (motifId) => {
        const { currentUser, favorites } = get();
        if (!currentUser) return; // Must be logged in

        if (favorites.includes(motifId)) {
          set({ favorites: favorites.filter(id => id !== motifId) });
        } else {
          set({ favorites: [...favorites, motifId] });
        }
      },

      isFavorite: (motifId) => {
        return get().favorites.includes(motifId);
      },

      // TRY-ON ACTIONS
      addTryOnResult: (result) => {
        set(state => ({
          tryOnResults: [result, ...state.tryOnResults]
        }));
      },

      updateTryOnStatus: (id, status, fotoHasilUrl) => {
        set(state => ({
          tryOnResults: state.tryOnResults.map(r => r.id === id ? {
            ...r,
            status,
            fotoHasilUrl: fotoHasilUrl || r.fotoHasilUrl
          } : r)
        }));
      },

      // ADMIN ACTIONS
      toggleUserStatus: (userId) => {
        const updatedUsers = get().users.map(u => {
          if (u.id === userId && u.role !== 'ADMIN') {
            return { ...u, is_active: !u.is_active };
          }
          return u;
        });

        // If the deactivated user is currently logged in, force logout
        const current = get().currentUser;
        const isDeactivatingCurrent = current && current.id === userId;

        set({
          users: updatedUsers,
          currentUser: isDeactivatingCurrent ? null : current
        });
      },

      updateHistoryChapter: (id, konten, speech) => {
        set(state => ({
          historyChapters: state.historyChapters.map(ch => ch.id === id ? {
            ...ch,
            konten,
            speech
          } : ch)
        }));
      },

      resetDatabase: () => {
        set({
          users: [
            {
              id: "admin-1",
              name: "Hj. Rahmah",
              email: "admin@sasitra.com",
              role: "ADMIN",
              avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
              is_active: true,
              created_at: new Date("2026-06-01").toISOString()
            },
            {
              id: "user-1",
              name: "Budi",
              email: "user@sasitra.com",
              role: "USER",
              avatar_url: "/assets/profil/mbappe.png",
              is_active: true,
              created_at: new Date("2026-06-02").toISOString()
            }
          ],
          currentUser: null,
          motifs: initialMotifs,
          historyChapters: initialHistoryChapters,
          favorites: [],
          tryOnResults: []
        });
      }
    }),
    {
      name: 'sasitra-database-store', // LocalStorage key
      version: 1, // Added version schema for localstorage migrations
    }
  )
);

