import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, PieChart,
  Wallet, Target, Lightbulb, HelpCircle,
  Moon, Sun, Menu, X, ChevronDown, LogOut, User
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/reports', icon: PieChart, label: 'Reports' },
  { to: '/budget', icon: Wallet, label: 'Budget' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/insights', icon: Lightbulb, label: 'Insights' },
];

export default function AppShell() {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-5 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold text-foreground tracking-tight">FinFlow</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors",
                  active
                    ? "bg-primary/10 text-primary font-medium border-l-3 border-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-sidebar-border">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-muted-foreground hover:bg-sidebar-accent transition-colors">
              <HelpCircle className="w-4.5 h-4.5" />
              Help & Support
            </a>
          </div>
        </nav>

        {/* Role switcher */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="relative">
            <label className="text-xs text-muted-foreground font-body mb-1 block">Role</label>
            <div className="flex items-center gap-2">
              <select
                value={state.role}
                onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value as 'viewer' | 'admin' })}
                className="flex-1 bg-sidebar-accent text-sidebar-foreground text-sm rounded-lg px-3 py-2 border-0 focus:ring-2 focus:ring-primary font-body appearance-none cursor-pointer"
              >
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-7 pointer-events-none" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}>
              {state.darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </Button>
            
            {/* Profile Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-8 h-8 rounded-full gradient-teal flex items-center justify-center text-primary-foreground text-xs font-bold ml-2 cursor-pointer hover:opacity-90 transition-opacity">
                  JD
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="end">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-teal flex items-center justify-center text-primary-foreground text-sm font-bold">
                      JD
                    </div>
                    <div>
                      <div className="text-sm font-semibold font-body text-popover-foreground">John Doe</div>
                      <div className="text-xs text-muted-foreground font-body">john.doe@email.com</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs font-body px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">{state.role}</span>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-body text-popover-foreground rounded-md hover:bg-secondary transition-colors">
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-body text-popover-foreground rounded-md hover:bg-secondary transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Back to Home
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
