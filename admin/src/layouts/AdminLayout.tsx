import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-primary mb-8">Zari & Co</h2>
          <nav className="space-y-2">
            <a 
              href="#" 
              className="block px-4 py-2 rounded-md bg-accent text-accent-foreground font-medium transition-colors"
            >
              Dashboard
            </a>
            <a 
              href="#" 
              className="block px-4 py-2 rounded-md hover:bg-accent text-accent-foreground/80 hover:text-accent-foreground font-medium transition-colors"
            >
              Products
            </a>
            <a 
              href="#" 
              className="block px-4 py-2 rounded-md hover:bg-accent text-accent-foreground/80 hover:text-accent-foreground font-medium transition-colors"
            >
              Orders
            </a>
          </nav>
        </div>
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              A
            </div>
            <div>
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@zariandco.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card px-8 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Admin Portal</h1>
        </header>
        <main className="p-8 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};
