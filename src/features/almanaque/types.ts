import type { Nota } from "../../types/global";

export interface AlmanaqueNote extends Nota {}

export type WeekNotes = Record<string, AlmanaqueNote[]>; // key: day name
