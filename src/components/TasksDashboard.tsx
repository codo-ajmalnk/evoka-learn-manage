import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTasks, Task } from '@/contexts/TasksContext';
import { Calendar, Clock, AlertTriangle, CheckCircle, Play, Edit } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/Calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TasksDashboardProps {
  userId: string;
}

const TasksDashboard: React.FC<TasksDashboardProps> = ({ userId }) => {
  const { getTasksByTutor, updateTask } = useTasks();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  const userTasks = useMemo(() => {
    return getTasksByTutor(userId);
  }, [getTasksByTutor, userId]);

  const stats = useMemo(() => {
    const total = userTasks.length;
    const pending = userTasks.filter(task => task.status === 'pending').length;
    const inProgress = userTasks.filter(task => task.status === 'in-progress').length;
    const completed = userTasks.filter(task => task.status === 'completed').length;
    const overdue = userTasks.filter(task => {
      if (task.status === 'completed') return false;
      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
      return dueDateTime < new Date();
    }).length;

    return { total, pending, inProgress, completed, overdue };
  }, [userTasks]);

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { 
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
    });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'in-progress': return Play;
      case 'completed': return CheckCircle;
      case 'overdue': return AlertTriangle;
      default: return Clock;
    }
  };

  if (userTasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No tasks assigned yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Tasks will appear here once they are assigned to you.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'calendar')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-semibold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-lg font-semibold text-yellow-600">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Play className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-lg font-semibold text-blue-600">{stats.inProgress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-lg font-semibold text-green-600">{stats.completed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue</p>
                    <p className="text-lg font-semibold text-red-600">{stats.overdue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Assigned Tasks</h3>
            
            {userTasks.map((task) => {
              const StatusIcon = getStatusIcon(task.status);
              const isOverdue = task.status !== 'completed' && 
                new Date(`${task.dueDate}T${task.dueTime}`) < new Date();
              
              return (
                <Card key={task.id} className={isOverdue ? 'border-red-200 bg-red-50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.dueTime}
                          </span>
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                          </span>
                        </div>
                        
                        {task.notes && (
                          <div className="bg-muted p-2 rounded text-sm">
                            <strong>Notes:</strong> {task.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        {task.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(task.id, 'in-progress')}
                          >
                            Start
                          </Button>
                        )}
                        
                        {task.status === 'in-progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(task.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                        
                        {task.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(task.id, 'in-progress')}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Update
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-6">
          <CalendarComponent userId={userId} userRole="tutor" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksDashboard; 
