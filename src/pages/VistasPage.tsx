import React from "react";
import { VistasManager } from "../features/vistas";
import type { Note } from "../features/note/types";
import { NoteList } from "../features/note/NoteList";

export const VistasPage: React.FC = () => {
  const initialA: Note[] = [
    { id: "a1", title: "Lista A - Nota 1", completed: false },
  ];
  const initialB: Note[] = [
    { id: "b1", title: "Lista B - Nota 1", completed: true },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>🧙‍♂️ Vistas 🌬️</h1>
      <div
        style={{
          height: "100vh",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <VistasManager />
      </div>
      <h1>Mis Listas de Notas Independientes</h1>
      <NoteList title="Lista A" initialNotes={initialA} />
      <NoteList title="Lista B" initialNotes={initialB} />
    </div>
  );
};

export default VistasPage;
