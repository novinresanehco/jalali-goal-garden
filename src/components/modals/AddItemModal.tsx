
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/store/store';
import { 
  addGoal, 
  addIdea, 
  addProject, 
  addTask 
} from '@/services/firestoreService';
import { getCurrentJalaliDate } from '@/utils/jalaliDate';

const AddItemModal: React.FC = () => {
  const { isAddModalOpen, addModalType, closeAddModal } = useAppStore();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [dueDate, setDueDate] = React.useState(getCurrentJalaliDate());
  const [priority, setPriority] = React.useState('Medium');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('');
    setDueDate(getCurrentJalaliDate());
    setPriority('Medium');
  };

  React.useEffect(() => {
    if (isAddModalOpen) {
      // Set default status based on modal type
      switch (addModalType) {
        case 'goal':
          setStatus('Active');
          break;
        case 'idea':
          setStatus('Captured');
          break;
        case 'project':
          setStatus('Planning');
          break;
        case 'task':
          setStatus('ToDo');
          break;
      }
    } else {
      resetForm();
    }
  }, [isAddModalOpen, addModalType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      switch (addModalType) {
        case 'goal':
          await addGoal({
            title,
            description,
            status: status as any,
            targetDateJalali: dueDate,
          });
          break;
        case 'idea':
          await addIdea({
            title,
            description,
            status: status as any,
            tags: [],
          });
          break;
        case 'project':
          await addProject({
            title,
            description,
            type: 'Personal',
            status: status as any,
            deadlineJalali: dueDate,
            tags: [],
          });
          break;
        case 'task':
          await addTask({
            title,
            description,
            status: 'ToDo',
            dueDateJalali: dueDate,
            priority: priority as any,
            isRecurring: false,
            tags: [],
            subTasks: [],
          });
          break;
      }
      
      closeAddModal();
      resetForm();
      
      // Ideally we'd refresh the data here, but for simplicity we'll rely on 
      // the user refreshing the page or implementing a more robust state management
      
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    switch (addModalType) {
      case 'goal':
        return 'افزودن هدف جدید';
      case 'idea':
        return 'افزودن ایده جدید';
      case 'project':
        return 'افزودن پروژه جدید';
      case 'task':
        return 'افزودن کار جدید';
      default:
        return 'افزودن آیتم';
    }
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={closeAddModal}>
      <DialogContent className="rtl">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="عنوان را وارد کنید"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="توضیحات را وارد کنید"
              rows={3}
            />
          </div>
          
          {addModalType === 'task' && (
            <div className="space-y-2">
              <Label htmlFor="priority">اولویت</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="اولویت را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">بالا</SelectItem>
                  <SelectItem value="Medium">متوسط</SelectItem>
                  <SelectItem value="Low">پایین</SelectItem>
                  <SelectItem value="None">بدون اولویت</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {(addModalType === 'goal' || addModalType === 'project' || addModalType === 'task') && (
            <div className="space-y-2">
              <Label htmlFor="dueDate">تاریخ {addModalType === 'goal' ? 'هدف' : addModalType === 'project' ? 'مهلت' : 'سررسید'}</Label>
              <Input 
                id="dueDate" 
                type="text" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                placeholder="YYYY/MM/DD"
                pattern="\d{4}/\d{2}/\d{2}"
              />
              <p className="text-xs text-muted-foreground">فرمت: 1400/01/01</p>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={closeAddModal}
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button 
              type="submit"
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? 'در حال ذخیره...' : 'ذخیره'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
