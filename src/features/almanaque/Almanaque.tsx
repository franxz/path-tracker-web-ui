import React, { useState } from "react";
import styles from "./Almanaque.module.css";
import type { Note } from "../note/types";
import { NoteItem } from "../note/NoteItem";
import { NewNoteRow } from "../note/NewNoteRow";

const DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

interface AlmanaqueProps {
  weekNotes: Record<string, Note[]>;
  onCreate: (day: string, note: Omit<Note, "id">) => void;
  onUpdate: (day: string, id: string, changes: Partial<Note>) => void;
  onRemove: (day: string, id: string) => void;
  onToggle: (day: string, id: string) => void;
  title?: string;
}

export function Almanaque({
  weekNotes,
  onCreate,
  onUpdate,
  onRemove,
  onToggle,
  title = "Almanaque semanal",
}: AlmanaqueProps) {
  const [newTitles, setNewTitles] = useState<Record<string, string>>({});
  const [newContents, setNewContents] = useState<Record<string, string>>({});

  const handleCreate = (day: string) => {
    const title = newTitles[day]?.trim();
    if (!title) return;
    onCreate(day, {
      title,
      content: newContents[day]?.trim() || undefined,
      completed: false,
      createdAt: Date.now().toString(),
    });
    setNewTitles((s) => ({ ...s, [day]: "" }));
    setNewContents((s) => ({ ...s, [day]: "" }));
  };

  return (
    <div className={styles.wrapper}>
      {/* <h2 className={styles.title}>{title}</h2> */}
      <div className={styles.weekGrid}>
        {DAYS.map((day) => (
          <div key={day} className={styles.dayCol}>
            <h3 className={styles.dayTitle}>{day}</h3>
            <NewNoteRow
              title={newTitles[day] || ""}
              content={newContents[day] || ""}
              onTitleChange={(v) => setNewTitles((s) => ({ ...s, [day]: v }))}
              onContentChange={(v) => setNewContents((s) => ({ ...s, [day]: v }))}
              onSubmit={() => handleCreate(day)}
            />
            {(weekNotes[day]?.length ?? 0) === 0 ? (
              <p className={styles.empty}>Sin notas</p>
            ) : (
              weekNotes[day].map((n) => (
                <NoteItem
                  key={n.id}
                  note={n}
                  onRemove={() => onRemove(day, n.id)}
                  onUpdate={(_id, changes) => onUpdate(day, n.id, changes)}
                  onToggle={() => onToggle(day, n.id)}
                />
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
