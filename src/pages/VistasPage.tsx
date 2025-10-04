import React from "react";
import { VistasManager } from "../features/vistas";

export const VistasPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>🧙‍♂️ Vistas 🌬️</h1>
      <div
        style={{
          height: "100vh",
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <VistasManager />
      </div>
    </div>
  );
};

export default VistasPage;
