import { useCallback, useEffect, useState } from 'react';
import type { Vista } from '../types';
import { vistasService } from '../services/vistasService';

export function useVistas() {
  const [vistas, setVistas] = useState<Vista[]>(() => vistasService.getAll());

  // keep a stable API and encapsulate persistence
  useEffect(() => {
    // Since we use localStorage as single source of truth, keep state synced when
    // other tabs change it
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === null || ev.key === undefined) return; // skip
      if (ev.key === 'conectar:vistas:v1') {
        setVistas(vistasService.getAll());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const refresh = useCallback(() => {
    setVistas(vistasService.getAll());
  }, []);

  const create = useCallback((name: string) => {
    const created = vistasService.create(name);
    setVistas((s) => [...s, created]);
    return created;
  }, []);

  const rename = useCallback((id: string, name: string) => {
    const updated = vistasService.rename(id, name);
    if (!updated) return null;
    setVistas((s) => s.map((v) => (v.id === id ? updated : v)));
    return updated;
  }, []);

  const remove = useCallback((id: string) => {
    const ok = vistasService.remove(id);
    if (!ok) return false;
    setVistas((s) => s.filter((v) => v.id !== id));
    return true;
  }, []);

  return { vistas, create, rename, remove, refresh } as const;
}