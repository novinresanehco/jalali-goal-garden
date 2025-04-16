
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Plus } from 'lucide-react';
import { formatJalaliDatePersian } from '@/utils/jalaliDate';
import { useAppStore } from '@/store/store';

const Header: React.FC = () => {
  const { openAddModal } = useAppStore();
  const today = new Date();
  const persianDate = formatJalaliDatePersian(today);

  return (
    <header className="bg-white border-b border-border shadow-sm py-3 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">گنسپارک</h1>
        </div>
        
        <div className="text-sm text-muted-foreground hidden md:block">{persianDate}</div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => openAddModal('task')}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>افزودن کار</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
