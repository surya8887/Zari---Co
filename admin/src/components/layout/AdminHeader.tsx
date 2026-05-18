import React, { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Bell, 
  Mail, 
  CheckCheck,
  Sparkles,
  MessageSquare
} from "lucide-react";
import { useAppStore } from "@/store";
import { ProfileDropdown } from "./ProfileDropdown";
import { toast } from "sonner";

export const AdminHeader: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    markNotificationsRead,
    messages,
    markMessagesRead
  } = useAppStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Unread counts
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) {
        setShowMessages(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    
    if (localSearch.trim()) {
      toast.success(`Search filter applied: "${localSearch}"`, {
        description: "Filtered dashboard lists and inventory data.",
        duration: 2000
      });
    } else {
      toast.info("Search filter cleared.", { duration: 1500 });
    }
  };

  const handleSearchChange = (val: string) => {
    setLocalSearch(val);
    setSearchQuery(val); // Continuous real-time filtering
  };

  const handleMarkNotificationsRead = () => {
    markNotificationsRead();
    setShowNotifications(false);
    toast.success("All alerts marked as read! ✨");
  };

  const handleMarkMessagesRead = () => {
    markMessagesRead();
    setShowMessages(false);
    toast.success("All messages marked as read! 💬");
  };

  return (
    <header className="h-16 border-b border-border bg-[#101216] px-8 flex items-center justify-between shrink-0 select-none z-40 relative">
      {/* Left search block */}
      <form onSubmit={handleSearchSubmit} className="relative w-72">
        <button type="submit" className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/80 hover:text-primary transition-colors cursor-pointer">
          <Search size={15} />
        </button>
        <input 
          type="text" 
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search product, orders, customers..." 
          className="w-full pl-9 pr-4 py-2 text-xs border border-border bg-[#0d0f14]/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-sans"
        />
      </form>

      {/* Right badges & profile section */}
      <div className="flex items-center gap-4">
        
        {/* Notifications Icon with Popover */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowMessages(false);
            }}
            className={`w-8 h-8 rounded-lg border border-border bg-[#0d0f14]/50 flex items-center justify-center relative hover:bg-secondary/35 text-foreground transition-all cursor-pointer select-none ${showNotifications ? "border-primary/50 text-primary bg-[#241e17]/20" : ""}`}
          >
            <Bell size={15} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[9px] text-[#090a0f] flex items-center justify-center font-bold leading-none animate-pulse shadow-[0_0_8px_rgba(197,168,128,0.5)]">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-[#12141a]/95 backdrop-blur-md shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-border/40 flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles size={12} className="text-primary" />
                  House Notifications
                </span>
                {unreadNotificationsCount > 0 && (
                  <button 
                    onClick={handleMarkNotificationsRead}
                    className="text-[10px] text-primary hover:text-primary/80 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck size={12} />
                    Mark read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-border/20">
                {notifications.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground text-center py-6">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-3 text-left transition-colors ${!n.read ? "bg-[#241e17]/20" : "hover:bg-secondary/20"}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h5 className={`text-xs font-semibold ${!n.read ? "text-primary" : "text-foreground"}`}>
                          {n.title}
                        </h5>
                        <span className="text-[9px] text-muted-foreground shrink-0 font-medium">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Messages Envelope Icon with Popover */}
        <div className="relative" ref={messagesRef}>
          <button 
            onClick={() => {
              setShowMessages(!showMessages);
              setShowNotifications(false);
            }}
            className={`w-8 h-8 rounded-lg border border-border bg-[#0d0f14]/50 flex items-center justify-center relative hover:bg-secondary/35 text-foreground transition-all cursor-pointer select-none ${showMessages ? "border-primary/50 text-primary bg-[#241e17]/20" : ""}`}
          >
            <Mail size={15} />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-[9px] text-white flex items-center justify-center font-bold leading-none animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Messages Dropdown */}
          {showMessages && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-[#12141a]/95 backdrop-blur-md shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-border/40 flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <MessageSquare size={12} className="text-blue-400" />
                  Client Inquiries
                </span>
                {unreadMessagesCount > 0 && (
                  <button 
                    onClick={handleMarkMessagesRead}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck size={12} />
                    Mark read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-border/20">
                {messages.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground text-center py-6">No messages</p>
                ) : (
                  messages.map((m) => (
                    <div 
                      key={m.id} 
                      className={`p-3 text-left transition-colors flex gap-3 ${!m.read ? "bg-[#171e2c]/30" : "hover:bg-secondary/20"}`}
                    >
                      {/* Round metal initials avatar */}
                      <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase shrink-0">
                        {m.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <h5 className={`text-xs font-semibold ${!m.read ? "text-blue-400" : "text-foreground"}`}>
                            {m.sender}
                          </h5>
                          <span className="text-[9px] text-muted-foreground shrink-0 font-medium">{m.time}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate leading-relaxed">
                          {m.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Info block linking to ProfileDropdown */}
        <ProfileDropdown />

      </div>
    </header>
  );
};
