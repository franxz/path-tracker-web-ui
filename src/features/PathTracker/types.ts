import type { Nota } from "../../types/global";

export interface PathTask extends Nota {
  executions: Array<{
    date: string; // ISO string
    notes?: string;
  }>;
}

export type PathTasks = Record<string, PathTask[]>; // key: path name
