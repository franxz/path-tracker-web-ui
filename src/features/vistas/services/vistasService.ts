import type { VistaComponent } from "../../../types/global";
import type { Vista } from "../types";

const STORAGE_KEY = "conectar:vistas:v1";

function readStorage(): Vista[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Vista[];
  } catch (err) {
    console.error("vistasService: failed to read storage", err);
    return [];
  }
}

function writeStorage(vistas: Vista[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vistas));
  } catch (err) {
    console.error("vistasService: failed to write storage", err);
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
      name: name || "Nueva vista",
      createdAt: new Date().toISOString(),
      meta: {},
      components: [],
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

  // 🔑 Agregar un componente a una vista
  addComponent(vistaId: string, component: VistaComponent): Vista | null {
    const vistas = readStorage();
    const idx = vistas.findIndex((v) => v.id === vistaId);
    if (idx === -1) return null;

    const vista = vistas[idx];
    const components = vista.components || [];

    const exists = components.some((c) => c.id === component.id);

    const updated: Vista = {
      ...vista,
      components: exists
        ? components.map((c) => (c.id === component.id ? component : c))
        : [...components, component],
    };

    vistas[idx] = updated;
    writeStorage(vistas);
    return updated;
  },

  // 🔑 Actualizar la config COMPLETA de un componente
  updateComponentConfig(
    vistaId: string,
    componentId: string,
    newConfig: Record<string, unknown>
  ): Vista | null {
    const vistas = readStorage();
    const vIdx = vistas.findIndex((v) => v.id === vistaId);
    if (vIdx === -1) return null;

    const vista = vistas[vIdx];
    const cIdx = (vista.components || []).findIndex(
      (c) => c.id === componentId
    );
    if (cIdx === -1) return null;

    const components = [...(vista.components || [])];
    components[cIdx] = { ...components[cIdx], config: newConfig as any };

    const updated: Vista = { ...vista, components };
    vistas[vIdx] = updated;
    writeStorage(vistas);
    return updated;
  },

  // 🔑 Patch parcial de config (ej: actualizar solo `notes`)
  patchComponentConfig(
    vistaId: string,
    componentId: string,
    patch: Partial<Record<string, unknown>>
  ): Vista | null {
    const vistas = readStorage();
    const vIdx = vistas.findIndex((v) => v.id === vistaId);
    if (vIdx === -1) return null;

    const vista = vistas[vIdx];
    const cIdx = (vista.components || []).findIndex(
      (c) => c.id === componentId
    );
    if (cIdx === -1) return null;

    const comp = (vista.components || [])[cIdx];
    const newConfig = { ...comp.config, ...patch };

    const components = [...(vista.components || [])];
    components[cIdx] = { ...comp, config: newConfig as any };

    const updated: Vista = { ...vista, components };
    vistas[vIdx] = updated;
    writeStorage(vistas);
    return updated;
  },

  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("vistasService: failed to clear storage", err);
    }
  },
};

function cryptoRandomId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return "v_" + Math.random().toString(36).slice(2, 9);
}
