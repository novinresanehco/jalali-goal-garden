
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { getProjects } from '@/services/firestoreService';
import { Project } from '@/lib/models';
import { useAppStore } from '@/store/store';

const Projects: React.FC = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { openAddModal } = useAppStore();

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">پروژه‌ها</h1>
        <Button onClick={() => openAddModal('project')} className="flex items-center gap-1">
          <PlusIcon className="h-4 w-4" />
          <span>افزودن پروژه</span>
        </Button>
      </div>
      
      {isLoading ? (
        <p>در حال بارگذاری...</p>
      ) : projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                {project.clientName && (
                  <p className="text-sm text-muted-foreground">مشتری: {project.clientName}</p>
                )}
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.status === 'Planning' ? 'bg-purple-100 text-purple-700' :
                    project.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                    project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status === 'Planning' ? 'برنامه‌ریزی' :
                     project.status === 'Active' ? 'در حال اجرا' :
                     project.status === 'Completed' ? 'تکمیل‌شده' :
                     'بایگانی‌شده'}
                  </span>
                  <span className="text-muted-foreground">تاریخ مهلت: {project.deadlineJalali}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="mb-4 text-muted-foreground">هنوز پروژه‌ای ثبت نشده است.</p>
            <Button onClick={() => openAddModal('project')} variant="outline">
              افزودن اولین پروژه
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Projects;
