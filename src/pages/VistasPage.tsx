import React from "react";
import { VistasManager } from "../features/vistas";
import TopBar from "../features/TopBar/TopBar";
import PageTemplate from "./PageTemplate";

export const VistasPage: React.FC = () => {
  return (
    <PageTemplate
      topBar={<TopBar />}
      content={
        <div
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <VistasManager />
        </div>
      }
    />
  );
};

export default VistasPage;
