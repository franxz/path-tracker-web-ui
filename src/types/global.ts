/** Tipos globales compartidos entre todos los features */

// Identificador genérico
export type EntityId = string;

/** Una nota simple de texto */
export interface Nota {
  id: EntityId;
  title: string;
  content?: string;
  completed: boolean;
  createdAt: string;   // ISO string
  updatedAt?: string;
  // metadata extensible
  tags?: string[];
  date?: string; // opcional: asociar a fecha concreta (ej. turno médico)
}

/** Tipos para componentes configurables */
export type ComponentType = 'notas' | 'almanaque' | 'pathtracker';

/** Una instancia de componente dentro de una vista */
export interface VistaComponent {
  id: EntityId;
  type: ComponentType;
  config: Record<string, unknown>; // configurable según el tipo
}

export interface NotaVistaComponent extends VistaComponent {
  config: {title:string, notes: Nota[]}
}