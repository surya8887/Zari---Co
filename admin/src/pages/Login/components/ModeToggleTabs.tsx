import React from "react";
import { LogIn, UserPlus } from "lucide-react";

interface ModeToggleTabsProps {
  mode: "login" | "register";
  isSubmitting: boolean;
  onModeChange: (mode: "login" | "register") => void;
}

export const ModeToggleTabs: React.FC<ModeToggleTabsProps> = ({
  mode,
  isSubmitting,
  onModeChange
}) => {
  return (
    <div className="grid grid-cols-2 p-1 bg-[#0a0c0f]/80 rounded-lg border border-border/50 select-none">
      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => onModeChange("login")}
        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
          mode === "login"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <LogIn size={13} />
        Sign In
      </button>
      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => onModeChange("register")}
        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
          mode === "register"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <UserPlus size={13} />
        Register
      </button>
    </div>
  );
};
