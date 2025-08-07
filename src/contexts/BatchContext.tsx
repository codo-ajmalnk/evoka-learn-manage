import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Batch {
  id: number;
  name: string;
  syllabus: string;
  startDate: string;
  students: number;
}

interface BatchContextType {
  batches: Batch[];
  addBatch: (batch: Omit<Batch, 'id'>) => void;
  updateBatch: (id: number, batch: Partial<Batch>) => void;
  deleteBatch: (id: number) => void;
  getBatchById: (id: number) => Batch | undefined;
  getBatchByName: (name: string) => Batch | undefined;
}

const BatchContext = createContext<BatchContextType | undefined>(undefined);

const initialBatches: Batch[] = [
  {
    id: 1,
    name: "Batch WD-2025-01",
    syllabus: "Full Stack Development",
    startDate: "2025-01-15",
    students: 25,
  },
  {
    id: 2,
    name: "Batch DM-2025-01",
    syllabus: "Digital Marketing Mastery",
    startDate: "2025-02-01",
    students: 20,
  },
  {
    id: 3,
    name: "Batch GD-2025-01",
    syllabus: "Creative Design",
    startDate: "2025-01-20",
    students: 18,
  },
];

export const BatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [batches, setBatches] = useState<Batch[]>(initialBatches);

  const addBatch = (batch: Omit<Batch, 'id'>) => {
    const newBatch: Batch = {
      ...batch,
      id: Math.max(...batches.map(b => b.id), 0) + 1,
    };
    setBatches(prev => [...prev, newBatch]);
  };

  const updateBatch = (id: number, batch: Partial<Batch>) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...batch } : b));
  };

  const deleteBatch = (id: number) => {
    setBatches(prev => prev.filter(b => b.id !== id));
  };

  const getBatchById = (id: number) => {
    return batches.find(b => b.id === id);
  };

  const getBatchByName = (name: string) => {
    return batches.find(b => b.name === name);
  };

  return (
    <BatchContext.Provider value={{
      batches,
      addBatch,
      updateBatch,
      deleteBatch,
      getBatchById,
      getBatchByName,
    }}>
      {children}
    </BatchContext.Provider>
  );
};

export const useBatches = () => {
  const context = useContext(BatchContext);
  if (context === undefined) {
    throw new Error('useBatches must be used within a BatchProvider');
  }
  return context;
}; 