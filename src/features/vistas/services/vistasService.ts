import type { Vista } from '../types';

const STORAGE_KEY = 'conectar:vistas:v1';

// Helpers sincronizados con localStorage para persistencia simple y estable
function readStorage(): Vista[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Vista[];
  } catch (err) {
    console.error('vistasService: failed to read storage', err);
    return [];
  }
}

function writeStorage(vistas: Vista[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vistas));
  } catch (err) {
    console.error('vistasService: failed to write storage', err);
  }
}

export const vistasService = {
  getAll(): Vista[] {
    return readStorage();
  },

  create(name: string): Vista {
    const vistas = readStorage();
    const newVista: Vista = {
      id: cryptoRandomId(),
      name: name || 'Nueva vista',
      createdAt: new Date().toISOString(),
      meta: {},
    };
    const next = [...vistas, newVista];
    writeStorage(next);
    return newVista;
  },

  rename(id: string, newName: string): Vista | null {
    const vistas = readStorage();
    const idx = vistas.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    vistas[idx] = { ...vistas[idx], name: newName };
    writeStorage(vistas);
    return vistas[idx];
  },

  remove(id: string): boolean {
    const vistas = readStorage();
    const next = vistas.filter((v) => v.id !== id);
    if (next.length === vistas.length) return false;
    writeStorage(next);
    return true;
  },

  // utility for tests and dev
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('vistasService: failed to clear storage', err);
    }
  },
};

function cryptoRandomId() {
  // simple stable unique id using crypto if available
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // fallback
  return 'v_' + Math.random().toString(36).slice(2, 9);
}