
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  PlusIcon, 
  CheckCircle, 
  Target, 
  Briefcase, 
  AlertTriangle,
  MoreVertical,
  Calendar
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getTodayTasks, getOverdueTasks, getActiveTasks, completeTask } from '@/services/firestoreService';
import { getCurrentJalaliDate, formatJalaliRelativeDate, parseJalaliDate } from '@/utils/jalaliDate';
import { Task, Project } from '@/lib/models';
import { useAppStore } from '@/store/store';

const Dashboard: React.FC = () => {
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [activeProjects, setActiveProjects] = useState<number>(0);
  const [activeGoals, setActiveGoals] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { openAddModal } = useAppStore();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const today = getCurrentJalaliDate();
        
        // Fetch today's tasks
        const todayTasksData = await getTodayTasks(today);
        setTodayTasks(todayTasksData);
        
        // Fetch overdue tasks
        const overdueTasksData = await getOverdueTasks(today);
        setOverdueTasks(overdueTasksData);
        
        // Fetch active projects count
        const activeProjectsData = await getActiveTasks('projects', 'Active');
        setActiveProjects(activeProjectsData.length);
        
        // Fetch active goals count
        const activeGoalsData = await getActiveTasks('goals', 'Active');
        setActiveGoals(activeGoalsData.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCompleteTask = async (taskId: string) => {
    try {
      const today = getCurrentJalaliDate();
      await completeTask(taskId, today);
      
      // Update local state
      setTodayTasks((prevTasks) => 
        prevTasks.filter((task) => task.id !== taskId)
      );
      setOverdueTasks((prevTasks) => 
        prevTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-amber-100 text-amber-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'اولویت بالا';
      case 'Medium':
        return 'اولویت متوسط';
      case 'Low':
        return 'اولویت پایین';
      default:
        return 'بدون اولویت';
    }
  };

  // Function to render task list
  const renderTaskList = (tasks: Task[], isOverdue: boolean = false) => {
    if (tasks.length === 0) {
      return (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">
              {isOverdue ? 'هیچ کار تأخیری ندارید.' : 'هیچ کاری برای امروز ندارید.'}
            </p>
          </CardContent>
        </Card>
      );
    }

    return tasks.map((task) => (
      <Card key={task.id} className="mb-3 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox 
              id={`task-${task.id}`}
              checked={task.status === 'Done'}
              onCheckedChange={() => handleCompleteTask(task.id!)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <label 
                    htmlFor={`task-${task.id}`}
                    className="font-medium cursor-pointer text-lg"
                  >
                    {task.title}
                  </label>
                  {task.projectId && (
                    <p className="text-sm text-muted-foreground mt-1">
                      مربوط به: پروژه‌ای
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(task.priority)}`}>
                    {getPriorityText(task.priority)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>ویرایش</DropdownMenuItem>
                      <DropdownMenuItem>تغییر تاریخ</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">حذف</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {isOverdue 
                    ? `${formatJalaliRelativeDate(parseJalaliDate(task.dueDateJalali))} (${Math.floor((Date.now() - parseJalaliDate(task.dueDateJalali).getTime()) / (1000 * 60 * 60 * 24))} روز تاخیر)`
                    : formatJalaliRelativeDate(parseJalaliDate(task.dueDateJalali))
                  }
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">داشبورد امروز</h1>
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-28 animate-pulse bg-muted"></Card>
          ))}
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/goals?status=Active">
              <Card className="h-28 hover:shadow-md transition-shadow duration-200 cursor-pointer border-l-4 border-l-green-500">
                <CardContent className="p-4 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm">اهداف در حال انجام</h3>
                    <Target className="text-green-500 h-5 w-5" />
                  </div>
                  <p className="text-3xl font-bold">{activeGoals}</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/projects?status=Active">
              <Card className="h-28 hover:shadow-md transition-shadow duration-200 cursor-pointer border-l-4 border-l-amber-500">
                <CardContent className="p-4 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm">پروژه‌های فعال</h3>
                    <Briefcase className="text-amber-500 h-5 w-5" />
                  </div>
                  <p className="text-3xl font-bold">{activeProjects}</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/tasks?filter=overdue">
              <Card className="h-28 hover:shadow-md transition-shadow duration-200 cursor-pointer border-l-4 border-l-red-500">
                <CardContent className="p-4 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm">وظایف تأخیری</h3>
                    <AlertTriangle className="text-red-500 h-5 w-5" />
                  </div>
                  <p className="text-3xl font-bold">{overdueTasks.length}</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/tasks?filter=today">
              <Card className="h-28 hover:shadow-md transition-shadow duration-200 cursor-pointer border-l-4 border-l-gray-700">
                <CardContent className="p-4 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm">وظایف امروز</h3>
                    <CheckCircle className="text-gray-700 h-5 w-5" />
                  </div>
                  <p className="text-3xl font-bold">{todayTasks.length}</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Quick Add Task Button */}
          <Button 
            onClick={() => openAddModal('task')} 
            className="flex items-center gap-2 w-full md:w-auto"
            size="lg"
          >
            <PlusIcon className="h-4 w-4" />
            <span>افزودن وظیفه</span>
          </Button>

          {/* Today's Tasks Section */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              وظایف امروز
            </h2>
            {renderTaskList(todayTasks)}
          </div>
          
          {/* Overdue Tasks Section */}
          {overdueTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                وظایف تأخیری
              </h2>
              {renderTaskList(overdueTasks, true)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
