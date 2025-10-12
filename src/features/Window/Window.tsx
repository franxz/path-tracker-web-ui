import React from "react";
import styles from "./Window.module.css";

interface WindowProps {
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export const Window: React.FC<WindowProps> = ({
  title = "Ventana sin título",
  children,
  onClose,
  onMinimize,
  onMaximize,
}) => {
  return (
    <div className={styles.window}>
      <div className={styles.titleBar}>
        <span className={styles.title}>{title}</span>
        <div className={styles.controls}>
          <button
            aria-label="Minimizar"
            onClick={onMinimize}
            className={styles.btn}
          >
            ─
          </button>
          <button
            aria-label="Maximizar"
            onClick={onMaximize}
            className={styles.btn}
          >
            □
          </button>
          <button
            aria-label="Cerrar"
            onClick={onClose}
            className={`${styles.btn} ${styles.close}`}
          >
            <span>✕</span>
          </button>
        </div>
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );
};
