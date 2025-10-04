import type { VistaComponent } from '../../types/global';

export interface Vista {
  id: string;
  name: string;
  createdAt: string;
  meta?: Record<string, unknown>;
  components?: VistaComponent[]; // 🔑 instancias de componentes configurables
}
