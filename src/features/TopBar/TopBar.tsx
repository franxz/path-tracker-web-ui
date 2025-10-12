import React, { type JSX, type ReactNode } from "react";
import styles from "./TopBar.module.css";

export interface TopBarProps {
  content?: ReactNode;
  onConfigClick?: () => void;
}

export default function TopBar({
  content,
  onConfigClick,
}: TopBarProps): JSX.Element {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🧙‍♂️ Vistas 🌬️</h1>
      <div className={styles.vistasContainer}>{content}</div>
      <div className={styles.endSection} onClick={onConfigClick}>
        ⚙️
      </div>
    </div>
  );
}
