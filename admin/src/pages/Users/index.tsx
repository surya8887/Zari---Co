import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/api";
import { Loader2, Shield, User as UserIcon, Settings, Users as UsersIcon } from "lucide-react";

export const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.getAllUsers(1, 100);
      setUsers(response.users);
    } catch (error: any) {
      toast.error("Failed to fetch users", {
        description: error.message || "An error occurred while loading system users."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: "user" | "admin" | "superadmin") => {
    setUpdating(userId);
    try {
      await api.updateUserRole(userId, newRole);
      toast.success("Role Updated Successfully ✦", {
        description: `User role has been changed to ${newRole.toUpperCase()}.`
      });
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error: any) {
      toast.error("Role Update Failed ✕", {
        description: error.message || "You do not have permission to perform this action."
      });
    } finally {
      setUpdating(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "admin":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <Loader2 size={32} className="text-primary animate-spin" />
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Loading System Users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">System Users</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage administrative access and system user roles. Restricted to SuperAdmin.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-[#101216]/80 text-[10px] uppercase tracking-wider text-muted-foreground font-bold border-b border-border">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#241e17] border border-[#3b3227] flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {user.firstName ? user.firstName[0] : <UserIcon size={14} />}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-xs">{user.firstName} {user.lastName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getRoleBadgeColor(user.role)}`}>
                      {user.role === "superadmin" && <Shield size={10} />}
                      {user.role === "admin" && <Settings size={10} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {updating === user.id ? (
                        <Loader2 size={16} className="animate-spin text-primary" />
                      ) : (
                        <select
                          className="bg-[#0a0c0f] border border-border text-xs rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                        >
                          <option value="user">User (Customer)</option>
                          <option value="admin">Admin</option>
                          <option value="superadmin">SuperAdmin</option>
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                      <UsersIcon size={24} className="opacity-50" />
                      <p className="text-xs">No users found in the system.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
