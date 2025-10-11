import type { ColorTheme, Nota } from "../../types/global";

export interface PathTask extends Nota {
  executions: Array<{
    date: string; // ISO string
    notes?: string;
  }>;
  colorTheme?: ColorTheme;
  /** Fechas planeadas en formato YYYY-MM-DD */
  plannedDays?: string[];
}

export type PathTasks = Record<string, PathTask[]>; // key: path name
