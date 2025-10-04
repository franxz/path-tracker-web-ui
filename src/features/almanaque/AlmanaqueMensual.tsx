import { useState, useMemo, type JSX } from "react";
import styles from "./Almanaque.module.css";
import type { PathTask } from "../PathTracker/types";
import { TaskItemWithTrack } from "../PathTracker/TaskItemWithTrack";
import { NewNoteRow } from "../note/NewNoteRow";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
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
  availablePathTrackers?: { id: string; title: string; tasks: PathTask[] }[];
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
  availablePathTrackers = [],
}: AlmanaqueMensualProps) {
  const [mode, setMode] = useState<"standalone" | "connected">("standalone");
  const [selectedPathTrackerId, setSelectedPathTrackerId] =
    useState<string>("");

  // Si connected, tasks = tasks del pathtracker seleccionado
  const connectedTasks = useMemo(() => {
    if (mode !== "connected") return [];
    const pt = availablePathTrackers.find(
      (pt) => pt.id === selectedPathTrackerId
    );
    return pt ? pt.tasks : [];
  }, [mode, selectedPathTrackerId, availablePathTrackers]);
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
      <h2 className={styles.title}>
        {title} - {MONTHS[month]} {year}
      </h2>
      {/* Selector de modo y pathtracker */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>
          <b>Modo:</b>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            style={{ marginLeft: 6 }}
          >
            <option value="standalone">Standalone</option>
            <option value="connected">Connected</option>
          </select>
        </label>
        {mode === "connected" && availablePathTrackers.length > 0 && (
          <label style={{ marginLeft: 16 }}>
            <b>PathTracker:</b>
            <select
              value={selectedPathTrackerId}
              onChange={(e) => setSelectedPathTrackerId(e.target.value)}
              style={{ marginLeft: 6 }}
            >
              <option value="">-- Selecciona --</option>
              {availablePathTrackers.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.title}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div
        className={styles.weekGrid}
        style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          let items: JSX.Element[] = [];
          if (mode === "connected" && selectedPathTrackerId) {
            // Mostrar un item por cada planeación de cada task
            const planned = connectedTasks.flatMap((task) =>
              (task.plannedDays || [])
                .filter((d) => {
                  if (typeof d === "number") return d === day;
                  // Si es string tipo YYYY-MM-DD
                  const dNum = Number(d.split("-")[2]);
                  return dNum === day;
                })
                .map((d) => (
                  <TaskItemWithTrack
                    key={task.id + "-" + d}
                    task={task}
                    path={String(day)}
                    onRemove={() => {}}
                    onUpdate={() => {}}
                    onToggle={() => {}}
                    onTrackExecution={() => {}}
                    showExecutions={false}
                    showPlanningControls={false}
                  />
                ))
            );
            items =
              planned.length > 0
                ? planned
                : [
                    <p className={styles.empty} key="empty">
                      Sin tareas
                    </p>,
                  ];
          } else {
            items =
              (monthTasks[day]?.length ?? 0) === 0
                ? [
                    <p className={styles.empty} key="empty">
                      Sin tareas
                    </p>,
                  ]
                : monthTasks[day].map((task) => (
                    <TaskItemWithTrack
                      key={task.id}
                      task={task}
                      path={String(day)}
                      onRemove={(_day, id) => onRemove(day, id)}
                      onUpdate={(_day, id, changes) =>
                        onUpdate(day, id, changes)
                      }
                      onToggle={(_day, id) => onToggle(day, id)}
                      onTrackExecution={(_day, id, note) =>
                        onTrackExecution(day, id, note)
                      }
                    />
                  ));
          }
          return (
            <div key={day} className={styles.dayCol}>
              <h3 className={styles.dayTitle}>Día {day}</h3>
              {mode === "standalone" && (
                <NewNoteRow
                  title={newTitles[day] || ""}
                  content={newContents[day] || ""}
                  onTitleChange={(v) =>
                    setNewTitles((s) => ({ ...s, [day]: v }))
                  }
                  onContentChange={(v) =>
                    setNewContents((s) => ({ ...s, [day]: v }))
                  }
                  onSubmit={() => handleCreate(day)}
                />
              )}
              {items}
            </div>
          );
        })}
      </div>
    </div>
  );
}
