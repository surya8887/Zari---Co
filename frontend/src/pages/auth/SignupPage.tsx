import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema } from "@/features/auth/validation";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function SignupPage() {
  const navigate = useNavigate();
  const { register, isLoading, error: apiError, isAuthenticated, loginWithGoogle } = useAuth();

  const handleGoogleSignup = async () => {
    try {
      toast.loading("Authenticating with Google...", { id: "google-auth" });
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const backendResult = await loginWithGoogle(idToken);
      if (backendResult && backendResult.success) {
        toast.success("Successfully registered with Google!", { id: "google-auth" });
      } else {
        toast.error(backendResult?.error || "Google registration failed. Please try again.", { id: "google-auth" });
      }
    } catch (error) {
      toast.error("Google registration failed. Please try again.", { id: "google-auth" });
    }
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const result = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    if (!result.success) {
      const formattedErrors: typeof errors = {};
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof typeof errors;
        formattedErrors[fieldName] = err.message;
      });
      setErrors(formattedErrors);
      setIsSubmitting(false);
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    const authResult = await register({ firstName, lastName, email, phone, password });
    setIsSubmitting(false);

    if (authResult && authResult.success) {
      toast.success("Account created successfully! Welcome to Znira & Co.");
    } else {
      toast.error(authResult?.error || "Registration failed. Please check the details entered.");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f9f7f4] text-[#141414] font-sans overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 items-center justify-center">
        <img
          src="/jewelry_showcase.png"
          alt="Luxury Jewelry Showcase"
          className="absolute inset-0 w-full h-full object-cover opacity-75 object-center mix-blend-luminosity hover:scale-105 transition-transform duration-10000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-900/30 to-neutral-950/50" />
        <div className="absolute inset-8 border border-[#b09d81]/20 pointer-events-none rounded" />
        <div className="absolute inset-10 border border-[#b09d81]/5 pointer-events-none rounded" />

        <div className="relative z-10 text-center px-12 max-w-lg flex flex-col items-center">
          <div className="h-24 w-auto mb-6 flex items-center justify-center">
            <img src="/logo-white.png" alt="Znira & Co" className="h-16 w-auto object-contain" />
          </div>
          <div className="w-12 h-px bg-[#b09d81]/60 mb-6" />
          <h2 className="text-[#fdfdfd] font-serif text-3xl italic tracking-wide mb-4 text-center leading-relaxed">
            Crafted with Elegance, <br />Worn with Pride.
          </h2>
          <p className="text-[#d8d3c9] text-xs uppercase tracking-[0.3em] text-center leading-relaxed max-w-sm">
            Experience the exquisite touch of premium, hand-crafted artisan jewelry.
          </p>
          <div className="absolute bottom-10 text-[9px] uppercase tracking-[0.3em] text-[#b09d81]/50">
            © 2026 Znira & Co. Fine Jewelry
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="flex lg:hidden flex-col items-center mb-8">
            <img src="/logo.png" alt="Znira & Co" className="h-12 w-auto object-contain mb-1" />
            <div className="w-8 h-px bg-[#b09d81]/60 mt-2" />
          </div>

          <Card className="w-full bg-white border border-[#b09d81]/15 shadow-xl shadow-[#6d5b43]/5 rounded-2xl p-6 sm:p-8">
            <CardHeader className="space-y-1.5 p-0 mb-6 text-center">
              <CardTitle className="text-2xl font-serif font-bold text-[#6d5b43] italic tracking-wide">
                Create Account
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500 tracking-wide">
                Register to explore the world of fine handcrafted jewelry
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                {apiError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Jane"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`h-10 transition-all border ${
                        errors.firstName ? "border-red-500 focus-visible:ring-red-500/20" : "border-neutral-200 focus-visible:border-[#b09d81] focus-visible:ring-[#b09d81]/20"
                      }`}
                      aria-invalid={!!errors.firstName}
                    />
                    {errors.firstName && (
                      <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-0.5">
                        <AlertCircle className="w-3 h-3" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`h-10 transition-all border ${
                        errors.lastName ? "border-red-500 focus-visible:ring-red-500/20" : "border-neutral-200 focus-visible:border-[#b09d81] focus-visible:ring-[#b09d81]/20"
                      }`}
                      aria-invalid={!!errors.lastName}
                    />
                    {errors.lastName && (
                      <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-0.5">
                        <AlertCircle className="w-3 h-3" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-10 transition-all border ${
                      errors.email ? "border-red-500 focus-visible:ring-red-500/20" : "border-neutral-200 focus-visible:border-[#b09d81] focus-visible:ring-[#b09d81]/20"
                    }`}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-0.5">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Contact Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`h-10 transition-all border ${
                      errors.phone ? "border-red-500 focus-visible:ring-red-500/20" : "border-neutral-200 focus-visible:border-[#b09d81] focus-visible:ring-[#b09d81]/20"
                    }`}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-0.5">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`h-10 pr-10 transition-all border ${
                        errors.password ? "border-red-500 focus-visible:ring-red-500/20" : "border-neutral-200 focus-visible:border-[#b09d81] focus-visible:ring-[#b09d81]/20"
                      }`}
                      aria-invalid={!!errors.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium animate-in fade-in slide-in-from-top-0.5">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="w-full h-10 mt-2 bg-[#b09d81] hover:bg-[#968266] text-white font-semibold uppercase tracking-widest text-[11px] transition-all rounded-lg shadow-md shadow-[#b09d81]/15 hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {(isLoading || isSubmitting) ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Register</span>
                  )}
                </Button>
              </form>

              <div className="relative my-6 flex items-center justify-center">
                <Separator className="bg-[#b09d81]/15" />
                <span className="absolute bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                  Or continue with
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 border border-neutral-200 hover:border-[#b09d81]/40 hover:bg-[#f9f7f4] rounded-lg transition-all flex items-center justify-center gap-2 font-medium tracking-wide text-xs cursor-pointer active:scale-[0.99]"
                onClick={() => handleGoogleSignup()}
              >
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Sign up with Google</span>
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500 tracking-wide">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#b09d81] hover:text-[#968266] transition-colors underline underline-offset-4"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
