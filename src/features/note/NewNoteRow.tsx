import React from "react";
import styles from "./NoteList.module.css";

interface NewNoteRowProps {
  title: string;
  content: string;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onSubmit: () => void;
}

export const NewNoteRow: React.FC<NewNoteRowProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSubmit,
}) => (
  <div className={styles.newNoteRow}>
    <input
      className={styles.input}
      placeholder="Título"
      value={title}
      onChange={(e) => onTitleChange(e.target.value)}
    />
    <input
      className={styles.input}
      placeholder="Contenido"
      value={content}
      onChange={(e) => onContentChange(e.target.value)}
    />
    <button className={styles.button} onClick={onSubmit}>
      Agregar
    </button>
  </div>
);
