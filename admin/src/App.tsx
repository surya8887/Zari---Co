import React, { useEffect } from "react";
import { AdminLayout } from "./layouts/AdminLayout";
import { Toaster } from "sonner";
import { useAppStore } from "./store";

const App: React.FC = () => {
  const initStore = useAppStore((state) => state.initStore);

  useEffect(() => {
    initStore();
  }, [initStore]);

  return (
    <>
      {/* Global premium styled Sonner notifications provider */}
      <Toaster 
        theme="dark"
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: "#12141a",
            borderColor: "#22252e",
            color: "#f1f5f9",
          },
          descriptionClassName: "text-muted-foreground text-[10px]",
        }}
      />
      
      {/* Premium Obsidian & Gold Layout wrapping our state-based router pages */}
      <AdminLayout />
    </>
  );
};

export default App;