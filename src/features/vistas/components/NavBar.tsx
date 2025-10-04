import React from 'react';
import styles from './NavBar.module.css';
import type { Vista } from '../types';

interface Props {
  vistas: Vista[];
  activeId?: string | null;
  onSelect: (id: string) => void;
}

export const NavBar: React.FC<Props> = ({ vistas, activeId, onSelect }) => {
  return (
    <nav className={styles.container} aria-label="vistas-navbar">
      {vistas.map((v) => (
        <button
          key={v.id}
          className={`${styles.button} ${v.id === activeId ? 'active' : ''}`}
          onClick={() => onSelect(v.id)}
          aria-pressed={v.id === activeId}
        >
          {v.name}
        </button>
      ))}
      <div className={styles.spacer} />
    </nav>
  );
};