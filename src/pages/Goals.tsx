
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { getGoals } from '@/services/firestoreService';
import { Goal } from '@/lib/models';
import { useAppStore } from '@/store/store';

const Goals: React.FC = () => {
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { openAddModal } = useAppStore();

  React.useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getGoals();
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">اهداف</h1>
        <Button onClick={() => openAddModal('goal')} className="flex items-center gap-1">
          <PlusIcon className="h-4 w-4" />
          <span>افزودن هدف</span>
        </Button>
      </div>
      
      {isLoading ? (
        <p>در حال بارگذاری...</p>
      ) : goals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <Card key={goal.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{goal.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    goal.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                    goal.status === 'Achieved' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {goal.status === 'Active' ? 'فعال' :
                     goal.status === 'Achieved' ? 'موفق' :
                     'در انتظار'}
                  </span>
                  <span className="text-muted-foreground">تاریخ هدف: {goal.targetDateJalali}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="mb-4 text-muted-foreground">هنوز هدفی ثبت نشده است.</p>
            <Button onClick={() => openAddModal('goal')} variant="outline">
              افزودن اولین هدف
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Goals;
