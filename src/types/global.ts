/** Tipos globales compartidos entre todos los features */

// Identificador genérico
export type EntityId = string;

/** Una nota simple de texto */
export interface Nota {
  id: EntityId;
  title: string;
  content?: string;
  completed: boolean;
  createdAt: string; // ISO string
  updatedAt?: string;
  // metadata extensible
  tags?: string[];
  date?: string; // opcional: asociar a fecha concreta (ej. turno médico)
}

/** Tipos para componentes configurables */
export type ComponentType =
  | "notas"
  | "almanaque"
  | "pathtracker"
  | "almanaquemensual";

/** Una instancia de componente dentro de una vista */
export interface VistaComponentBase {
  id: EntityId;
  type: ComponentType;
  config: Record<string, unknown>;
}

export interface NotaVistaComponent extends VistaComponentBase {
  type: "notas";
  config: { title: string; notes: Nota[] };
}

export interface AlmanaqueVistaComponent extends VistaComponentBase {
  type: "almanaque";
  config: { title: string; weekNotes: Record<string, Nota[]> };
}

export interface PathTrackerVistaComponent extends VistaComponentBase {
  type: "pathtracker";
  config: {
    title: string;
    paths: Record<string, import("../features/PathTracker/types").PathTask[]>;
  };
}

export interface AlmanaqueMensualVistaComponent extends VistaComponentBase {
  type: "almanaquemensual";
  config: {
    title: string;
    monthTasks: Record<
      string,
      import("../features/PathTracker/types").PathTask[]
    >;
    mode?: "standalone" | "connected";
    selectedPathTrackerId?: string;
  };
}

export type VistaComponent =
  | NotaVistaComponent
  | AlmanaqueVistaComponent
  | PathTrackerVistaComponent
  | AlmanaqueMensualVistaComponent;

export type ColorTheme =
  | "cyan"
  | "blue"
  | "green"
  | "red"
  | "orange"
  | "purple"
  | "pink"
  | "teal"
  | "yellow"
  | "gray";