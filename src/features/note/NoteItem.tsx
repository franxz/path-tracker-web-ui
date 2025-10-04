import React from "react";
import type { Note } from "./types";
import styles from "./NoteList.module.css";

interface NoteItemProps {
  note: Note;
  onRemove: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Note>) => void;
  onToggle: (id: string) => void;
}

export const NoteItem: React.FC<NoteItemProps> = ({ note, onRemove, onUpdate, onToggle }) => {
  return (
    <div className={styles.note}>
      <div className={styles.noteHeader}>
        <input
          type="checkbox"
          checked={note.completed}
          onChange={() => onToggle(note.id)}
        />
        <span className={styles.noteTitle}>{note.title}</span>
      </div>
      {note.content && <p className={styles.noteContent}>{note.content}</p>}
      <div className={styles.noteActions}>
        <button onClick={() => onRemove(note.id)}>Borrar</button>
        <button
          onClick={() => {
            const t = prompt("Nuevo título", note.title);
            if (t) onUpdate(note.id, { title: t });
          }}
        >
          Editar
        </button>
      </div>
    </div>
  );
};
