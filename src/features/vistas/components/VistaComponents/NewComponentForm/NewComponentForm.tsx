import React from "react";
import styles from "../../VistasManager.module.css";
import {
  createAlmanaqueComponent,
  createAlmanaqueMensualComponent,
  createNotasComponent,
  createPathTrackerComponent,
} from "./handlers/vistaHandlers";
import { useActiveVistaContext } from "../../../hooks/useActiveVistaContext";
import type {
  ComponentType,
  VistaComponent,
} from "../../../../../types/global";

export const NewComponentForm: React.FC = () => {
  const { active, addComponent } = useActiveVistaContext();

  const handleAddComponent = (type: ComponentType) => {
    if (!active) return;
    const title = prompt("Título:");
    if (!title) return;
    const handlerMap: Record<ComponentType, () => VistaComponent> = {
      notas: () => createNotasComponent(title),
      almanaque: () => createAlmanaqueComponent(title),
      pathtracker: () => createPathTrackerComponent(title),
      almanaquemensual: () => createAlmanaqueMensualComponent(title),
    };
    addComponent(active.id, handlerMap[type]());
  };

  return (
    <div className={styles.container}>
      {active && (
        <>
          <button
            className={styles.smallBtn}
            onClick={() => handleAddComponent("notas")}
          >
            + Lista de notas
          </button>
          <button
            className={styles.smallBtn}
            onClick={() => handleAddComponent("almanaque")}
          >
            + Almanaque semanal
          </button>
          <button
            className={styles.smallBtn}
            onClick={() => handleAddComponent("pathtracker")}
          >
            + Path Tracker
          </button>
          <button
            className={styles.smallBtn}
            onClick={() => handleAddComponent("almanaquemensual")}
          >
            + Almanaque mensual
          </button>
        </>
      )}
    </div>
  );
};
