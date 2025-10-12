import React from "react";
import type { Nota, VistaComponent } from "../../../../types/global";
import type { WeekNotes } from "../../../almanaque/types";
import type { PathTask } from "../../../PathTracker/types";
import { NoteList } from "../../../note/NoteList";
import { Almanaque } from "../../../almanaque/Almanaque";
import { PathTracker } from "../../../PathTracker/PathTracker";
import { AlmanaqueMensual } from "../../../almanaque/AlmanaqueMensual";
import { useActiveVistaContext } from "../../hooks/useActiveVistaContext";

interface VistaComponentRendererProps {
  comp: VistaComponent;
}

export const VistaComponentRenderer: React.FC<VistaComponentRendererProps> = ({
  comp,
}) => {
  const { active, addComponent } = useActiveVistaContext();

  if (!active) return null;
  const activeId = active.id;
  const components = active.components || [];

  if (comp.type === "notas") {
    const notas = comp.config.notes as Nota[];
    const title = comp.config.title as string;
    return (
      <NoteList
        key={comp.id}
        title={title}
        notes={notas}
        onCreate={(note) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              notes: [...notas, { ...note, id: crypto.randomUUID() }],
            },
          })
        }
        onUpdate={(id, changes) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              notes: notas.map((n) => (n.id === id ? { ...n, ...changes } : n)),
            },
          })
        }
        onRemove={(id) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              notes: notas.filter((n) => n.id !== id),
            },
          })
        }
        onToggle={(id) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              notes: notas.map((n) =>
                n.id === id ? { ...n, completed: !n.completed } : n
              ),
            },
          })
        }
      />
    );
  }
  if (comp.type === "almanaque") {
    const weekNotes = comp.config.weekNotes as WeekNotes;
    const title = comp.config.title as string;
    return (
      <Almanaque
        key={comp.id}
        title={title}
        weekNotes={weekNotes}
        onCreate={(day: string, note) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              weekNotes: {
                ...weekNotes,
                [day]: [
                  ...(weekNotes[day] || []),
                  { ...note, id: crypto.randomUUID() },
                ],
              },
            },
          })
        }
        onUpdate={(day: string, id: string, changes) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              weekNotes: {
                ...weekNotes,
                [day]: (weekNotes[day] || []).map((n: Nota) =>
                  n.id === id ? { ...n, ...changes } : n
                ),
              },
            },
          })
        }
        onRemove={(day: string, id: string) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              weekNotes: {
                ...weekNotes,
                [day]: (weekNotes[day] || []).filter((n: Nota) => n.id !== id),
              },
            },
          })
        }
        onToggle={(day: string, id: string) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              weekNotes: {
                ...weekNotes,
                [day]: (weekNotes[day] || []).map((n: Nota) =>
                  n.id === id ? { ...n, completed: !n.completed } : n
                ),
              },
            },
          })
        }
      />
    );
  }
  if (comp.type === "pathtracker") {
    const paths = comp.config.paths as Record<string, PathTask[]>;
    const title = comp.config.title as string;
    return (
      <PathTracker
        key={comp.id}
        title={title}
        paths={paths}
        onCreatePath={(path) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              paths: {
                ...paths,
                [path]: [],
              },
            },
          })
        }
        onCreateTask={(path, task) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              paths: {
                ...paths,
                [path]: [
                  ...(paths[path] || []),
                  { ...task, id: crypto.randomUUID(), executions: [] },
                ],
              },
            },
          })
        }
        onUpdateTask={(path, id, changes) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              paths: {
                ...paths,
                [path]: (paths[path] || []).map((n: PathTask) =>
                  n.id === id ? { ...n, ...changes } : n
                ),
              },
            },
          })
        }
        onUpdateAllPaths={(updatedPaths) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              paths: updatedPaths,
            },
          })
        }
        onRemoveTask={(path, id) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              paths: {
                ...paths,
                [path]: (paths[path] || []).filter(
                  (n: PathTask) => n.id !== id
                ),
              },
            },
          })
        }
        onToggleTask={(path, id) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              paths: {
                ...paths,
                [path]: (paths[path] || []).map((n: PathTask) =>
                  n.id === id ? { ...n, completed: !n.completed } : n
                ),
              },
            },
          })
        }
        onTrackExecution={(path, id, note) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              paths: {
                ...paths,
                [path]: (paths[path] || []).map((n: PathTask) =>
                  n.id === id
                    ? {
                        ...n,
                        executions: [
                          ...(n.executions || []),
                          { date: new Date().toISOString(), notes: note },
                        ],
                      }
                    : n
                ),
              },
            },
          })
        }
      />
    );
  }
  if (comp.type === "almanaquemensual") {
    const monthTasks = comp.config.monthTasks as Record<string, PathTask[]>;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    // Buscar todos los pathtrackers de la vista actual
    const availablePathTrackers = (components || [])
      .filter((c) => c.type === "pathtracker")
      .map((c) => ({
        id: c.id,
        title: c.config.title as string,
        // Unir todas las tareas de todos los paths
        tasks: Object.values(
          c.config.paths as Record<string, PathTask[]>
        ).flat(),
      }));
    return (
      <AlmanaqueMensual
        widgetData={comp}
        key={comp.id}
        year={year}
        month={month}
        monthTasks={monthTasks}
        availablePathTrackers={availablePathTrackers}
        mode={comp.config.mode}
        selectedPathTrackerId={comp.config.selectedPathTrackerId}
        onModeChange={(newMode) => {
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              mode: newMode,
            },
          });
        }}
        onSelectedPathTrackerIdChange={(newId) => {
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              selectedPathTrackerId: newId,
            },
          });
        }}
        onCreate={(day: number, task) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              monthTasks: {
                ...monthTasks,
                [day]: [
                  ...(monthTasks[day] || []),
                  { ...task, id: crypto.randomUUID(), executions: [] },
                ],
              },
            },
          })
        }
        onUpdate={(day: number, id: string, changes) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              monthTasks: {
                ...monthTasks,
                [day]: (monthTasks[day] || []).map((n: PathTask) =>
                  n.id === id ? { ...n, ...changes } : n
                ),
              },
            },
          })
        }
        onRemove={(day: number, id: string) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              monthTasks: {
                ...monthTasks,
                [day]: (monthTasks[day] || []).filter(
                  (n: PathTask) => n.id !== id
                ),
              },
            },
          })
        }
        onToggle={(day: number, id: string) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              monthTasks: {
                ...monthTasks,
                [day]: (monthTasks[day] || []).map((n: PathTask) =>
                  n.id === id ? { ...n, completed: !n.completed } : n
                ),
              },
            },
          })
        }
        onTrackExecution={(day: number, id: string, note?: string) =>
          addComponent(activeId, {
            ...comp,
            config: {
              ...comp.config,
              monthTasks: {
                ...monthTasks,
                [day]: (monthTasks[day] || []).map((n: PathTask) =>
                  n.id === id
                    ? {
                        ...n,
                        executions: [
                          ...(n.executions || []),
                          { date: new Date().toISOString(), notes: note },
                        ],
                      }
                    : n
                ),
              },
            },
          })
        }
      />
    );
  }
  return null;
};
