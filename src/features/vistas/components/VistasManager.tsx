import React, { useMemo, useState } from "react";
import { useVistas } from "../hooks/useVistas";
import { NavBar } from "./NavBar";
import { NewVistaForm } from "./NewVistaForm";
import styles from "./VistasManager.module.css";
import type {
  Nota,
  NotaVistaComponent,
  VistaComponent,
} from "../../../types/global";
import type { WeekNotes } from "../../almanaque/types";
import { NoteList } from "../../note/NoteList";
import { Almanaque } from "../../almanaque/Almanaque";
import { PathTracker } from "../../PathTracker/PathTracker";
import type { PathTask } from "../../PathTracker/types";
import { AlmanaqueMensual } from "../../almanaque/AlmanaqueMensual";

export const VistasManager: React.FC = () => {
  const { vistas, create, rename, remove, addComponent } = useVistas();
  const [activeId, setActiveId] = useState<string | null>(() =>
    vistas.length ? vistas[0].id : null
  );

  const active = useMemo(
    () => vistas.find((v) => v.id === activeId) ?? null,
    [vistas, activeId]
  );

  // sync active when vistas change
  React.useEffect(() => {
    if (!activeId && vistas.length) {
      setActiveId(vistas[0].id);
    } else if (activeId && !vistas.find((v) => v.id === activeId)) {
      setActiveId(vistas.length ? vistas[0].id : null);
    }
  }, [vistas, activeId]);

  // Helper para agregar una nueva lista de notas
  const handleAddNotas = () => {
    if (!active) return;
    const title = prompt("Título de la lista de notas");
    if (!title) return;

    const component: NotaVistaComponent = {
      id: crypto.randomUUID(),
      type: "notas",
      config: { title, notes: [] as Nota[] },
    };

    addComponent(active.id, component);
  };

  // Helper para agregar un almanaque semanal
  const handleAddAlmanaque = () => {
    if (!active) return;
    const title = prompt("Título del almanaque semanal");
    if (!title) return;
    // Inicializar weekNotes con los días de la semana
    const days = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];
    const weekNotes: WeekNotes = days.reduce((acc, d) => {
      acc[d] = [];
      return acc;
    }, {} as WeekNotes);
    const component: VistaComponent = {
      id: crypto.randomUUID(),
      type: "almanaque",
      config: { title, weekNotes },
    };
    addComponent(active.id, component);
  };

  // Helper para agregar un path tracker
  const handleAddPathTracker = () => {
    if (!active) return;
    const title = prompt("Título del Path Tracker");
    if (!title) return;
    // Inicializar paths vacío
    const paths: Record<string, PathTask[]> = {};
    const component: VistaComponent = {
      id: crypto.randomUUID(),
      type: "pathtracker",
      config: { title, paths },
    };
    addComponent(active.id, component);
  };

  // Helper para agregar un almanaque mensual
  const handleAddAlmanaqueMensual = () => {
    if (!active) return;
    const title = prompt("Título del almanaque mensual");
    if (!title) return;
    // Inicializar monthTasks con los días del mes (1-31)
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const monthTasks: Record<string, PathTask[]> = days.reduce((acc, d) => {
      acc[d] = [];
      return acc;
    }, {} as Record<string, PathTask[]>);
    const component: VistaComponent = {
      id: crypto.randomUUID(),
      type: "almanaquemensual",
      config: { title, monthTasks },
    };
    addComponent(active.id, component);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <NavBar vistas={vistas} activeId={activeId} onSelect={setActiveId} />
        <div className={styles.controls}>
          <NewVistaForm
            onCreate={(name) => {
              const created = create(name);
              setActiveId(created.id);
            }}
          />
          {active && (
            <>
              <button className={styles.smallBtn} onClick={handleAddNotas}>
                + Lista de notas
              </button>
              <button className={styles.smallBtn} onClick={handleAddAlmanaque}>
                + Almanaque semanal
              </button>
              <button
                className={styles.smallBtn}
                onClick={handleAddPathTracker}
              >
                + Path Tracker
              </button>
              <button
                className={styles.smallBtn}
                onClick={handleAddAlmanaqueMensual}
              >
                + Almanaque mensual
              </button>
              <button
                className={styles.smallBtn}
                onClick={() => {
                  const newName = prompt("Renombrar la vista", active.name);
                  if (!newName) return;
                  rename(active.id, newName);
                }}
              >
                Renombrar
              </button>
              <button
                className={styles.smallBtn}
                onClick={() => {
                  if (!confirm(`¿Eliminar "${active.name}"?`)) return;
                  remove(active.id);
                }}
              >
                Borrar
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.editor} role="region" aria-label="vista-editor">
        {active ? (
          <div className={styles.card}>
            <h3>{active.name}</h3>

            {(!active.components || active.components.length === 0) && (
              <p className={styles.empty}>
                Esta es una vista vacía. Agregá un componente para empezar.
              </p>
            )}

            {active.components?.map((comp) => {
              if (comp.type === "notas") {
                const notas = comp.config.notes as Nota[];
                const title = comp.config.title as string;
                return (
                  <NoteList
                    key={comp.id}
                    title={title}
                    notes={notas}
                    onCreate={(note) =>
                      addComponent(active.id, {
                        ...comp,
                        config: {
                          ...comp.config,
                          notes: [
                            ...notas,
                            { ...note, id: crypto.randomUUID() },
                          ],
                        },
                      })
                    }
                    onUpdate={(id, changes) =>
                      addComponent(active.id, {
                        ...comp,
                        config: {
                          ...comp.config,
                          notes: notas.map((n) =>
                            n.id === id ? { ...n, ...changes } : n
                          ),
                        },
                      })
                    }
                    onRemove={(id) =>
                      addComponent(active.id, {
                        ...comp,
                        config: {
                          ...comp.config,
                          notes: notas.filter((n) => n.id !== id),
                        },
                      })
                    }
                    onToggle={(id) =>
                      addComponent(active.id, {
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
                      addComponent(active.id, {
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
                      addComponent(active.id, {
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
                      addComponent(active.id, {
                        ...comp,
                        config: {
                          ...comp.config,
                          weekNotes: {
                            ...weekNotes,
                            [day]: (weekNotes[day] || []).filter(
                              (n: Nota) => n.id !== id
                            ),
                          },
                        },
                      })
                    }
                    onToggle={(day: string, id: string) =>
                      addComponent(active.id, {
                        ...comp,
                        config: {
                          ...comp.config,
                          weekNotes: {
                            ...weekNotes,
                            [day]: (weekNotes[day] || []).map((n: Nota) =>
                              n.id === id
                                ? { ...n, completed: !n.completed }
                                : n
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
                      addComponent(active.id, {
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
                      addComponent(active.id, {
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
                      addComponent(active.id, {
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
                    onRemoveTask={(path, id) =>
                      addComponent(active.id, {
                        ...comp,
                        config: {
                          ...comp.config,
                          paths: {
                            ...paths,
                            [path]: (paths[path] || []).filter((n: PathTask) => n.id !== id),
                          },
                        },
                      })
                    }
                    onToggleTask={(path, id) =>
                      addComponent(active.id, {
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
                      addComponent(active.id, {
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
                const title = comp.config.title as string;
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth() + 1;
                // Buscar todos los pathtrackers de la vista actual
                const availablePathTrackers = (active.components || [])
                  .filter(c => c.type === "pathtracker")
                  .map(c => ({
                    id: c.id,
                    title: c.config.title as string,
                    // Unir todas las tareas de todos los paths
                    tasks: Object.values((c.config.paths as Record<string, PathTask[]>)).flat(),
                  }));
                return (
                  <AlmanaqueMensual
                    key={comp.id}
                    title={title}
                    year={year}
                    month={month}
                    monthTasks={monthTasks}
                    availablePathTrackers={availablePathTrackers}
                    onCreate={(day: number, task) =>
                      addComponent(active.id, {
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
                      addComponent(active.id, {
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
                      addComponent(active.id, {
                        ...comp,
                        config: {
                          ...comp.config,
                          monthTasks: {
                            ...monthTasks,
                            [day]: (monthTasks[day] || []).filter((n: PathTask) => n.id !== id),
                          },
                        },
                      })
                    }
                    onToggle={(day: number, id: string) =>
                      addComponent(active.id, {
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
                      addComponent(active.id, {
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
            })}

            <small>Creada: {new Date(active.createdAt).toLocaleString()}</small>
          </div>
        ) : (
          <div className={styles.card}>
            <p className={styles.empty}>
              No hay vistas. Crea la primera vista para empezar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
