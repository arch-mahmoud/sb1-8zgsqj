import { StateCreator } from 'zustand';
import { Settings } from '../../types';

export interface SettingsSlice {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
}

export const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  settings: {
    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJ1aWxkaW5nLTIiPjxwYXRoIGQ9Ik02IDIyVjNhMiAyIDAgMCAxIDItMmgxMmEyIDIgMCAwIDEgMiAydjE5Ii8+PHBhdGggZD0iTTYgMTJIMjIiLz48cGF0aCBkPSJNNiAySDIyIi8+PC9zdmc+',
    maxFileSize: 10 * 1024 * 1024, // Default 10MB
  },

  updateSettings: (updates) => set((state) => ({
    settings: { ...state.settings, ...updates }
  })),
});