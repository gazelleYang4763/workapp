import { create } from 'zustand';

interface PlatformSettings {
  platformName: string;
  logoUrl: string;
}

interface PlatformStore extends PlatformSettings {
  setPlatformName: (name: string) => void;
  setLogoUrl: (url: string) => void;
  loadSettings: () => void;
}

const defaultSettings: PlatformSettings = {
  platformName: '工作台',
  logoUrl: '',
};

export const usePlatformStore = create<PlatformStore>((set) => ({
  ...defaultSettings,

  setPlatformName: (name) => {
    set({ platformName: name });
    localStorage.setItem('platformName', name);
  },

  setLogoUrl: (url) => {
    set({ logoUrl: url });
    localStorage.setItem('platformLogo', url);
  },

  loadSettings: () => {
    const name = localStorage.getItem('platformName') || defaultSettings.platformName;
    const logo = localStorage.getItem('platformLogo') || defaultSettings.logoUrl;
    set({ platformName: name, logoUrl: logo });
  },
}));
