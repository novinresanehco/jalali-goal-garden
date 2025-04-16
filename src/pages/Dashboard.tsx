
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTodayTasks } from '@/services/firestoreService';
import { getCurrentJalaliDate } from '@/utils/jalaliDate';
import { Task } from '@/lib/models';

const Dashboard: React.FC = () => {
  const [todayTasks, setTodayTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTodayTasks = async () => {
      try {
        const today = getCurrentJalaliDate();
        const tasks = await getTodayTasks(today);
        setTodayTasks(tasks);
      } catch (error) {
        console.error('Error fetching today tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayTasks();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">داشبورد</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">کارهای امروز</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>در حال بارگذاری...</p>
            ) : todayTasks.length > 0 ? (
              <ul className="space-y-2">
                {todayTasks.slice(0, 5).map((task) => (
                  <li key={task.id} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full bg-priority-${task.priority.toLowerCase()}`}></span>
                    <span>{task.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">کاری برای امروز ندارید!</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">پروژه‌های فعال</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">هنوز پروژه‌ای ثبت نشده است.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">اهداف دنبال‌شده</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">هنوز هدفی ثبت نشده است.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
