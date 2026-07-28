import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { BrandHeader } from "./components/BrandHeader";
import { LoginForm } from "./components/LoginForm";

const Login: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07080a] relative overflow-hidden font-sans p-4 font-normal select-none">
      {/* Decorative Premium Radial Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[40rem] h-[40rem] bg-[#a07c55]/5 rounded-full blur-3xl opacity-30 pointer-events-none" />

      {/* Glassmorphic Obsidian Card */}
      <div className="w-full max-w-md bg-[#101216]/65 border border-border/80 p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative z-10 space-y-6">
        
        {/* Brand Logo & Header */}
        <BrandHeader />

        {/* Credentials Form */}
        <LoginForm onLogin={login} />
      </div>
    </div>
  );
};

export default Login;
