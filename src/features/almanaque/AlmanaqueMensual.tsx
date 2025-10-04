import { useState } from "react";
import styles from "./Almanaque.module.css";
import type { PathTask } from "../PathTracker/types";
import { TaskItemWithTrack } from "../PathTracker/TaskItemWithTrack";
import { NewNoteRow } from "../note/NewNoteRow";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

interface AlmanaqueMensualProps {
  year: number;
  month: number; // 0-based
  monthTasks: Record<number, PathTask[]>; // key: day (1-based)
  onCreate: (day: number, task: Omit<PathTask, "id" | "executions">) => void;
  onUpdate: (day: number, id: string, changes: Partial<PathTask>) => void;
  onRemove: (day: number, id: string) => void;
  onToggle: (day: number, id: string) => void;
  onTrackExecution: (day: number, id: string, note?: string) => void;
  title?: string;
}

export function AlmanaqueMensual({
  year,
  month,
  monthTasks,
  onCreate,
  onUpdate,
  onRemove,
  onToggle,
  onTrackExecution,
  title = "Almanaque mensual",
}: AlmanaqueMensualProps) {
  const [newTitles, setNewTitles] = useState<Record<number, string>>({});
  const [newContents, setNewContents] = useState<Record<number, string>>({});

  // Días válidos para el mes
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleCreate = (day: number) => {
    const title = newTitles[day]?.trim();
    if (!title) return;
    onCreate(day, {
      title,
      content: newContents[day]?.trim() || undefined,
      completed: false,
      createdAt: new Date(year, month, day).toISOString(),
    });
    setNewTitles((s) => ({ ...s, [day]: "" }));
    setNewContents((s) => ({ ...s, [day]: "" }));
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title} - {MONTHS[month]} {year}</h2>
      <div className={styles.weekGrid} style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <div key={day} className={styles.dayCol}>
            <h3 className={styles.dayTitle}>Día {day}</h3>
            <NewNoteRow
              title={newTitles[day] || ""}
              content={newContents[day] || ""}
              onTitleChange={(v) => setNewTitles((s) => ({ ...s, [day]: v }))}
              onContentChange={(v) => setNewContents((s) => ({ ...s, [day]: v }))}
              onSubmit={() => handleCreate(day)}
            />
            {(monthTasks[day]?.length ?? 0) === 0 ? (
              <p className={styles.empty}>Sin tareas</p>
            ) : (
              monthTasks[day].map((task) => (
                <TaskItemWithTrack
                  key={task.id}
                  task={task}
                  path={String(day)}
                  onRemove={(_day, id) => onRemove(day, id)}
                  onUpdate={(_day, id, changes) => onUpdate(day, id, changes)}
                  onToggle={(_day, id) => onToggle(day, id)}
                  onTrackExecution={(_day, id, note) => onTrackExecution(day, id, note)}
                  showExecutions={false}
                />
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
