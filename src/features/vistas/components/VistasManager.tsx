import React from "react";
import styles from "./VistasManager.module.css";
import { Vista } from "./Vista";
import { useActiveVistaContext } from "../hooks/useActiveVistaContext";

export type VistasManagerProps = {};

export const VistasManager: React.FC = ({}) => {
  const { active } = useActiveVistaContext();

  return (
    <div className={styles.wrapper}>
      {active ? (
        <Vista />
      ) : (
        <div className={styles.card}>
          <p className={styles.empty}>
            No hay vistas. Crea la primera vista para empezar.
          </p>
        </div>
      )}
    </div>
  );
};
