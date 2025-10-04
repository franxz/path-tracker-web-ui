import React, { useState } from "react";
import type { Note } from "./types";
import styles from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onCreate: (note: Omit<Note, "id">) => void;
  onUpdate: (id: string, changes: Partial<Note>) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  title?: string;
}

export function NoteList({
  notes,
  onCreate,
  onUpdate,
  onRemove,
  onToggle,
  title = "Notas",
}: NoteListProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const submit = () => {
    if (!newTitle.trim()) return;
    onCreate({
      title: newTitle.trim(),
      content: newContent.trim() || undefined,
      completed: false,
      createdAt: Date.now().toString(),
    });
    setNewTitle("");
    setNewContent("");
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.newNoteRow}>
        <input
          className={styles.input}
          placeholder="Título"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="Contenido"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button className={styles.button} onClick={submit}>
          Agregar
        </button>
      </div>

      {notes.length === 0 ? (
        <p>No hay notas</p>
      ) : (
        notes.map((n) => (
          <div key={n.id} className={styles.note}>
            <div className={styles.noteHeader}>
              <input
                type="checkbox"
                checked={n.completed}
                onChange={() => onToggle(n.id)}
              />
              <span className={styles.noteTitle}>{n.title}</span>
            </div>
            {n.content && <p className={styles.noteContent}>{n.content}</p>}
            <div className={styles.noteActions}>
              <button onClick={() => onRemove(n.id)}>Borrar</button>
              <button
                onClick={() => {
                  const t = prompt("Nuevo título", n.title);
                  if (t) onUpdate(n.id, { title: t });
                }}
              >
                Editar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
