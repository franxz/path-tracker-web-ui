import React, { useMemo, useState } from 'react';
import { useVistas } from '../hooks/useVistas';
import { NavBar } from './NavBar';
import { NewVistaForm } from './NewVistaForm';
import styles from './VistasManager.module.css';

export const VistasManager: React.FC = () => {
  const { vistas, create, rename, remove } = useVistas();
  const [activeId, setActiveId] = useState<string | null>(
    () => (vistas.length ? vistas[0].id : null)
  );
  const active = useMemo(() => vistas.find((v) => v.id === activeId) ?? null, [vistas, activeId]);

  // sync active when vistas change
  React.useEffect(() => {
    if (!activeId && vistas.length) {
      setActiveId(vistas[0].id);
    } else if (activeId && !vistas.find((v) => v.id === activeId)) {
      setActiveId(vistas.length ? vistas[0].id : null);
    }
  }, [vistas, activeId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <NavBar vistas={vistas} activeId={activeId} onSelect={(id) => setActiveId(id)} />
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
                  const newName = prompt('Renombrar la vista', active.name);
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
      </div>

      <div className={styles.editor} role="region" aria-label="vista-editor">
        {active ? (
          <div className={styles.card}>
            <h3>{active.name}</h3>
            <p className={styles.empty}>Esta es una vista vacía. En el futuro podrás añadir componentes configurables aquí.</p>
            <small>Creada: {new Date(active.createdAt).toLocaleString()}</small>
          </div>
        ) : (
          <div className={styles.card}>
            <p className={styles.empty}>No hay vistas. Crea la primera vista para empezar.</p>
          </div>
        )}
      </div>
    </div>
  );
};