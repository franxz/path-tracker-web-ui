import React, { useState } from "react";
import styles from "./Window.module.css";
import { Button } from "../ui/buttons/Button/Button";

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
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className={styles.window}>
      <div className={styles.titleBar}>
        <span className={styles.title}>{title}</span>
        <div className={styles.controls}>
          {/* <button
            aria-label="Minimizar"
            onClick={() => setIsMinimized(!isMinimized)}
            className={styles.btn}
          >
            ─
          </button> */}
          <Button size="sm" onClick={() => setIsMinimized(!isMinimized)}>
            _
          </Button>
          {/* <button
            aria-label="Maximizar"
            onClick={onMaximize}
            className={styles.btn}
          >
            □
          </button> */}
          <Button size="sm" onClick={onMaximize}>
            ⚙️
          </Button>
          {/* <button
            aria-label="Cerrar"
            onClick={onClose}
            className={`${styles.btn} ${styles.close}`}
          >
            <span>✕</span>
          </button> */}
          <Button size="sm" onClick={onClose}>
            ❌
          </Button>
        </div>
      </div>

      {!isMinimized && <div className={styles.content}>{children}</div>}
    </div>
  );
};
