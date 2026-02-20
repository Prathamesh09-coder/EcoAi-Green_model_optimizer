import { Leaf, LayoutDashboard, GitCompare, Lightbulb, FileText, Settings, Search, Bell, User } from 'lucide-react';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

export function Layout({ children, activeScreen, setActiveScreen }: LayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'models', label: 'Models', icon: Leaf },
    { id: 'comparison', label: 'Comparison', icon: GitCompare },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Green Model Optimizer</h1>
              <p className="text-sm text-gray-500">Eco-AI Platform</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mx-auto max-w-md flex-1 px-8">
            <Search className="absolute left-11 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search models, reports..."
              className="w-full rounded-full border-gray-200 bg-gray-50 pl-9 focus:bg-white"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p>John Doe</p>
                    <p className="text-gray-500">john@ecoai.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Side Navigation */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r bg-white/50 backdrop-blur-sm">
          <nav className="flex flex-col gap-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
