'use client';

import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function NotificationMenu() {
  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className='cursor-pointer'>
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem disabled className="text-muted-foreground text-sm">
          You are all caught up.
        </DropdownMenuItem>
      </DropdownMenuContent>

    </DropdownMenu>
  );
}