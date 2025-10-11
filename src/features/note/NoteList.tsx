import { useState } from "react";
import type { Note } from "./types";
import styles from "./NoteList.module.css";
import { NoteItem } from "./NoteItem";
import { NewNoteRow } from "./NewNoteRow";

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
      <NewNoteRow
        title={newTitle}
        content={newContent}
        onTitleChange={setNewTitle}
        onContentChange={setNewContent}
        onSubmit={submit}
      />

      <div className={styles.noteList}>
        {notes.length === 0 ? (
          <p>No hay notas</p>
        ) : (
          notes.map((n) => (
            <NoteItem
              key={n.id}
              note={n}
              onRemove={onRemove}
              onUpdate={onUpdate}
              onToggle={onToggle}
            />
          ))
        )}
      </div>
    </div>
  );
}
