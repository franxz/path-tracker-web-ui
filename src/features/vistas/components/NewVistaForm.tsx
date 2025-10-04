import React, { useState } from 'react';
import styles from './NewVistaForm.module.css';

interface Props {
  onCreate: (name: string) => void;
}

export const NewVistaForm: React.FC<Props> = ({ onCreate }) => {
  const [name, setName] = useState('');

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName('');
  };

  return (
    <form onSubmit={submit} className={styles.form} aria-label="new-vista-form">
      <input
        className={styles.input}
        placeholder="Nombre de la vista"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" className={styles.button} aria-label="crear-vista">
        Crear
      </button>
    </form>
  );
};