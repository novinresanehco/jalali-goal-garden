
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusIcon, Calendar, ArrowUpIcon, ArrowDownIcon, ArrowRightIcon, Tag } from 'lucide-react';
import { getTasks, completeTask } from '@/services/firestoreService';
import { Task } from '@/lib/models';
import { useAppStore } from '@/store/store';
import { getCurrentJalaliDate, formatJalaliRelativeDate, parseJalaliDate } from '@/utils/jalaliDate';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { openAddModal } = useAppStore();

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCompleteTask = async (taskId: string) => {
    try {
      const today = getCurrentJalaliDate();
      await completeTask(taskId, today);
      
      // Update local state
      setTasks((prevTasks) => 
        prevTasks.map((task) => 
          task.id === taskId 
            ? { ...task, status: 'Done', completionDateJalali: today } 
            : task
        )
      );
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return <ArrowUpIcon className="h-4 w-4 text-priority-high" />;
      case 'Medium':
        return <ArrowRightIcon className="h-4 w-4 text-priority-medium" />;
      case 'Low':
        return <ArrowDownIcon className="h-4 w-4 text-priority-low" />;
      default:
        return null;
    }
  };

  // Filter tasks that are not done
  const todoTasks = tasks.filter(task => task.status === 'ToDo');
  
  // Sort by priority and then by due date
  const sortedTasks = todoTasks.sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3, None: 4 };
    const priorityA = priorityOrder[a.priority];
    const priorityB = priorityOrder[b.priority];
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    const dateA = parseJalaliDate(a.dueDateJalali);
    const dateB = parseJalaliDate(b.dueDateJalali);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">کارها</h1>
        <Button onClick={() => openAddModal('task')} className="flex items-center gap-1">
          <PlusIcon className="h-4 w-4" />
          <span>افزودن کار</span>
        </Button>
      </div>
      
      {isLoading ? (
        <p>در حال بارگذاری...</p>
      ) : sortedTasks.length > 0 ? (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id={`task-${task.id}`}
                    checked={task.status === 'Done'}
                    onCheckedChange={() => handleCompleteTask(task.id!)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <label 
                        htmlFor={`task-${task.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {task.title}
                      </label>
                      {getPriorityIcon(task.priority)}
                    </div>
                    
                    {task.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                    )}
                    
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatJalaliRelativeDate(parseJalaliDate(task.dueDateJalali))}</span>
                      </div>
                      
                      {task.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <span>{task.tags.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    
                    {task.subTasks.length > 0 && (
                      <div className="mt-3 border-t pt-2">
                        <p className="text-xs font-medium mb-1">زیرکارها:</p>
                        <ul className="space-y-1">
                          {task.subTasks.map((subTask, index) => (
                            <li key={index} className="flex items-center gap-2 text-xs">
                              <Checkbox 
                                id={`subtask-${task.id}-${index}`}
                                checked={subTask.done}
                                className="h-3 w-3"
                              />
                              <label 
                                htmlFor={`subtask-${task.id}-${index}`}
                                className={`cursor-pointer ${subTask.done ? 'line-through text-muted-foreground' : ''}`}
                              >
                                {subTask.title}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="mb-4 text-muted-foreground">هنوز کاری ثبت نشده است.</p>
            <Button onClick={() => openAddModal('task')} variant="outline">
              افزودن اولین کار
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tasks;
