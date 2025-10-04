import React, { useState } from "react";
import { useNotes } from "./useNotes";
import type { Note } from "./types";

interface NoteListProps {
  initialNotes?: Note[];
  title?: string;
}

export function NoteList({
  initialNotes = [],
  title = "Notas",
}: NoteListProps) {
  const { notes, create, update, remove, toggle } = useNotes(initialNotes);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const submit = () => {
    if (!newTitle.trim()) return;
    create({
      title: newTitle.trim(),
      content: newContent.trim() || undefined,
      completed: false,
    });
    setNewTitle("");
    setNewContent("");
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h2>{title}</h2>
      <div>
        <input
          placeholder="Título"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          placeholder="Contenido"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button onClick={submit}>Agregar</button>
      </div>
      {notes.length === 0 ? (
        <p>No hay notas</p>
      ) : (
        notes.map((n) => (
          <div
            key={n.id}
            style={{ border: "1px solid #ccc", padding: 5, margin: 5 }}
          >
            <input
              type="checkbox"
              checked={n.completed}
              onChange={() => toggle(n.id)}
            />
            <strong>{n.title}</strong>
            <p>{n.content}</p>
            <button onClick={() => remove(n.id)}>Borrar</button>
            <button
              onClick={() => {
                const t = prompt("Nuevo título", n.title);
                if (t) update(n.id, { title: t });
              }}
            >
              Editar
            </button>
          </div>
        ))
      )}
    </div>
  );
}
