import React, { useState, useRef, useEffect } from "react";
import { 
  User, 
  Settings, 
  Shield, 
  LogOut, 
  ChevronDown,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = async (actionName: string) => {
    setIsOpen(false);
    
    if (actionName === "Logout") {
      const toastId = toast.loading("Securely logging you out from Zari & Co...");
      try {
        await logout();
        toast.success("Successfully logged out. Redirecting...", { id: toastId });
      } catch (error: any) {
        toast.error("Logout failed ✕", {
          id: toastId,
          description: error.message || "Network error. Please try again."
        });
      }
    } else {
      toast.success(`Accessing ${actionName}... ✦`, {
        description: "Loading admin preferences and configuration.",
        icon: <Sparkles size={14} className="text-primary animate-pulse" />
      });
    }
  };

  const initials = user
    ? `${user.firstName[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "AD";

  const fullName = user
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Administrator";

  const emailAddress = user?.email || "admin@zariandco.com";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 cursor-pointer pl-4 border-l border-border/80 hover:opacity-95 transition-all select-none"
      >
        {/* Gold avatar circle with initials */}
        <div className="w-9 h-9 rounded-lg bg-[#241e17] border border-[#3b3227] flex items-center justify-center text-primary font-bold text-xs select-none shadow-[0_0_10px_rgba(197,168,128,0.1)] hover:border-primary/50 transition-colors">
          {initials}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold text-foreground leading-none">{fullName}</p>
          <p className="text-[9px] text-muted-foreground mt-0.5 tracking-wider uppercase font-semibold">
            {user?.role || "Administrator"}
          </p>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-muted-foreground hidden md:block transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`} 
        />
      </button>

      {/* Dropdown Menu Portal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-[#12141a]/95 backdrop-blur-md shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Profile Summary Header */}
          <div className="px-4 py-2.5 border-b border-border/40 mb-1">
            <p className="text-xs font-semibold text-foreground">{fullName}</p>
            <p className="text-[10px] text-muted-foreground truncate">{emailAddress}</p>
          </div>

          {/* Menu Items */}
          <button
            onClick={() => handleAction("My Profile")}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-[#241e17]/40 text-left transition-colors cursor-pointer"
          >
            <User size={14} />
            My Profile
          </button>
          
          <button
            onClick={() => handleAction("System Settings")}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-[#241e17]/40 text-left transition-colors cursor-pointer"
          >
            <Settings size={14} />
            System Settings
          </button>

          <button
            onClick={() => handleAction("Security & Audits")}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-[#241e17]/40 text-left transition-colors cursor-pointer"
          >
            <Shield size={14} />
            Security & Audits
          </button>

          {/* Separator */}
          <div className="h-px bg-border/40 my-1" />

          {/* Logout */}
          <button
            onClick={() => handleAction("Logout")}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left transition-colors cursor-pointer font-semibold"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};
