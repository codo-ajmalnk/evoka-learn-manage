import React, { useState, useEffect, useMemo, useCallback, memo, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks, Task } from '@/contexts/TasksContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
} from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/Calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lazy load components
const LazyAddTaskDialog = lazy(() => import('./AddTaskDialog'));
const LazyEditTaskDialog = lazy(() => import('./EditTaskDialog'));

// Mock users data for assignment
const mockUsers = [
  { id: 'TUT001', name: 'Tutor1 Last1' },
  { id: 'TUT002', name: 'Tutor2 Last2' },
  { id: 'TUT003', name: 'Tutor3 Last3' },
  { id: 'EXE001', name: 'Executive1 Last1' },
  { id: 'EXE002', name: 'Executive2 Last2' },
  { id: 'HR001', name: 'HR Manager1' },
  { id: 'HR002', name: 'HR Manager2' },
  { id: 'MGR001', name: 'Manager1 Last1' },
  { id: 'MGR002', name: 'Manager2 Last2' },
];

// Priority and status mappings
const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

const statusIcons = {
  pending: Clock,
  'in-progress': Play,
  completed: CheckCircle,
  overdue: AlertTriangle,
};

const Tasks = memo(() => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get current user info
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser.role || 'admin';
  const userId = currentUser.id || 'ADMIN001';
  
  const {
    tasks,
    deleteTask,
    getTasksByStatus,
    getOverdueTasks,
    getTasksDueToday,
    getTasksDueThisWeek,
    getTasksByTutor,
  } = useTasks();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Task['category'] | 'all'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Filtered tasks based on user role
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Role-based filtering
    if (userRole === 'tutor') {
      // Tutors only see their own tasks
      filtered = getTasksByTutor(userId);
    } else if (userRole === 'executive') {
      // Executives see tasks assigned to them and tasks they can manage
      filtered = tasks.filter(task => 
        task.assignedTo === userId || 
        task.assignedBy === userId ||
        task.category === 'administrative'
      );
    } else if (userRole === 'hr') {
      // HR sees all tasks but focuses on administrative and training
      filtered = tasks.filter(task => 
        task.category === 'administrative' || 
        task.category === 'training' ||
        task.assignedTo === userId
      );
    }
    // Admin and Manager see all tasks (no additional filtering)

    if (searchTerm) {
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignedByName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }

    return filtered;
  }, [tasks, searchTerm, statusFilter, priorityFilter, categoryFilter, userRole, userId, getTasksByTutor]);

  // Statistics based on user role
  const stats = useMemo(() => {
    let total, pending, inProgress, completed, overdue, dueToday, dueThisWeek;
    
    if (userRole === 'tutor') {
      // For tutors, show their own task stats
      const tutorTasks = getTasksByTutor(userId);
      total = tutorTasks.length;
      pending = tutorTasks.filter(task => task.status === 'pending').length;
      inProgress = tutorTasks.filter(task => task.status === 'in-progress').length;
      completed = tutorTasks.filter(task => task.status === 'completed').length;
      overdue = tutorTasks.filter(task => {
        if (task.status === 'completed') return false;
        const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
        return dueDateTime < new Date();
      }).length;
      dueToday = tutorTasks.filter(task => 
        task.dueDate === new Date().toISOString().split('T')[0] && 
        task.status !== 'completed'
      ).length;
      dueThisWeek = tutorTasks.filter(task => {
        if (task.status === 'completed') return false;
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + 7);
        return dueDate >= now && dueDate <= endOfWeek;
      }).length;
    } else {
      // For other roles, show filtered stats
      total = filteredTasks.length;
      pending = filteredTasks.filter(task => task.status === 'pending').length;
      inProgress = filteredTasks.filter(task => task.status === 'in-progress').length;
      completed = filteredTasks.filter(task => task.status === 'completed').length;
      overdue = filteredTasks.filter(task => {
        if (task.status === 'completed') return false;
        const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
        return dueDateTime < new Date();
      }).length;
      dueToday = filteredTasks.filter(task => 
        task.dueDate === new Date().toISOString().split('T')[0] && 
        task.status !== 'completed'
      ).length;
      dueThisWeek = filteredTasks.filter(task => {
        if (task.status === 'completed') return false;
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + 7);
        return dueDate >= now && dueDate <= endOfWeek;
      }).length;
    }

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
      dueToday,
      dueThisWeek,
    };
  }, [filteredTasks, userRole, userId, getTasksByTutor]);

  const handleDeleteTask = useCallback((taskId: string) => {
    deleteTask(taskId);
    toast({
      title: 'Task deleted',
      description: 'The task has been successfully deleted.',
    });
  }, [deleteTask, toast]);

  const handleEditTask = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsEditDialogOpen(true);
  }, []);

  const handleViewTask = useCallback((task: Task) => {
    setSelectedTask(task);
    // You can implement a view-only dialog here
  }, []);

  const handleStatusChange = useCallback((taskId: string, newStatus: Task['status']) => {
    // For tutors, they can only update their own task status
    if (userRole === 'tutor') {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.assignedTo === userId) {
        // Update task status
        // Note: This would need to be implemented in the context
        toast({
          title: 'Status updated',
          description: `Task status changed to ${newStatus}.`,
        });
      }
    }
  }, [userRole, userId, tasks, toast]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {userRole === 'tutor' ? 'My Tasks' : 'Tasks Management'}
          </h1>
          <p className="text-muted-foreground">
            {userRole === 'tutor' 
              ? `View and manage your assigned tasks (${filteredTasks.length} tasks)`
              : userRole === 'executive' || userRole === 'hr'
              ? `Manage tasks for your role (${filteredTasks.length} tasks)`
              : `Manage and assign tasks to tutors (${filteredTasks.length} total tasks)`
            }
          </p>
        </div>
        <div className="flex gap-2">
          {(userRole === 'admin' || userRole === 'manager') && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )}

        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Play className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Tasks</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, description, or assignee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Task['status'] | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-48">
              <Label htmlFor="priority-filter">Priority</Label>
              <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Task['priority'] | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-48">
              <Label htmlFor="category-filter">Category</Label>
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as Task['category'] | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
                </CardContent>
      </Card>



      {/* View Mode Tabs */}
      <Card>
        <CardContent className="p-4">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'calendar')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Tasks View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Tasks Table or Calendar View */}
      {viewMode === 'list' ? (
        <Card>
          <CardHeader>
            <CardTitle>Tasks List</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No tasks found matching your criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      {userRole !== 'tutor' && <TableHead>Assigned To</TableHead>}
                      <TableHead>Due Date & Time</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => {
                      const StatusIcon = statusIcons[task.status];
                      const user = mockUsers.find(t => t.id === task.assignedTo);
                      
                      return (
                        <TableRow key={task.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{task.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {task.description}
                              </p>
                            </div>
                          </TableCell>
                          {userRole !== 'tutor' && (
                            <TableCell>
                              <div>
                                <p className="font-medium">{user?.name || 'Unknown'}</p>
                                <p className="text-sm text-muted-foreground">{task.assignedTo}</p>
                              </div>
                            </TableCell>
                          )}
                          <TableCell>
                            <div>
                              <p className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</p>
                              <p className="text-sm text-muted-foreground">{task.dueTime}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={priorityColors[task.priority]}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[task.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewTask(task)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {(userRole === 'admin' || userRole === 'manager') && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditTask(task)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this task? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteTask(task.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </>
                              )}
                              {userRole === 'tutor' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(task.id, 
                                    task.status === 'pending' ? 'in-progress' : 'completed'
                                  )}
                                >
                                  {task.status === 'pending' ? 'Start' : 
                                   task.status === 'in-progress' ? 'Complete' : 'Update'}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <CalendarComponent userId={userId} userRole={userRole} />
      )}

      {/* Dialogs */}
      <Suspense fallback={<div>Loading...</div>}>
        {isAddDialogOpen && (
          <LazyAddTaskDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            tutors={mockUsers}
          />
        )}
        
        {isEditDialogOpen && selectedTask && (
          <LazyEditTaskDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            task={selectedTask}
            tutors={mockUsers}
          />
        )}
      </Suspense>
    </div>
  );
});

Tasks.displayName = 'Tasks';

export default Tasks;
