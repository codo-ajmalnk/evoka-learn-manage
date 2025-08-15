import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, AlertTriangle } from 'lucide-react';
import { useTasks, Task } from '@/contexts/TasksContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, getDate, isToday, isSameMonth as isCurrentMonth, startOfWeek, endOfWeek, startOfQuarter, endOfQuarter, startOfYear, endOfYear, subDays, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface DashboardCalendarProps {
  userId: string;
  userRole: string;
  compact?: boolean;
}

type ViewMode = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ 
  userId, 
  userRole, 
  compact = false 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const { tasks, getTasksByTutor } = useTasks();
  const navigate = useNavigate();

  // Get user's tasks based on role
  const userTasks = useMemo(() => {
    if (userRole === 'tutor') {
      return getTasksByTutor(userId);
    } else if (userRole === 'executive') {
      return tasks.filter(task => 
        task.assignedTo === userId || 
        task.assignedBy === userId ||
        task.category === 'administrative'
      );
    } else if (userRole === 'hr') {
      return tasks.filter(task => 
        task.category === 'administrative' || 
        task.category === 'training' ||
        task.assignedTo === userId
      );
    } else {
      // Admin and Manager see all tasks
      return tasks;
    }
  }, [tasks, userId, userRole, getTasksByTutor]);

  // Get calendar dates for current month
  const calendarDates = useMemo(() => {
    switch (viewMode) {
      case 'weekly':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      case 'monthly':
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        return eachDayOfInterval({ start, end });
      
      case 'quarterly':
        const quarterStart = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
        return eachDayOfInterval({ start: quarterStart, end: quarterEnd });
      
      case 'yearly':
        const yearStart = startOfYear(currentDate);
        const yearEnd = endOfYear(currentDate);
        return eachDayOfInterval({ start: yearStart, end: yearEnd });
      
      default:
        return [];
    }
  }, [currentDate, viewMode]);

  // Get tasks for a specific date
  const getTasksForDate = useCallback((date: Date) => {
    return userTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  }, [userTasks]);

  // Navigation functions
  const goToPreviousMonth = useCallback(() => {
    switch (viewMode) {
      case 'weekly':
        setCurrentDate(prev => subDays(prev, 7));
        break;
      case 'monthly':
        setCurrentDate(prev => subMonths(prev, 1));
        break;
      case 'quarterly':
        setCurrentDate(prev => subMonths(prev, 3));
        break;
      case 'yearly':
        setCurrentDate(prev => subMonths(prev, 12));
        break;
    }
  }, [viewMode]);

  const goToNextMonth = useCallback(() => {
    switch (viewMode) {
      case 'weekly':
        setCurrentDate(prev => addDays(prev, 7));
        break;
      case 'monthly':
        setCurrentDate(prev => addMonths(prev, 1));
        break;
      case 'quarterly':
        setCurrentDate(prev => addMonths(prev, 3));
        break;
      case 'yearly':
        setCurrentDate(prev => addMonths(prev, 12));
        break;
    }
  }, [viewMode]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Get priority color
  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Get status color
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Get upcoming tasks (next 7 days)
  const upcomingTasks = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return userTasks
      .filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate >= today && taskDate <= nextWeek && task.status !== 'completed';
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [userTasks]);

  // Get overdue tasks
  const overdueTasks = useMemo(() => {
    const today = new Date();
    return userTasks.filter(task => {
      if (task.status === 'completed') return false;
      const taskDate = new Date(task.dueDate);
      return taskDate < today;
    });
  }, [userTasks]);

  if (compact) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="w-auto">
                <TabsList className="grid w-auto grid-cols-4 h-8">
                  <TabsTrigger value="weekly" className="text-xs px-2">W</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs px-2">M</TabsTrigger>
                  <TabsTrigger value="quarterly" className="text-xs px-2">Q</TabsTrigger>
                  <TabsTrigger value="yearly" className="text-xs px-2">Y</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="ghost" size="sm" onClick={() => navigate('/calendar')}>
                View All
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {viewMode === 'weekly' && `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM dd')} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM dd')}`}
              {viewMode === 'monthly' && format(currentDate, 'MMMM yyyy')}
              {viewMode === 'quarterly' && `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${currentDate.getFullYear()}`}
              {viewMode === 'yearly' && format(currentDate, 'yyyy')}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={goToPreviousMonth} className="h-6 w-6 p-0">
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={goToToday} className="h-6 w-6 p-0 text-xs">
                T
              </Button>
              <Button variant="ghost" size="sm" onClick={goToNextMonth} className="h-6 w-6 p-0">
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{upcomingTasks.length}</p>
              <p className="text-xs text-blue-600">Upcoming</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
              <p className="text-xs text-red-600">Overdue</p>
            </div>
          </div>

          {/* Next 3 Upcoming Tasks */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Next Tasks</h4>
            {upcomingTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(task.dueDate), 'MMM dd')} at {task.dueTime}
                  </p>
                </div>
                <Badge className={`${getPriorityColor(task.priority)} text-xs px-2 py-0`}>
                  {task.priority.charAt(0).toUpperCase()}
                </Badge>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                No upcoming tasks
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="w-auto">
              <TabsList className="grid w-auto grid-cols-4 h-8">
                <TabsTrigger value="weekly" className="text-xs px-2">W</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs px-2">M</TabsTrigger>
                <TabsTrigger value="quarterly" className="text-xs px-2">Q</TabsTrigger>
                <TabsTrigger value="yearly" className="text-xs px-2">Y</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="ghost" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {viewMode === 'weekly' && `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM dd')} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM dd')}`}
          {viewMode === 'monthly' && format(currentDate, 'MMMM yyyy')}
          {viewMode === 'quarterly' && `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${currentDate.getFullYear()}`}
          {viewMode === 'yearly' && format(currentDate, 'yyyy')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div key={day} className="p-1 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDates.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const isCurrentDate = isToday(date);
            const isCurrentMonthDate = isCurrentMonth(date, currentDate);
            
            return (
              <div
                key={index}
                className={`
                  min-h-[60px] p-1 border rounded-lg cursor-pointer transition-colors
                  ${isCurrentDate ? 'bg-primary/10 border-primary' : 'bg-background border-border hover:bg-muted/50'}
                  ${!isCurrentMonthDate ? 'opacity-50' : ''}
                `}
                onClick={() => navigate('/calendar')}
              >
                <div className="text-xs font-medium mb-1">
                  {getDate(date)}
                </div>
                
                {/* Tasks for this day */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="w-full h-1.5 rounded-full"
                      style={{
                        backgroundColor: task.priority === 'urgent' ? '#ef4444' :
                                       task.priority === 'high' ? '#f97316' :
                                       task.priority === 'medium' ? '#eab308' : '#3b82f6'
                      }}
                    />
                  ))}
                  
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{dayTasks.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate('/tasks')}
          >
            <Clock className="h-4 w-4 mr-2" />
            View Tasks
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate('/calendar')}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Full Calendar
          </Button>
        </div>

        {/* Overdue Tasks Alert */}
        {overdueTasks.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                {overdueTasks.length} Overdue Task{overdueTasks.length > 1 ? 's' : ''}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/tasks')}
            >
              View Overdue Tasks
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCalendar;
