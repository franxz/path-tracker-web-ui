import React, { createContext, useContext } from "react";
import { useActiveVista } from "./useActiveVista";

const ActiveVistaContext = createContext<ReturnType<typeof useActiveVista> | null>(null);

export const ActiveVistaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useActiveVista();
  return <ActiveVistaContext.Provider value={value}>{children}</ActiveVistaContext.Provider>;
};

export const useActiveVistaContext = () => {
  const ctx = useContext(ActiveVistaContext);
  if (!ctx) throw new Error("useActiveVistaContext must be used inside ActiveVistaProvider");
  return ctx;
};