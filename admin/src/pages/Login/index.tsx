import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Gem, Eye, EyeOff, Loader2, Sparkles, UserPlus, LogIn } from "lucide-react";
import { toast } from "sonner";

const Login: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "login") {
      if (!email.trim() || !password.trim()) {
        toast.warning("Missing Fields", {
          description: "Please complete both the email and password inputs."
        });
        return;
      }

      setIsSubmitting(true);
      const toastId = toast.loading("Authenticating administrative credentials...");

      try {
        await login(email.trim(), password);
        
        toast.success("Welcome Back to Zari & Co! ✦", {
          id: toastId,
          description: "Administrative vault keys verified successfully.",
          icon: <Sparkles size={14} className="text-primary animate-pulse" />
        });
      } catch (error: any) {
        toast.error("Authentication Failed ✕", {
          id: toastId,
          description: error.message || "Invalid credentials or network failure. Please verify connection."
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (!firstName.trim() || !email.trim() || !password.trim()) {
        toast.warning("Missing Fields", {
          description: "First Name, Email, and Password are required fields."
        });
        return;
      }

      setIsSubmitting(true);
      const toastId = toast.loading("Registering new administrator account...");

      try {
        await register({
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
          email: email.trim(),
          password: password,
          phone: phone.trim() || undefined
        });

        toast.success("Registration Successful! ✦", {
          id: toastId,
          description: "Your administrator account has been created and registered.",
          icon: <Sparkles size={14} className="text-primary animate-pulse" />
        });
      } catch (error: any) {
        toast.error("Registration Failed ✕", {
          id: toastId,
          description: error.message || "Registration rejected. Check validation schemas."
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleModeSwitch = (newMode: "login" | "register") => {
    setMode(newMode);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07080a] relative overflow-hidden font-sans p-4">
      {/* Decorative Premium Radial Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[40rem] h-[40rem] bg-[#a07c55]/5 rounded-full blur-3xl opacity-30 pointer-events-none" />

      {/* Glassmorphic Obsidian Card */}
      <div className="w-full max-w-md bg-[#101216]/65 border border-border/80 p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative z-10 space-y-6">
        
        {/* Brand Logo & Header */}
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

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#0a0c0f]/80 rounded-lg border border-border/50">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleModeSwitch("login")}
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
            onClick={() => handleModeSwitch("register")}
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

        {/* Credentials Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Registration Extra Fields */}
          {mode === "register" && (
            <div className="grid grid-cols-2 gap-3">
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                  First Name *
                </label>
                <input 
                  type="text" 
                  required
                  disabled={isSubmitting}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Sarah" 
                  className="w-full px-3 py-2 border border-border bg-[#0a0c0f]/50 text-foreground rounded-lg text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all disabled:opacity-50" 
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                  Last Name
                </label>
                <input 
                  type="text" 
                  disabled={isSubmitting}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Jenkins" 
                  className="w-full px-3 py-2 border border-border bg-[#0a0c0f]/50 text-foreground rounded-lg text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all disabled:opacity-50" 
                />
              </div>
            </div>
          )}

          {/* Email address */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
              {mode === "register" ? "Secure Email Address *" : "Secure Email Address"}
            </label>
            <input 
              type="email" 
              required
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@zariandco.com" 
              className="w-full px-3 py-2.5 border border-border bg-[#0a0c0f]/50 text-foreground rounded-lg text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all disabled:opacity-50" 
            />
          </div>

          {/* Phone Field (Register only) */}
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                Contact Phone
              </label>
              <input 
                type="tel" 
                disabled={isSubmitting}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834" 
                className="w-full px-3 py-2.5 border border-border bg-[#0a0c0f]/50 text-foreground rounded-lg text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all disabled:opacity-50" 
              />
            </div>
          )}

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                {mode === "register" ? "Access Token Password * (Min 6)" : "Access Token Password"}
              </label>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                className="w-full pl-3 pr-10 py-2.5 border border-border bg-[#0a0c0f]/50 text-foreground rounded-lg text-xs placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all disabled:opacity-50" 
              />
              <button
                type="button"
                tabIndex={-1}
                disabled={isSubmitting}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Submit Sign In/Register button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-primary/10 disabled:opacity-60 disabled:cursor-not-allowed mt-6 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {mode === "login" ? "Authenticating..." : "Registering..."}
              </>
            ) : (
              mode === "login" ? "Access System Panel" : "Create Vault Access"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
