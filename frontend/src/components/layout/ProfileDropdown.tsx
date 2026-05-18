import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, MapPin, Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    if (firstName) return firstName.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none bg-[#faf9f6] border border-[#8b7355]/15 pl-2 pr-3 py-1 rounded-full shadow-sm hover:border-[#8b7355]/40 transition-colors">
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-[#8b7355] text-white text-[11px] font-medium tracking-wider">
            {getInitials(user?.firstName, user?.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-[10px] text-[#8b7355] font-extrabold uppercase tracking-widest leading-tight mt-0.5">
            Hi, {user?.firstName || 'User'}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal py-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-neutral-800 leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs leading-none text-neutral-500 mt-1">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="py-1">
          <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer text-neutral-700 py-2.5">
            <User className="mr-3 h-4 w-4 text-neutral-400" />
            <span className="text-xs font-medium">Manage Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/orders')} className="cursor-pointer text-neutral-700 py-2.5">
            <ShoppingBag className="mr-3 h-4 w-4 text-neutral-400" />
            <span className="text-xs font-medium">My Orders</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/wishlist')} className="cursor-pointer text-neutral-700 py-2.5">
            <Heart className="mr-3 h-4 w-4 text-neutral-400" />
            <span className="text-xs font-medium">Wishlist</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/addresses')} className="cursor-pointer text-neutral-700 py-2.5">
            <MapPin className="mr-3 h-4 w-4 text-neutral-400" />
            <span className="text-xs font-medium">Saved Addresses</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer text-neutral-700 py-2.5">
            <Settings className="mr-3 h-4 w-4 text-neutral-400" />
            <span className="text-xs font-medium">Account Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 py-2.5 my-1 rounded-sm">
          <LogOut className="mr-3 h-4 w-4" />
          <span className="text-xs font-medium">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
