import React from "react";
import styles from "./NavBar.module.css";
import { useActiveVistaContext } from "../hooks/useActiveVistaContext";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const { vistas, activeId, setActiveId } = useActiveVistaContext();

  return (
    <nav className={styles.container} aria-label="vistas-navbar">
      {vistas.map((v) => (
        <button
          key={v.id}
          className={`${styles.button} ${v.id === activeId ? "active" : ""}`}
          onClick={() => setActiveId(v.id)}
          aria-pressed={v.id === activeId}
        >
          {v.name}
        </button>
      ))}
      <div className={styles.spacer} />
    </nav>
  );
};
