
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Lightbulb, 
  Briefcase, 
  CheckSquare,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatJalaliDatePersian } from '@/utils/jalaliDate';
import { useAppStore } from '@/store/store';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AppLayout: React.FC = () => {
  const { openAddModal } = useAppStore();
  const today = new Date();
  const persianDate = formatJalaliDatePersian(today);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'داشبورد امروز', icon: <LayoutDashboard size={20} /> },
    { path: '/tasks', label: 'وظایف', icon: <CheckSquare size={20} /> },
    { path: '/projects', label: 'پروژه‌ها', icon: <Briefcase size={20} /> },
    { path: '/goals', label: 'اهداف', icon: <Target size={20} /> },
    { path: '/ideas', label: 'ایده‌ها', icon: <Lightbulb size={20} /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm py-3 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
            <h1 className="text-xl font-semibold">گنسپارک</h1>
          </div>
          
          <div className="md:flex items-center gap-4 hidden">
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="جستجو..." 
                className="pr-10 bg-gray-50" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground hidden md:block">{persianDate}</div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    ۳
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>اعلان‌ها</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-sm">کار «تماس با مشتری» تأخیر دارد</p>
                      <span className="text-xs text-muted-foreground">۲ روز پیش</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-sm">پروژه «طراحی سایت» بروزرسانی شد</p>
                      <span className="text-xs text-muted-foreground">دیروز</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-sm">۳ کار برای امروز دارید</p>
                      <span className="text-xs text-muted-foreground">۲ ساعت پیش</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={() => openAddModal('task')}
              className="flex items-center gap-1 md:hidden"
              size="sm"
            >
              <span>+</span>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="w-64 bg-sidebar border-l border-border overflow-y-auto hidden md:block">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold font-vazirmatn">مرکز بهره‌وری شخصی</h2>
            <p className="text-xs text-muted-foreground mt-1">سیستم مدیریت اهداف و وظایف</p>
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
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-y-0 right-0 w-3/4 bg-white shadow-lg">
              <div className="p-5 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">مرکز بهره‌وری شخصی</h2>
                  <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="relative w-full mb-4">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="جستجو..." 
                    className="pr-10 bg-gray-50" 
                  />
                </div>
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
                    onClick={toggleMobileMenu}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}
        
        {/* Main Content */}
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
