import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LeaveType {
  id: number;
  name: string;
  description: string;
  maxDays: number;
  status: "active" | "inactive";
}

interface LeaveTypesContextType {
  leaveTypes: LeaveType[];
  addLeaveType: (leaveType: Omit<LeaveType, 'id'>) => void;
  updateLeaveType: (id: number, leaveType: Partial<LeaveType>) => void;
  deleteLeaveType: (id: number) => void;
  getActiveLeaveTypes: () => LeaveType[];
}

const LeaveTypesContext = createContext<LeaveTypesContextType | undefined>(undefined);

const initialLeaveTypes: LeaveType[] = [
  {
    id: 1,
    name: "Sick Leave",
    description: "Medical leave for health-related issues",
    maxDays: 15,
    status: "active",
  },
  {
    id: 2,
    name: "Personal Leave",
    description: "Personal time off for personal matters",
    maxDays: 10,
    status: "active",
  },
  {
    id: 3,
    name: "Vacation",
    description: "Annual vacation leave",
    maxDays: 30,
    status: "active",
  },
  {
    id: 4,
    name: "Emergency Leave",
    description: "Urgent leave for emergency situations",
    maxDays: 5,
    status: "active",
  },
];

export const LeaveTypesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(() => {
    const saved = localStorage.getItem('leaveTypes');
    return saved ? JSON.parse(saved) : initialLeaveTypes;
  });

  const saveToStorage = (newLeaveTypes: LeaveType[]) => {
    localStorage.setItem('leaveTypes', JSON.stringify(newLeaveTypes));
  };

  const addLeaveType = (leaveType: Omit<LeaveType, 'id'>) => {
    const newLeaveType: LeaveType = {
      ...leaveType,
      id: Date.now(),
    };
    const updatedLeaveTypes = [...leaveTypes, newLeaveType];
    setLeaveTypes(updatedLeaveTypes);
    saveToStorage(updatedLeaveTypes);
  };

  const updateLeaveType = (id: number, leaveType: Partial<LeaveType>) => {
    const updatedLeaveTypes = leaveTypes.map(lt =>
      lt.id === id ? { ...lt, ...leaveType } : lt
    );
    setLeaveTypes(updatedLeaveTypes);
    saveToStorage(updatedLeaveTypes);
  };

  const deleteLeaveType = (id: number) => {
    const updatedLeaveTypes = leaveTypes.filter(lt => lt.id !== id);
    setLeaveTypes(updatedLeaveTypes);
    saveToStorage(updatedLeaveTypes);
  };

  const getActiveLeaveTypes = () => {
    return leaveTypes.filter(lt => lt.status === "active");
  };

  return (
    <LeaveTypesContext.Provider
      value={{
        leaveTypes,
        addLeaveType,
        updateLeaveType,
        deleteLeaveType,
        getActiveLeaveTypes,
      }}
    >
      {children}
    </LeaveTypesContext.Provider>
  );
};

export const useLeaveTypes = () => {
  const context = useContext(LeaveTypesContext);
  if (context === undefined) {
    throw new Error('useLeaveTypes must be used within a LeaveTypesProvider');
  }
  return context;
}; 