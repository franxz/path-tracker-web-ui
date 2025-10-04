import { useState, useCallback } from "react";
import type { AlmanaqueNote, WeekNotes } from "./types";

const DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export function useAlmanaque(initialNotes: WeekNotes = {}) {
  const [weekNotes, setWeekNotes] = useState<WeekNotes>(() => {
    // Ensure all days are present
    const base: WeekNotes = {};
    for (const d of DAYS) base[d] = initialNotes[d] ? [...initialNotes[d]] : [];
    return base;
  });

  const create = useCallback((day: string, payload: Omit<AlmanaqueNote, "id">) => {
    setWeekNotes((s) => ({
      ...s,
      [day]: [
        { ...payload, id: String(Date.now()) },
        ...(s[day] || []),
      ],
    }));
  }, []);

  const update = useCallback((day: string, id: string, patch: Partial<Omit<AlmanaqueNote, "id">>) => {
    setWeekNotes((s) => ({
      ...s,
      [day]: s[day].map((n) => (n.id === id ? { ...n, ...patch } : n)),
    }));
  }, []);

  const remove = useCallback((day: string, id: string) => {
    setWeekNotes((s) => ({
      ...s,
      [day]: s[day].filter((n) => n.id !== id),
    }));
  }, []);

  const toggle = useCallback((day: string, id: string) => {
    setWeekNotes((s) => ({
      ...s,
      [day]: s[day].map((n) => (n.id === id ? { ...n, completed: !n.completed } : n)),
    }));
  }, []);

  return { weekNotes, create, update, remove, toggle };
}
