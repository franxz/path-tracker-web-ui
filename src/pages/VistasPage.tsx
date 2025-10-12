import React, { useState } from "react";
import TopBar from "../features/TopBar/TopBar";
import PageTemplate from "./PageTemplate";
import { NavBar } from "../features/vistas/components/NavBar";
import { VistasManager } from "../features/vistas/components/VistasManager";
import { ActiveVistaProvider } from "../features/vistas/hooks/useActiveVistaContext";
import { Modal } from "../features/ui/Modal";
import { VistaControls } from "../features/vistas/components/VistaControls/VistaControls";

export const VistasPage: React.FC = () => {
  const [openControls, setOpenControls] = useState(false);

  return (
    <ActiveVistaProvider>
      <PageTemplate
        topBar={
          <TopBar
            content={<NavBar />}
            onConfigClick={() => setOpenControls(true)}
          />
        }
        content={<VistasManager />}
      />
      <Modal
        open={openControls}
        onClose={() => {
          setOpenControls(false);
        }}
      >
        <VistaControls />
      </Modal>
    </ActiveVistaProvider>
  );
};

export default VistasPage;
