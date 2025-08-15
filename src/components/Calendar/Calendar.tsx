import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useTasks, Task } from '@/contexts/TasksContext';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, startOfYear, endOfYear, isSameDay, isSameMonth, isSameYear, addDays, subDays, addMonths, subMonths, addYears, subYears, getDay, getDate, getMonth, getYear } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar as DatePicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import EventDialog from './EventDialog';
import { Input } from '@/components/ui/input';

interface CalendarProps {
  userId: string;
  userRole: string;
}

type ViewMode = 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

const Calendar: React.FC<CalendarProps> = ({ userId, userRole }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const calendarGridRef = useRef<HTMLDivElement | null>(null);
  const [highlightDate, setHighlightDate] = useState<string | null>(null);
  const [customRange, setCustomRange] = useState<{ start: Date; end: Date }>({ 
    start: new Date(), 
    end: addDays(new Date(), 7) 
  });
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  
  const { tasks, addTask, updateTask, deleteTask, getTasksByTutor } = useTasks();
  const { toast } = useToast();
  
  console.log('Calendar component rendered with:', { userId, userRole });
  console.log('Tasks context:', { tasks: tasks.length, addTask, updateTask, deleteTask, getTasksByTutor });
  console.log('Toast context:', toast);

  // Get user's tasks
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

  // Calendar navigation
  const goToPrevious = useCallback(() => {
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
        setCurrentDate(prev => subYears(prev, 1));
        break;
      case 'custom':
        const newStart = subDays(customRange.start, 7);
        const newEnd = subDays(customRange.end, 7);
        setCustomRange({ start: newStart, end: newEnd });
        break;
    }
  }, [viewMode, customRange]);

  const goToNext = useCallback(() => {
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
        setCurrentDate(prev => addYears(prev, 1));
        break;
      case 'custom':
        const newStart = addDays(customRange.start, 7);
        const newEnd = addDays(customRange.end, 7);
        setCustomRange({ start: newStart, end: newEnd });
        break;
    }
  }, [viewMode, customRange]);

  const goToToday = useCallback(() => {
    const now = new Date();
    setCurrentDate(now);
    if (viewMode === 'custom') {
      // For custom range, adjust the range to include today
      const daysDiff = Math.ceil((now.getTime() - customRange.start.getTime()) / (1000 * 60 * 60 * 24));
      const newStart = addDays(customRange.start, daysDiff);
      const newEnd = addDays(customRange.end, daysDiff);
      setCustomRange({ start: newStart, end: newEnd });
    }
    const dateKey = format(now, 'yyyy-MM-dd');
    // Scroll into view and temporarily highlight today's cell after render
    requestAnimationFrame(() => {
      setTimeout(() => {
        const root = calendarGridRef.current;
        if (!root) return;
        const el = root.querySelector<HTMLDivElement>(`[data-date="${dateKey}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
          setHighlightDate(dateKey);
          setTimeout(() => setHighlightDate(null), 1500);
        }
      }, 50);
    });
  }, [viewMode, customRange]);

  // Handle custom range selection
  const handleCustomRangeSubmit = useCallback((startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      toast({
        title: 'Invalid Range',
        description: 'Start date must be before end date.',
        variant: 'destructive',
      });
      return;
    }
    
    setCustomRange({ start, end });
    setIsCustomRangeOpen(false);
    toast({
      title: 'Custom Range Set',
      description: `Calendar view updated to ${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`,
    });
  }, [toast]);

  // Get calendar dates based on view mode
  const calendarDates = useMemo(() => {
    switch (viewMode) {
      case 'weekly':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      case 'monthly':
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        return eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      case 'quarterly':
        const quarterStart = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
        return eachDayOfInterval({ start: quarterStart, end: quarterEnd });
      
      case 'yearly':
        const yearStart = startOfYear(currentDate);
        const yearEnd = endOfYear(currentDate);
        return eachDayOfInterval({ start: yearStart, end: yearEnd });
      
      case 'custom':
        return eachDayOfInterval({ start: customRange.start, end: customRange.end });
      
      default:
        return [];
    }
  }, [currentDate, viewMode, customRange]);

  // Keyboard shortcut: press "T" to focus Today
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        goToToday();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goToToday]);

  // Get tasks for a specific date
  const getTasksForDate = useCallback((date: Date) => {
    return userTasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  }, [userTasks]);

  // Get view title
  const getViewTitle = useCallback(() => {
    switch (viewMode) {
      case 'weekly':
        return `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM dd')} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM dd, yyyy')}`;
      case 'monthly':
        return format(currentDate, 'MMMM yyyy');
      case 'quarterly':
        const quarterStart = new Date(currentDate.getFullYear(), Math.floor(currentDate.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
        return `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${currentDate.getFullYear()} (${format(quarterStart, 'MMM dd')} - ${format(quarterEnd, 'MMM dd')})`;
      case 'yearly':
        return format(currentDate, 'yyyy');
      case 'custom':
        return `${format(customRange.start, 'MMM dd')} - ${format(customRange.end, 'MMM dd, yyyy')}`;
      default:
        return '';
    }
  }, [currentDate, viewMode, customRange]);

  // Handle date selection
  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsEventDialogOpen(true);
  }, []);

  // Quick add for today from header summary
  const handleQuickAddToday = useCallback(() => {
    const now = new Date();
    setSelectedDate(now);
    setEditingEvent(null);
    setIsEventDialogOpen(true);
  }, []);

  // Handle event creation/editing
  const handleEventSubmit = useCallback((eventData: any) => {
    try {
      console.log('handleEventSubmit called with:', eventData);
      console.log('editingEvent:', editingEvent);
      console.log('selectedDate:', selectedDate);
      
      if (editingEvent) {
        // Update existing event
        console.log('Updating existing event:', editingEvent.id);
        updateTask(editingEvent.id, eventData);
        toast({
          title: 'Event Updated',
          description: 'The event has been successfully updated.',
        });
      } else {
        // Create new event
        const newEvent = {
          title: eventData.title,
          description: eventData.description,
          assignedTo: userId,
          assignedBy: userId,
          assignedByName: 'Current User',
          dueDate: format(selectedDate!, 'yyyy-MM-dd'),
          dueTime: eventData.dueTime || '09:00',
          priority: eventData.priority || 'medium',
          category: eventData.category || 'other',
          status: 'pending' as Task['status'],
          notes: eventData.notes,
        };
        
        console.log('Creating new task:', newEvent);
        addTask(newEvent);
        
        toast({
          title: 'Event Created',
          description: 'The event has been successfully created.',
        });
      }
    } catch (error) {
      console.error('Error in handleEventSubmit:', error);
      toast({
        title: 'Error',
        description: 'Failed to create/update event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsEventDialogOpen(false);
      setEditingEvent(null);
      setSelectedDate(null);
    }
  }, [editingEvent, selectedDate, userId, addTask, updateTask, toast]);

  // Handle event deletion
  const handleEventDelete = useCallback((eventId: string) => {
    deleteTask(eventId);
    toast({
      title: 'Event Deleted',
      description: 'The event has been successfully deleted.',
    });
  }, [deleteTask, toast]);

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

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <CalendarIcon className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-xl">Calendar</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your schedule and tasks
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                    {(() => {
                      const todayCount = userTasks.filter(t => t.dueDate === format(new Date(), 'yyyy-MM-dd')).length;
                      return todayCount > 0 ? (
                        <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] px-2 py-0.5">
                          {todayCount}
                        </span>
                      ) : null;
                    })()}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">Jump to today (Shortcut: T)</div>
                </TooltipContent>
              </Tooltip>
              <Button variant="outline" size="sm" onClick={goToNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* View Mode Tabs */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold">{getViewTitle()}</h3>
              {viewMode === 'custom' && (
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsCustomRangeOpen(true)}
                  >
                    Set Custom Range
                  </Button>
                </div>
              )}
            </div>
          </Tabs>

          {/* Today summary strip */}
          {(() => {
            const today = new Date();
            const todayKey = format(today, 'yyyy-MM-dd');
            const todayTasks = userTasks.filter(t => t.dueDate === todayKey);
            if (todayTasks.length === 0) return null;
            const overdueCount = todayTasks.filter(t => t.status === 'overdue').length;
            return (
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-lg border p-3 bg-muted/30">
                <div className="text-sm">
                  <span className="font-medium">Today ({format(today, 'MMM dd')}):</span>
                  <span className="ml-2">{todayTasks.length} task{todayTasks.length > 1 ? 's' : ''}</span>
                  {overdueCount > 0 && (
                    <span className="ml-2 text-destructive">{overdueCount} overdue</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={goToToday}>Focus Today</Button>
                  <Button size="sm" onClick={handleQuickAddToday}>Quick Add</Button>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-1" ref={calendarGridRef}>
            {/* Day headers */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="p-2 text-center font-medium text-sm text-muted-foreground">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDates.map((date, index) => {
              const dayTasks = getTasksForDate(date);
              const isToday = isSameDay(date, new Date());
              const isCurrentMonth = viewMode === 'yearly' ? isSameMonth(date, currentDate) : true;
              const dateKey = format(date, 'yyyy-MM-dd');
              
              return (
                <div
                  key={index}
                  className={`
                    min-h-[120px] p-2 border rounded-lg cursor-pointer transition-colors
                    ${isToday ? 'bg-primary/10 border-primary' : 'bg-background border-border hover:bg-muted/50'}
                    ${!isCurrentMonth ? 'opacity-50' : ''}
                    ${highlightDate === dateKey ? 'ring-2 ring-primary animate-pulse' : ''}
                  `}
                  data-date={dateKey}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                      {getDate(date)}
                    </span>
                    {(userRole === 'admin' || userRole === 'hr') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDate(date);
                          setEditingEvent(null);
                          setIsEventDialogOpen(true);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Tasks for this day */}
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="text-xs p-1 rounded cursor-pointer hover:bg-muted"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingEvent(task);
                          setSelectedDate(date);
                          setIsEventDialogOpen(true);
                        }}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <Badge className={`${getPriorityColor(task.priority)} text-xs px-1 py-0`}>
                            {task.priority.charAt(0).toUpperCase()}
                          </Badge>
                          <Badge className={`${getStatusColor(task.status)} text-xs px-1 py-0`}>
                            {task.status.charAt(0).toUpperCase()}
                          </Badge>
                        </div>
                        <p className="font-medium truncate">{task.title}</p>
                        <p className="text-muted-foreground truncate">{task.dueTime}</p>
                      </div>
                    ))}
                    
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Dialog */}
      {isEventDialogOpen && selectedDate && (
        <EventDialog
          open={isEventDialogOpen}
          onOpenChange={setIsEventDialogOpen}
          event={editingEvent}
          selectedDate={selectedDate}
          onSubmit={handleEventSubmit}
          onDelete={handleEventDelete}
          userRole={userRole}
        />
      )}

      {/* Custom Range Picker Dialog */}
      <Dialog open={isCustomRangeOpen} onOpenChange={setIsCustomRangeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Custom Date Range</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${customRange?.start ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      {customRange?.start ? format(customRange.start, 'MMM dd, yyyy') : <span>Pick a start date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <DatePicker
                      selected={customRange?.start}
                      onSelect={(date) => {
                        if (date) {
                          setCustomRange(prev => ({ 
                            start: date, 
                            end: prev?.end || date 
                          }));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  placeholder="Start time"
                  defaultValue="09:00"
                  onChange={(e) => {
                    if (customRange?.start) {
                      const [hours, minutes] = e.target.value.split(':');
                      const newStart = new Date(customRange.start);
                      newStart.setHours(parseInt(hours), parseInt(minutes));
                      setCustomRange(prev => ({ ...prev, start: newStart }));
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${customRange?.end ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      {customRange?.end ? format(customRange.end, 'MMM dd, yyyy') : <span>Pick an end date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <DatePicker
                      selected={customRange?.end}
                      onSelect={(date) => {
                        if (date) {
                          setCustomRange(prev => ({ 
                            start: prev?.start || date, 
                            end: date 
                          }));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  placeholder="End time"
                  defaultValue="17:00"
                  onChange={(e) => {
                    if (customRange?.end) {
                      const [hours, minutes] = e.target.value.split(':');
                      const newEnd = new Date(customRange.end);
                      newEnd.setHours(parseInt(hours), parseInt(minutes));
                      setCustomRange(prev => ({ ...prev, end: newEnd }));
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomRangeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (customRange?.start && customRange?.end) {
                handleCustomRangeSubmit(format(customRange.start, 'yyyy-MM-dd'), format(customRange.end, 'yyyy-MM-dd'));
              }
            }}>
              Set Range
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
