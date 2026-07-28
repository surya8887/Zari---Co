import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { LoginSchema } from "@/utils/validation";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
  onLogin: (email: string, pass: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    const toastId = toast.loading("Authenticating with Google...");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      await loginWithGoogle(idToken);
      
      toast.success("Welcome Back to Zari & Co! ✦", {
        id: toastId,
        description: "Google Administrative credentials verified.",
        icon: <Sparkles size={14} className="text-primary animate-pulse" />
      });
    } catch (error: any) {
      toast.error("Google Authentication Failed ✕", {
        id: toastId,
        description: error.message || "Unauthorized Google account."
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = LoginSchema.safeParse({ email: email.trim(), password });
    if (!validation.success) {
      toast.warning("Validation Error", {
        description: validation.error.issues[0]?.message
      });
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Authenticating administrative credentials...");

    try {
      await onLogin(email.trim(), password);
      
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
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Email address */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
          Secure Email Address
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

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
            Access Token Password
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

      {/* Submit button */}
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-primary/10 disabled:opacity-60 disabled:cursor-not-allowed mt-6 active:scale-[0.98]"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Authenticating...
          </>
        ) : (
          "Access System Panel"
        )}
      </button>

      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-border/60"></div>
        <span className="px-3 text-xs text-muted-foreground uppercase tracking-wider">Or</span>
        <div className="flex-1 border-t border-border/60"></div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-2.5 rounded-lg hover:bg-gray-100 text-xs font-bold transition-all duration-200 cursor-pointer shadow-md shadow-white/5 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </form>
  );
};
