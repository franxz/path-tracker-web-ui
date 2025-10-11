import { useState } from "react";
import { colorThemes, colorThemeLabels } from "../../const/global";
import type { ColorTheme } from "../../types/global";
import styles from "./PathTracker.module.css";
import type { PathTask } from "./types";
import { TaskItemWithTrack } from "./TaskItemWithTrack";

import { NewNoteRow } from "../note/NewNoteRow";

interface PathTrackerProps {
  paths: Record<string, PathTask[]>;
  onCreatePath: (path: string) => void;
  onCreateTask: (path: string, task: Omit<PathTask, "id" | "executions">) => void;
  onUpdateTask: (path: string, id: string, changes: Partial<PathTask>) => void;
  onUpdateAllPaths?: (paths: Record<string, PathTask[]>) => void;
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
  onUpdateAllPaths,
  onRemoveTask,
  onToggleTask,
  onTrackExecution,
  title = "Path Tracker",
}: PathTrackerProps) {
  // Estado de color por path
  const [colorThemesByPath, setColorThemesByPath] = useState<Record<string, ColorTheme>>({});
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

  // Cuando cambia el color, actualizar todos los tasks existentes
  // Cambia el color solo de un path
  const handlePathColorChange = (path: string, newColor: ColorTheme) => {
    setColorThemesByPath((prev) => ({ ...prev, [path]: newColor }));
    if (onUpdateAllPaths) {
      const updatedPaths = { ...paths };
      updatedPaths[path] = (paths[path] || []).map(task => ({ ...task, colorTheme: newColor }));
      onUpdateAllPaths(updatedPaths);
    } else if (onUpdateTask) {
      // fallback: actualiza uno por uno si no hay onUpdateAllPaths
      (paths[path] || []).forEach((task) => {
        onUpdateTask(path, task.id, { colorTheme: newColor });
      });
    }
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
              {/* Selector de color por path */}
              <div style={{ marginBottom: 8 }}>
                <label>
                  <b>Color: </b>
                  <select
                    value={colorThemesByPath[path] || "cyan"}
                    onChange={(e) => handlePathColorChange(path, e.target.value as ColorTheme)}
                    style={{ marginLeft: 6 }}
                  >
                    {Object.keys(colorThemes).map((theme) => (
                      <option key={theme} value={theme}>
                        {colorThemeLabels[theme as ColorTheme] || theme}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
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
                  <TaskItemWithTrack
                    key={task.id}
                    task={task}
                    path={path}
                    onRemove={onRemoveTask}
                    onUpdate={onUpdateTask}
                    onToggle={onToggleTask}
                    onTrackExecution={onTrackExecution}
                    showExecutions={true}
                  />
                ))
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
