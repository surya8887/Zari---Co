import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { LoginSchema } from "@/utils/validation";
import { GoogleLogin } from "@react-oauth/google";
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
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              loginWithGoogle(credentialResponse.credential).then(() => {
                toast.success("Welcome Back to Zari & Co! ✦", {
                  description: "Google Administrative credentials verified.",
                  icon: <Sparkles size={14} className="text-primary animate-pulse" />
                });
              }).catch((error) => {
                toast.error("Google Authentication Failed ✕", {
                  description: error.message || "Unauthorized Google account."
                });
              });
            }
          }}
          onError={() => {
            toast.error("Google Login Failed", { description: "An error occurred with Google login." });
          }}
          useOneTap
          theme="filled_black"
          shape="rectangular"
          text="signin_with"
        />
      </div>
    </form>
  );
};
