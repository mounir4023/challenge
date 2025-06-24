import { ModeToggle } from "@/components/ui/mode-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserMenu } from "@/components/app/user-menu";
import { NotificationMenu } from "@/components/app/notification-menu";

export function AppHeader({ title }: { title?: string }) {


  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-background">

      {/* Left: Sidebar trigger + Current Page  */}
      <div className="flex items-center gap-3">

        <SidebarTrigger />

        <div className="h-4 w-px bg-border mx-2"></div>

        <span className="font-semibold text-lg">{title}</span>

      </div>

      {/* Right: Dark Mode toggle + User widget */}
      <div className="flex items-center gap-2">

        <ModeToggle />

        <NotificationMenu />

        <UserMenu />

      </div>

    </header>
  )
}