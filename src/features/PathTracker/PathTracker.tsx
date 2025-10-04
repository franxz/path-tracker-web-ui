import React, { useState } from "react";
import styles from "./PathTracker.module.css";
import type { PathTask } from "./types";
import { NoteItem } from "../note/NoteItem";
import { NewNoteRow } from "../note/NewNoteRow";

interface PathTrackerProps {
  paths: Record<string, PathTask[]>;
  onCreatePath: (path: string) => void;
  onCreateTask: (path: string, task: Omit<PathTask, "id" | "executions">) => void;
  onUpdateTask: (path: string, id: string, changes: Partial<PathTask>) => void;
  onRemoveTask: (path: string, id: string) => void;
  onToggleTask: (path: string, id: string) => void;
  onTrackExecution: (path: string, id: string, note?: string) => void;
  title?: string;
}

export function PathTracker({
  paths,
  onCreatePath,
  onCreateTask,
  onUpdateTask,
  onRemoveTask,
  onToggleTask,
  onTrackExecution,
  title = "Path Tracker",
}: PathTrackerProps) {
  const [newPath, setNewPath] = useState("");
  const [newTitles, setNewTitles] = useState<Record<string, string>>({});
  const [newContents, setNewContents] = useState<Record<string, string>>({});

  const handleCreatePath = () => {
    const name = newPath.trim();
    if (!name || paths[name]) return;
    onCreatePath(name);
    setNewPath("");
  };

  const handleCreateTask = (path: string) => {
    const title = newTitles[path]?.trim();
    if (!title) return;
    onCreateTask(path, {
      title,
      content: newContents[path]?.trim() || undefined,
      completed: false,
      createdAt: Date.now().toString(),
    });
    setNewTitles((s) => ({ ...s, [path]: "" }));
    setNewContents((s) => ({ ...s, [path]: "" }));
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.addPathRow}>
        <input
          className={styles.input}
          placeholder="Nuevo Path"
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
        />
        <button className={styles.button} onClick={handleCreatePath}>
          Crear Path
        </button>
      </div>
      <div className={styles.pathsGrid}>
        {Object.keys(paths).length === 0 ? (
          <p className={styles.empty}>No hay paths</p>
        ) : (
          Object.keys(paths).map((path) => (
            <div key={path} className={styles.pathCol}>
              <h3 className={styles.pathTitle}>{path}</h3>
              <NewNoteRow
                title={newTitles[path] || ""}
                content={newContents[path] || ""}
                onTitleChange={(v) => setNewTitles((s) => ({ ...s, [path]: v }))}
                onContentChange={(v) => setNewContents((s) => ({ ...s, [path]: v }))}
                onSubmit={() => handleCreateTask(path)}
              />
              {(paths[path]?.length ?? 0) === 0 ? (
                <p className={styles.empty}>Sin tareas</p>
              ) : (
                paths[path].map((task) => (
                  <div key={task.id} className={styles.taskItem}>
                    <NoteItem
                      note={task}
                      onRemove={() => onRemoveTask(path, task.id)}
                      onUpdate={(_id, changes) => onUpdateTask(path, task.id, changes)}
                      onToggle={() => onToggleTask(path, task.id)}
                    />
                    <div className={styles.trackRow}>
                      <button
                        className={styles.button}
                        onClick={() => {
                          const note = prompt("Notas sobre la ejecución (opcional)");
                          onTrackExecution(path, task.id, note || undefined);
                        }}
                      >
                        Registrar ejecución
                      </button>
                      <span className={styles.execCount}>
                        {task.executions?.length || 0} ejecuciones
                      </span>
                    </div>
                    {task.executions && task.executions.length > 0 && (
                      <ul className={styles.execList}>
                        {task.executions.map((e, i) => (
                          <li key={i}>
                            {new Date(e.date).toLocaleString()} {e.notes && `- ${e.notes}`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
