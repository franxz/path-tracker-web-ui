import React, { useState } from "react";
import styles from "./VistasManager.module.css";
import { useActiveVistaContext } from "../hooks/useActiveVistaContext";
import { NewComponentForm } from "./VistaComponents/NewComponentForm/NewComponentForm";
import { VistaComponentRenderer } from "./VistaComponents/VistaComponentRenderer";
import { Modal } from "../../ui/Modal";
import { Window } from "../../Window/Window";

interface VistaProps {}

export const Vista: React.FC<VistaProps> = ({}) => {
  const { active, addComponent } = useActiveVistaContext();
  const [openControls, setOpenControls] = useState(false);

  if (!active) return;
  const widgets = active.components || [];

  return (
    <div className={styles.card}>
      <Modal
        open={openControls}
        onClose={() => {
          setOpenControls(false);
        }}
      >
        <NewComponentForm />
      </Modal>
      <div style={{ display: "flex" }}>
        <h3>{active.name}</h3>
        <button
          className={styles.smallBtn}
          onClick={() => setOpenControls(true)}
        >
          ➕
        </button>
      </div>
      <div className={styles.content}>
        {widgets.length === 0 && (
          <p className={styles.empty}>
            Esta es una vista vacía. Agregá un componente para empezar.
          </p>
        )}
        {widgets.map((widget) => (
          <Window
            title={widget.config.title}
            onMaximize={() => {
              addComponent(active.id, {
                ...widget,
                showSetup: true,
              });
            }}
            onClose={() => alert("eliminar")}
            onMinimize={() => alert("minimizar")}
          >
            <VistaComponentRenderer key={widget.id} comp={{ ...widget }} />
          </Window>
        ))}
        <small>Creada: {new Date(active.createdAt).toLocaleString()}</small>
      </div>
    </div>
  );
};
