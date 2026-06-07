import React from "react";
import { Gem } from "lucide-react";

interface BrandHeaderProps {
  mode: "login" | "register";
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ mode }) => {
  return (
    <div className="text-center space-y-2">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#241e17] border border-[#3b3227] shadow-[0_0_15px_rgba(197,168,128,0.15)] mb-1">
        <Gem size={22} className="text-primary animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">
        {mode === "login" ? "Zari & Co Admin Vault" : "Create Admin Account"}
      </h2>
      <p className="text-xs text-muted-foreground max-w-xs mx-auto">
        {mode === "login" 
          ? "Authorized administrative access key required." 
          : "Register administrative credentials below."}
      </p>
    </div>
  );
};
