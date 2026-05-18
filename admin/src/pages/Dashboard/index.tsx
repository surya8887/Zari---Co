import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to Zari & Co Admin Control Center.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Metric Cards */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
          <p className="mt-2 text-2xl font-bold">$45,231.89</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <h3 className="text-sm font-medium text-muted-foreground">Sales</h3>
          <p className="mt-2 text-2xl font-bold">+2,350</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <h3 className="text-sm font-medium text-muted-foreground">Active Products</h3>
          <p className="mt-2 text-2xl font-bold">128</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <h3 className="text-sm font-medium text-muted-foreground">Pending Orders</h3>
          <p className="mt-2 text-2xl font-bold">12</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
