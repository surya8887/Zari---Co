import React from "react";
import { AdminLayout } from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

export default App;