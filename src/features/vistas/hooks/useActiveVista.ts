import { useState, useMemo, useEffect } from "react";
import { useVistas } from "./useVistas";
import type { Vista } from "../types";

export const useActiveVista = () => {
  const { vistas, create, rename, remove, addComponent } = useVistas();

  const [activeId, setActiveId] = useState<string | null>(() =>
    vistas.length ? vistas[0].id : null
  );

  const active = useMemo<Vista | null>(
    () => vistas.find((v) => v.id === activeId) ?? null,
    [vistas, activeId]
  );

  // Keep activeId in sync with vistas list
  useEffect(() => {
    if (!activeId && vistas.length) {
      setActiveId(vistas[0].id);
    } else if (activeId && !vistas.find((v) => v.id === activeId)) {
      setActiveId(vistas.length ? vistas[0].id : null);
    }
  }, [vistas, activeId]);

  return {
    vistas,
    active,
    activeId,
    setActiveId,
    create,
    rename,
    remove,
    addComponent,
  };
};
