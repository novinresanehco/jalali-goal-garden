
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Lightbulb, 
  FolderKanban, 
  CheckSquare 
} from 'lucide-react';
import Header from '@/components/ui/Header';

const AppLayout: React.FC = () => {
  const navItems = [
    { path: '/', label: 'داشبورد', icon: <LayoutDashboard size={20} /> },
    { path: '/goals', label: 'اهداف', icon: <Target size={20} /> },
    { path: '/ideas', label: 'ایده‌ها', icon: <Lightbulb size={20} /> },
    { path: '/projects', label: 'پروژه‌ها', icon: <FolderKanban size={20} /> },
    { path: '/tasks', label: 'کارها', icon: <CheckSquare size={20} /> },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden" dir="rtl">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-sidebar border-l border-border overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold font-vazirmatn">گنسپارک</h2>
          </div>
          <nav className="py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center py-3 px-4 gap-3
                  ${isActive ? 'bg-sidebar-accent text-primary font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}
                `}
                end={item.path === '/'}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container py-6 px-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
