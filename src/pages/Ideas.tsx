
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { getIdeas } from '@/services/firestoreService';
import { Idea } from '@/lib/models';
import { useAppStore } from '@/store/store';

const Ideas: React.FC = () => {
  const [ideas, setIdeas] = React.useState<Idea[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { openAddModal } = useAppStore();

  React.useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const data = await getIdeas();
        setIdeas(data);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ایده‌ها</h1>
        <Button onClick={() => openAddModal('idea')} className="flex items-center gap-1">
          <PlusIcon className="h-4 w-4" />
          <span>افزودن ایده</span>
        </Button>
      </div>
      
      {isLoading ? (
        <p>در حال بارگذاری...</p>
      ) : ideas.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <Card key={idea.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{idea.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{idea.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    idea.status === 'Captured' ? 'bg-blue-100 text-blue-700' :
                    idea.status === 'Exploring' ? 'bg-purple-100 text-purple-700' :
                    idea.status === 'Actionable' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {idea.status === 'Captured' ? 'ثبت‌شده' :
                     idea.status === 'Exploring' ? 'در حال بررسی' :
                     idea.status === 'Actionable' ? 'قابل اجرا' :
                     'رد شده'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="mb-4 text-muted-foreground">هنوز ایده‌ای ثبت نشده است.</p>
            <Button onClick={() => openAddModal('idea')} variant="outline">
              افزودن اولین ایده
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Ideas;
