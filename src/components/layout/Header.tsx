import { Search, Plus, Command, LogOut } from 'lucide-react'
import { UserButton } from '@clerk/tanstack-react-start'
import { useUIStore } from '@/stores/ui-store'
import { USE_MOCKS, mockSignOut } from '@/lib/mock'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function MockUserButton() {
  const handleSignOut = () => {
    mockSignOut()
    window.location.href = '/sign-in'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
          D
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Header() {
  const { openCommandPalette, openModal } = useUIStore()

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b bg-card">
      {/* Search / Command palette trigger */}
      <button
        onClick={openCommandPalette}
        className="flex items-center gap-2 h-9 px-3 text-sm text-muted-foreground bg-muted rounded-md hover:bg-accent transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium bg-background rounded border">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Quick add task */}
        <button
          onClick={() => openModal('quick-add-task')}
          className="flex items-center gap-2 h-9 px-3 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Task</span>
        </button>

        {/* User menu */}
        {USE_MOCKS ? (
          <MockUserButton />
        ) : (
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8',
              },
            }}
          />
        )}
      </div>
    </header>
  )
}
