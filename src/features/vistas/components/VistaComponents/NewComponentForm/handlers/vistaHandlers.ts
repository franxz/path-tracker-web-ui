import type { Nota, NotaVistaComponent, VistaComponent } from "../../../../../../types/global";
import type { WeekNotes } from "../../../../../almanaque/types";
import type { PathTask } from "../../../../../PathTracker/types";

export const createNotasComponent = (title: string): NotaVistaComponent => ({
  id: crypto.randomUUID(),
  type: "notas",
  config: { title, notes: [] as Nota[] },
});

export const createAlmanaqueComponent = (title: string): VistaComponent => {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const weekNotes: WeekNotes = days.reduce((acc, d) => {
    acc[d] = [];
    return acc;
  }, {} as WeekNotes);

  return {
    id: crypto.randomUUID(),
    type: "almanaque",
    config: { title, weekNotes },
  };
};

export const createPathTrackerComponent = (title: string): VistaComponent => ({
  id: crypto.randomUUID(),
  type: "pathtracker",
  config: { title, paths: {} as Record<string, PathTask[]> },
});

export const createAlmanaqueMensualComponent = (title: string): VistaComponent => {
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const monthTasks: Record<string, PathTask[]> = days.reduce((acc, d) => {
    acc[d] = [];
    return acc;
  }, {} as Record<string, PathTask[]>);

  return {
    id: crypto.randomUUID(),
    type: "almanaquemensual",
    config: { title, monthTasks },
  };
};
