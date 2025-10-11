import React from "react";
import type { Note } from "./types";
import styles from "./NoteList.module.css";
import type { ColorTheme } from "../../types/global";
import { colorThemes } from "../../const/global";

interface NoteItemProps {
  note: Note;
  onRemove: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Note>) => void;
  onToggle: (id: string) => void;
  hideControls?: boolean;
  colorTheme?: ColorTheme;
}
export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onRemove,
  onUpdate,
  onToggle,
  hideControls = false,
  colorTheme = "cyan",
}) => {
  const theme = colorThemes[colorTheme] || colorThemes.cyan;
  return (
    <div className={styles.note}>
      <div className={styles.noteHeader} style={{ background: theme.light }}>
        <span className={styles.noteTitle}>{note.title}</span>
        {!hideControls && (
          <div
            className={styles.noteActions}
            style={{ background: theme.dark }}
          >
            <div className={styles.actionGroup}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={note.completed}
                  onChange={() => onToggle(note.id)}
                />
                <span style={{ color: "black" }}>Listo</span>
              </div>
            </div>
            <div className={styles.actionGroup}>
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
        )}
      </div>
      {note.content && <p className={styles.noteContent}>{note.content}</p>}
    </div>
  );
};
