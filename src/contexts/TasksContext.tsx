import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // tutor ID
  assignedBy: string; // admin/manager ID
  assignedByName: string; // admin/manager name
  dueDate: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  category: 'academic' | 'administrative' | 'training' | 'other';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
  attachments?: string[];
}

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByTutor: (tutorId: string) => Task[];
  getTasksByStatus: (status: Task['status']) => Task[];
  getTasksByPriority: (priority: Task['priority']) => Task[];
  getOverdueTasks: () => Task[];
  getTasksDueToday: () => Task[];
  getTasksDueThisWeek: () => Task[];
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};

interface TasksProviderProps {
  children: ReactNode;
}

export const TasksProvider: React.FC<TasksProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
      }
    } else {
      // Add sample tasks if none exist
      const sampleTasks: Task[] = [
        {
          id: 'TASK_001',
          title: 'Prepare Lesson Plan for Week 1',
          description: 'Create comprehensive lesson plans for Mathematics Week 1, including activities and assessments.',
          assignedTo: 'TUT001',
          assignedBy: 'ADMIN001',
          assignedByName: 'Admin User',
          dueDate: '2024-01-15',
          dueTime: '09:00',
          priority: 'high',
          category: 'academic',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          notes: 'Focus on interactive learning methods and include homework assignments.',
        },
        {
          id: 'TASK_002',
          title: 'Review Student Progress Reports',
          description: 'Analyze and update student progress reports for the current semester.',
          assignedTo: 'TUT001',
          assignedBy: 'ADMIN001',
          assignedByName: 'Admin User',
          dueDate: '2024-01-20',
          dueTime: '14:00',
          priority: 'medium',
          category: 'administrative',
          status: 'in-progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'TASK_003',
          title: 'Attend Professional Development Workshop',
          description: 'Participate in the upcoming workshop on modern teaching methodologies.',
          assignedTo: 'TUT002',
          assignedBy: 'ADMIN001',
          assignedByName: 'Admin User',
          dueDate: '2024-01-25',
          dueTime: '10:00',
          priority: 'medium',
          category: 'training',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'TASK_004',
          title: 'Review Financial Reports',
          description: 'Analyze monthly financial reports and prepare summary for management.',
          assignedTo: 'EXE001',
          assignedBy: 'ADMIN001',
          assignedByName: 'Admin User',
          dueDate: '2024-01-18',
          dueTime: '16:00',
          priority: 'high',
          category: 'administrative',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'TASK_005',
          title: 'Conduct Employee Performance Reviews',
          description: 'Complete quarterly performance reviews for assigned team members.',
          assignedTo: 'HR001',
          assignedBy: 'ADMIN001',
          assignedByName: 'Admin User',
          dueDate: '2024-01-22',
          dueTime: '11:00',
          priority: 'medium',
          category: 'administrative',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'TASK_006',
          title: 'Organize Team Building Event',
          description: 'Plan and coordinate the upcoming team building workshop for staff.',
          assignedTo: 'MGR001',
          assignedBy: 'ADMIN001',
          assignedByName: 'Admin User',
          dueDate: '2024-01-30',
          dueTime: '14:00',
          priority: 'medium',
          category: 'administrative',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'TASK_007',
          title: 'Review Budget Allocation',
          description: 'Analyze and approve budget allocations for Q1 2024 across departments.',
          assignedTo: 'MGR001',
          assignedBy: 'ADMIN001',
          assignedByName: 'Admin User',
          dueDate: '2024-01-28',
          dueTime: '16:00',
          priority: 'high',
          category: 'administrative',
          status: 'in-progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'TASK_008',
          title: 'Prepare Quarterly Report',
          description: 'Compile comprehensive quarterly performance report for stakeholders.',
          assignedTo: 'EXE001',
          assignedBy: 'ADMIN001',
          assignedByName: 'Admin User',
          dueDate: '2024-01-31',
          dueTime: '12:00',
          priority: 'high',
          category: 'administrative',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'TASK_009',
          title: 'Conduct Staff Training Session',
          description: 'Organize and conduct training session on new HR policies and procedures.',
          assignedTo: 'HR001',
          assignedBy: 'ADMIN001',
          assignedByName: 'Admin User',
          dueDate: '2024-01-26',
          dueTime: '10:00',
          priority: 'medium',
          category: 'training',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'TASK_010',
          title: 'Update Employee Handbook',
          description: 'Review and update the employee handbook with latest policies and procedures.',
          assignedTo: 'HR001',
          assignedBy: 'ADMIN001',
          assignedByName: 'Admin User',
          dueDate: '2024-02-05',
          dueTime: '15:00',
          priority: 'medium',
          category: 'administrative',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setTasks(sampleTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('TasksContext addTask called with:', taskData);
    const newTask: Task = {
      ...taskData,
      id: `TASK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log('Created new task:', newTask);
    setTasks(prev => {
      const updatedTasks = [...prev, newTask];
      console.log('Updated tasks array:', updatedTasks);
      return updatedTasks;
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getTasksByTutor = (tutorId: string) => {
    return tasks.filter(task => task.assignedTo === tutorId);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByPriority = (priority: Task['priority']) => {
    return tasks.filter(task => task.priority === priority);
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => {
      if (task.status === 'completed') return false;
      const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
      return dueDateTime < now;
    });
  };

  const getTasksDueToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => 
      task.dueDate === today && task.status !== 'completed'
    );
  };

  const getTasksDueThisWeek = () => {
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + 7);
    
    return tasks.filter(task => {
      if (task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= endOfWeek;
    });
  };

  const value: TasksContextType = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksByTutor,
    getTasksByStatus,
    getTasksByPriority,
    getOverdueTasks,
    getTasksDueToday,
    getTasksDueThisWeek,
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};
