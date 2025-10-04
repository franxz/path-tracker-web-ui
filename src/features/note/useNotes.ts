import { useState, useCallback } from "react";
import type { Note } from "./types";

export function useNotes(initialNotes: Note[] = []) {
  const [notes, setNotes] = useState<Note[]>([...initialNotes]);

  const create = useCallback((payload: Omit<Note, "id">) => {
    const newNote: Note = { ...payload, id: String(Date.now()) };
    setNotes((s) => [newNote, ...s]);
  }, []);

  const update = useCallback((id: string, patch: Partial<Omit<Note, "id">>) => {
    setNotes((s) => s.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }, []);

  const remove = useCallback((id: string) => {
    setNotes((s) => s.filter((n) => n.id !== id));
  }, []);

  const toggle = useCallback((id: string) => {
    setNotes((s) =>
      s.map((n) => (n.id === id ? { ...n, completed: !n.completed } : n))
    );
  }, []);

  return { notes, create, update, remove, toggle };
}
