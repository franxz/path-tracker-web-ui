import React from "react";
import styles from "../VistasManager.module.css";
import { NewVistaForm } from "./NewVistaForm";
import { useActiveVistaContext } from "../../hooks/useActiveVistaContext";

export const VistaControls: React.FC = () => {
  const { active, setActiveId, create, rename, remove } =
    useActiveVistaContext();

  return (
    <div className={styles.controls}>
      <NewVistaForm
        onCreate={(name) => {
          const created = create(name);
          setActiveId(created.id);
        }}
      />
      {active && (
        <>
          <button
            className={styles.smallBtn}
            onClick={() => {
              const newName = prompt("Renombrar la vista", active.name);
              if (!newName) return;
              rename(active.id, newName);
            }}
          >
            Renombrar
          </button>
          <button
            className={styles.smallBtn}
            onClick={() => {
              if (!confirm(`¿Eliminar "${active.name}"?`)) return;
              remove(active.id);
            }}
          >
            Borrar
          </button>
        </>
      )}
    </div>
  );
};
