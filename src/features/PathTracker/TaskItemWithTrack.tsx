import React, { useRef, useState } from "react";
import type { PathTask } from "./types";
import { NoteItem } from "../note/NoteItem";
import styles from "./PathTracker.module.css";

interface TaskItemWithTrackProps {
  task: PathTask;
  path: string;
  onRemove: (path: string, id: string) => void;
  onUpdate: (path: string, id: string, changes: Partial<PathTask>) => void;
  onToggle: (path: string, id: string) => void;
  onTrackExecution: (path: string, id: string, note?: string) => void;
  showExecutions?: boolean;
  showPlanningControls?: boolean;
}
export const TaskItemWithTrack: React.FC<TaskItemWithTrackProps> = ({
  task,
  path,
  onRemove,
  onUpdate,
  onToggle,
  onTrackExecution,
  showExecutions = true,
  showPlanningControls = true,
}) => {
  const [showDateInput, setShowDateInput] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handlePlan = () => {
    setShowDateInput(true);
    setTimeout(() => dateInputRef.current?.focus(), 0);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    const plannedDays = Array.isArray(task.plannedDays)
      ? [...task.plannedDays]
      : [];
    if (!plannedDays.includes(value)) {
      onUpdate(path, task.id, { plannedDays: [...plannedDays, value] });
    }
    setShowDateInput(false);
  };

  const handleRemovePlannedDay = (dateStr: string) => {
    const plannedDays = Array.isArray(task.plannedDays)
      ? [...task.plannedDays]
      : [];
    onUpdate(path, task.id, {
      plannedDays: plannedDays.filter((d) => d !== dateStr),
    });
  };

  return (
    <div className={styles.taskItem}>
      <NoteItem
        note={task}
        onRemove={() => onRemove(path, task.id)}
        onUpdate={(_id, changes) => onUpdate(path, task.id, changes)}
        onToggle={() => onToggle(path, task.id)}
        hideControls={showPlanningControls === false}
        colorTheme={task.colorTheme}
      />
      {showPlanningControls && (
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
          <button
            className={styles.planBtn}
            style={{ marginLeft: 8 }}
            title="Planificar para una fecha"
            onClick={handlePlan}
          >
            Planificar
          </button>
          {showDateInput && (
            <input
              type="date"
              ref={dateInputRef}
              style={{ marginLeft: 8 }}
              onChange={handleDateChange}
              onBlur={() => setShowDateInput(false)}
              autoFocus
            />
          )}
        </div>
      )}
      {showPlanningControls &&
        Array.isArray(task.plannedDays) &&
        task.plannedDays.length > 0 && (
          <ul
            className={styles.execList}
            style={{ marginTop: 4, background: "#eef" }}
          >
            {task.plannedDays.sort().map((dateStr) => (
              <li
                key={dateStr}
                style={{ display: "flex", alignItems: "center" }}
              >
                <span style={{ fontSize: 13, color: "#336" }}>
                  Planeado: {dateStr}
                </span>
                <button
                  style={{
                    marginLeft: 8,
                    color: "#c00",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                  title={`Quitar planeación del día ${dateStr}`}
                  onClick={() => handleRemovePlannedDay(dateStr)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      {showExecutions && task.executions && task.executions.length > 0 && (
        <ul className={styles.execList}>
          {task.executions.map((e, i) => (
            <li key={i} style={{ color: "#336" }}>
              {new Date(e.date).toLocaleString()} {e.notes && `- ${e.notes}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
