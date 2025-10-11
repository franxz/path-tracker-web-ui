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

const DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
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
  mode?: "standalone" | "connected";
  selectedPathTrackerId?: string;
  onModeChange?: (mode: "standalone" | "connected") => void;
  onSelectedPathTrackerIdChange?: (id: string) => void;
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
  mode: controlledMode,
  selectedPathTrackerId: controlledSelectedPathTrackerId,
  onModeChange,
  onSelectedPathTrackerIdChange,
}: AlmanaqueMensualProps) {
  const [internalMode, setInternalMode] = useState<"standalone" | "connected">("standalone");
  const [internalSelectedPathTrackerId, setInternalSelectedPathTrackerId] = useState<string>("");
  const mode = controlledMode !== undefined ? controlledMode : internalMode;
  const selectedPathTrackerId = controlledSelectedPathTrackerId !== undefined ? controlledSelectedPathTrackerId : internalSelectedPathTrackerId;

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
  // Estado para mostrar/ocultar el input de nueva nota por día
  const [showNewRow, setShowNewRow] = useState<Record<number, boolean>>({});

  // Días válidos para el mes
  const daysInMonth = new Date(year, month, 0).getDate();
  // Día de la semana del primer día del mes (0=Domingo, 1=Lunes,...)
  const firstDayDate = new Date(year, month - 1, 1);
  let firstDayOfWeek = firstDayDate.getDay(); // 0=Domingo
  // Ajustar para que 0=Domingo pase a 6, y 1=Lunes pase a 0, etc.
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

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
        {title} - {MONTHS[month-1]} {year}
      </h2>
      {/* Selector de modo y pathtracker */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>
          <b>Modo:</b>
          <select
            value={mode}
            onChange={(e) => {
              const newMode = e.target.value as "standalone" | "connected";
              if (onModeChange) {
                onModeChange(newMode);
              } else {
                setInternalMode(newMode);
              }
            }}
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
              onChange={(e) => {
                if (onSelectedPathTrackerIdChange) {
                  onSelectedPathTrackerIdChange(e.target.value);
                } else {
                  setInternalSelectedPathTrackerId(e.target.value);
                }
              }}
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
        {/* Fila de encabezado con los días de la semana */}
        {DAYS.map((d) => (
          <div key={d} className={styles.dayCol}>
            <div className={styles.dayTitle} style={{ fontWeight: "bold", /* background: "#f5f5f5", borderBottom: "1px solid #ddd" */ }}>{d}</div>
          </div>
        ))}
        {/* Días dummy para alinear el primer día del mes */}
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <div key={"dummy-" + idx} className={styles.dayCol} style={{ background: "#494949ff", border: "none" }} />
        ))}
        {/* Renderizado de los días del mes */}
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
                showNewRow[day] ? (
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      aria-label="Cancelar"
                      style={{
                        position: "absolute",
                        right: 0,
                        top: -50,
                        zIndex: 2,
                        background: "black",
                        borderRadius: "100%",
                        width: 32,
                        padding: 8,
                        textAlign: "center",
                        height: 32,
                        lineHeight: "16px",
                        border: "none",
                        fontSize: 18,
                        cursor: "pointer",
                        color: "red"
                      }}
                      onClick={() => setShowNewRow((s) => ({ ...s, [day]: false }))}
                    >
                      ×
                    </button>
                    <NewNoteRow
                      title={newTitles[day] || ""}
                      content={newContents[day] || ""}
                      onTitleChange={(v) =>
                        setNewTitles((s) => ({ ...s, [day]: v }))
                      }
                      onContentChange={(v) =>
                        setNewContents((s) => ({ ...s, [day]: v }))
                      }
                      onSubmit={() => {
                        handleCreate(day);
                        setShowNewRow((s) => ({ ...s, [day]: false }));
                      }}
                    />
                  </div>
                ) : (
                  <button
                    className={styles.addBtn}
                    style={{ marginBottom: 6 }}
                    onClick={() => setShowNewRow((s) => ({ ...s, [day]: true }))}
                  >
                    +
                  </button>
                )
              )}
              {items}
            </div>
          );
        })}
      </div>
    </div>
  );
}
