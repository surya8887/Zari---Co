import React from "react";

const Orders: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">Monitor client transactions and fulfillment.</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground text-center py-10">No orders placed yet.</p>
      </div>
    </div>
  );
};

export default Orders;
