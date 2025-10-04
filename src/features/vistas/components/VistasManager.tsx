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
import { NoteList } from "../../note/NoteList";

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
