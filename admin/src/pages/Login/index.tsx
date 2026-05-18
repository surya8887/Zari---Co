import React from "react";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md bg-card p-8 rounded-xl border border-border shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Sign In</h2>
          <p className="text-sm text-muted-foreground">Access the Zari & Co admin panel</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Email address</label>
            <input 
              type="email" 
              placeholder="admin@zariandco.com" 
              className="w-full px-3 py-2 border border-border rounded-md bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/95 text-sm font-medium transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
