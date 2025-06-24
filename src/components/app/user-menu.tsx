'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

function signOut () {
    toast.info("User signed out!")
}

export function UserMenu() {

  const user = {
    image: "/avatar.png",
    name: "John Doe",
    email: "john@doe.com",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer rounded-md">
          <AvatarImage src={user.image ?? ''} alt={user.name ?? user.email} />
          <AvatarFallback className='rounded-md'>{(user.name || user.email)[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">

        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="w-9 h-9 rounded-md">
            <AvatarImage src={user.image ?? ''} alt={user.name ?? user.email} />
            <AvatarFallback className='rounded-md'>{(user.name || user.email)[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={async () => {
            signOut();
          }}
          className="cursor-pointer flex items-center gap-2"
        >
          <LogOut className="w-4 h-4 mr-7" />
          Logout
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}