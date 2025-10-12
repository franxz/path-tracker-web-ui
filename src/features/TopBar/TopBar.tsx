import React, { type JSX } from "react";
import styles from "./TopBar.module.css";
import { VistasManager } from "../vistas";

export interface TopBarProps {}

export default function TopBar({}: TopBarProps): JSX.Element {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🧙‍♂️ Vistas 🌬️</h1>
      <div className={styles.vistasContainer}>
        vista de prueba
      </div>
      <div className={styles.endSection}>⚙️</div>
    </div>
  );
}
