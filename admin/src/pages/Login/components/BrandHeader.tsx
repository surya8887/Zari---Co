import React from "react";
import { Gem } from "lucide-react";

export const BrandHeader: React.FC = () => {
  return (
    <div className="text-center space-y-2">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#241e17] border border-[#3b3227] shadow-[0_0_15px_rgba(197,168,128,0.15)] mb-1">
        <Gem size={22} className="text-primary animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">
        Zari & Co Admin Vault
      </h2>
      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
        Authorized administrative access key required.
      </p>
    </div>
  );
};
