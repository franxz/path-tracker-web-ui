import { useCallback, useEffect, useState } from "react";
import type { Vista } from "../types";
import { vistasService } from "../services/vistasService";
import type { VistaComponent } from "../../../types/global";

export function useVistas() {
  const [vistas, setVistas] = useState<Vista[]>(() => vistasService.getAll());

  // sync entre pestañas
  useEffect(() => {
    const onStorage = (ev: StorageEvent) => {
      if (!ev.key) return;
      if (ev.key === "conectar:vistas:v1") {
        setVistas(vistasService.getAll());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const refresh = useCallback(() => setVistas(vistasService.getAll()), []);

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

  // 🔑 agregar componente a una vista
  const addComponent = useCallback(
    (vistaId: string, component: VistaComponent) => {
      const updated = vistasService.addComponent(vistaId, component);
      if (!updated) return; // si no existe la vista, no hacemos nada
      setVistas((s) => s.map((v) => (v.id === vistaId ? updated : v)));
      return updated;
    },
    []
  );

  return { vistas, create, rename, remove, refresh, addComponent } as const;
}
