import React from "react";

const Products: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your jewelry catalogue and stock levels.</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground text-center py-10">No products configured yet.</p>
      </div>
    </div>
  );
};

export default Products;
