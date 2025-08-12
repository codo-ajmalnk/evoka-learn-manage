import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import {
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  Plus,
  Receipt,
  Search,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback, memo, Suspense, lazy, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CardGridSkeleton } from "@/components/ui/skeletons/card-grid-skeleton";

// Lazy load components for better performance
const LazyJournalDetailsDialog = lazy(() => import('./JournalDetailsDialog.tsx'));
const LazyAddJournalDialog = lazy(() => import('./AddJournalDialog.tsx'));

// Simple debounce hook implementation
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Simple throttle hook implementation
const useThrottle = (callback: Function, delay: number) => {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: any[]) => {
      const now = Date.now();

      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastRun.current = Date.now();
        }, delay - (now - lastRun.current));
      }
    },
    [callback, delay]
  );
};

// Simple virtual scrolling hook
const useVirtualScrolling = (items: any[], itemHeight: number, containerHeight: number, overscan: number = 5) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    containerRef,
    totalHeight,
    visibleItems,
    offsetY,
    handleScroll,
    startIndex,
    endIndex,
  };
};

// Simple performance logger
const performanceLogger = {
  logRender: (time: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Journals render time: ${time.toFixed(2)}ms`);
    }
  }
};

interface JournalEntry {
  id: number;
  billNumber: string;
  type: "Fee" | "Salary" | "Petty Cash";
  student?: string;
  employee?: string;
  amount: number;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
  description: string;
  attachments: string[];
}

// Memoized journal data with caching
const getDummyJournalEntries = (() => {
  let cachedEntries: JournalEntry[] | null = null;
  let cacheTime = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  return () => {
    const now = Date.now();
    if (cachedEntries && (now - cacheTime) < CACHE_DURATION) {
      return cachedEntries;
    }

    // Generate large dataset for testing
    const entries = Array.from({ length: 1000 }, (_, index) => {
      const types: ("Fee" | "Salary" | "Petty Cash")[] = ["Fee", "Salary", "Petty Cash"];
      const statuses: ("Approved" | "Pending" | "Rejected")[] = ["Approved", "Pending", "Rejected"];
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const entry: JournalEntry = {
        id: index + 1,
        billNumber: `BILL${String(index + 1).padStart(4, '0')}`,
        type,
        amount: Math.floor(Math.random() * 100000) + 1000,
        status,
        date: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        description: `${type} transaction ${index + 1}`,
        attachments: Math.random() > 0.5 ? [`attachment_${index + 1}.pdf`] : [],
      };

      // Add student or employee based on type
      if (type === "Fee") {
        entry.student = `Student ${index + 1}`;
      } else if (type === "Salary") {
        entry.employee = `Employee ${index + 1}`;
      }

      return entry;
    });

    cachedEntries = entries;
    cacheTime = now;
    return entries;
  };
})();

// Memoized journal card component
const JournalCard = memo(({ 
  entry, 
  onEdit, 
  onDelete, 
  onView,
  selectedEntry,
  setSelectedEntry
}: { 
  entry: JournalEntry; 
  onEdit: (entry: JournalEntry) => void; 
  onDelete: (id: number) => void;
  onView: (entry: JournalEntry) => void;
  selectedEntry: JournalEntry | null;
  setSelectedEntry: (entry: JournalEntry | null) => void;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleView = useCallback(() => {
    setSelectedEntry(entry);
    onView(entry);
  }, [entry, setSelectedEntry, onView]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(entry);
  }, [entry, onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    onDelete(entry.id);
    setShowDeleteDialog(false);
  }, [entry.id, onDelete]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success text-success-foreground";
      case "Pending":
        return "bg-warning text-warning-foreground";
      case "Rejected":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  }, []);

  return (
    <>
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={handleView}
      >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {entry.type === "Fee" && (
                          <DollarSign className="w-5 h-5 text-primary" />
                        )}
                        {entry.type === "Salary" && (
                          <Wallet className="w-5 h-5 text-primary" />
                        )}
                        {entry.type === "Petty Cash" && (
                          <Receipt className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {entry.description}
                        </CardTitle>
                <CardDescription>
                  Bill No: {entry.billNumber}
                </CardDescription>
                        <CardDescription>
                          {entry.student && `Student: ${entry.student}`}
                          {entry.employee && `Employee: ${entry.employee}`}
                          {!entry.student &&
                            !entry.employee &&
                            `${entry.type} Entry`}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(entry.status)}>
                        {entry.status}
                      </Badge>
                      <span className="text-lg font-semibold">
                        ₹{entry.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Date: {entry.date}</span>
                      <span>Type: {entry.type}</span>
                      {entry.attachments.length > 0 && (
                        <span>{entry.attachments.length} attachment(s)</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                onClick={handleDelete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Journal Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this journal entry?
              <br />
              <strong>Bill No: {entry.billNumber}</strong>
              <br />
              <strong>Amount: ₹{entry.amount.toLocaleString()}</strong>
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

JournalCard.displayName = "JournalCard";

// Memoized search component
const SearchComponent = memo(({ 
  searchTerm, 
  onSearchChange 
}: { 
  searchTerm: string; 
  onSearchChange: (value: string) => void; 
}) => {
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search entries, bill numbers..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="pl-8 w-64"
      />
    </div>
  );
});

SearchComponent.displayName = "SearchComponent";

// Memoized filter tabs component
const FilterTabs = memo(({ 
  selectedTab, 
  onTabChange,
  journalEntries
}: { 
  selectedTab: string; 
  onTabChange: (value: string) => void; 
  journalEntries: JournalEntry[];
}) => {
  const allCount = journalEntries.length;
  const feesCount = journalEntries.filter(entry => entry.type === "Fee").length;
  const salariesCount = journalEntries.filter(entry => entry.type === "Salary").length;
  const pettyCashCount = journalEntries.filter(entry => entry.type === "Petty Cash").length;

  return (
    <TabsList>
      <TabsTrigger value="all" onClick={() => onTabChange("all")}>
        All Entries ({allCount})
      </TabsTrigger>
      <TabsTrigger value="fees" onClick={() => onTabChange("fees")}>
        Fees ({feesCount})
      </TabsTrigger>
      <TabsTrigger value="salaries" onClick={() => onTabChange("salaries")}>
        Salaries ({salariesCount})
      </TabsTrigger>
      <TabsTrigger value="petty" onClick={() => onTabChange("petty")}>
        Petty Cash ({pettyCashCount})
      </TabsTrigger>
    </TabsList>
  );
});

FilterTabs.displayName = "FilterTabs";

// Dummy data for dropdowns
const dummyStudents = [
  { id: 1, name: "John Doe", email: "john.doe@email.com" },
  { id: 2, name: "Jane Smith", email: "jane.smith@email.com" },
  { id: 3, name: "Mike Johnson", email: "mike.johnson@email.com" },
  { id: 4, name: "Sarah Wilson", email: "sarah.wilson@email.com" },
  { id: 5, name: "David Brown", email: "david.brown@email.com" },
];

const dummyEmployees = [
  { id: 1, name: "Alice Cooper", role: "Senior Developer", department: "IT" },
  { id: 2, name: "Bob Martin", role: "Marketing Manager", department: "Marketing" },
  { id: 3, name: "Carol Davis", role: "HR Specialist", department: "HR" },
  { id: 4, name: "Daniel Lee", role: "Finance Analyst", department: "Finance" },
  { id: 5, name: "Emma White", role: "Project Manager", department: "Operations" },
];

const dummyJournalTypes = [
  { id: 1, name: "Student Fee Payment", dashboards: ["Students", "Finance", "Reports"] },
  { id: 2, name: "Employee Salary", dashboards: ["HR", "Finance", "Reports"] },
  { id: 3, name: "Office Expenses", dashboards: ["Finance", "Reports"] },
  { id: 4, name: "Equipment Purchase", dashboards: ["Finance", "Reports"] },
  { id: 5, name: "Marketing Expenses", dashboards: ["Marketing", "Finance", "Reports"] },
];

// Edit Journal Entry Dialog Component
const EditJournalDialog = memo(({ 
  entry, 
  open, 
  onOpenChange, 
  onSave 
}: { 
  entry: JournalEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedEntry: JournalEntry) => void;
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'Fee' as "Fee" | "Salary" | "Petty Cash",
    status: 'Pending' as "Approved" | "Pending" | "Rejected",
    date: null as Date | null,
    student: '',
    employee: '',
    journalType: ''
  });

  // Initialize form data when entry changes
  useEffect(() => {
    if (entry) {
      setFormData({
        description: entry.description,
        amount: entry.amount.toString(),
        type: entry.type,
        status: entry.status,
        date: entry.date ? new Date(entry.date) : null,
        student: entry.student || '',
        employee: entry.employee || '',
        journalType: ''
      });
    }
  }, [entry]);

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) return;

    const updatedEntry: JournalEntry = {
      ...entry,
      description: formData.description,
      amount: parseFloat(formData.amount) || 0,
      type: formData.type,
      status: formData.status,
      date: formData.date ? formData.date.toISOString().split('T')[0] : '',
      student: formData.type === 'Fee' ? formData.student : undefined,
      employee: formData.type === 'Salary' ? formData.employee : undefined
    };

    onSave(updatedEntry);
    onOpenChange(false);
  };

  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Journal Entry</DialogTitle>
          <DialogDescription>
            Bill No: {entry.billNumber}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="col-span-3"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fee">Fee</SelectItem>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Petty Cash">Petty Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="journalType" className="text-right">
                Journal Type
              </Label>
              <Select value={formData.journalType} onValueChange={(value) => handleInputChange("journalType", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select journal type" />
                </SelectTrigger>
                <SelectContent>
                  {dummyJournalTypes.map((journalType) => (
                    <SelectItem key={journalType.id} value={journalType.name}>
                      <div className="flex flex-col">
                        <span>{journalType.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Appears in: {journalType.dashboards.join(", ")}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <CustomDatePicker
                  value={formData.date}
                  onChange={(date) => handleInputChange("date", date)}
                  placeholder="Select date"
                  size="md"
                  className="w-full"
                />
              </div>
            </div>
            {formData.type === 'Fee' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="student" className="text-right">
                  Student
                </Label>
                <Select value={formData.student} onValueChange={(value) => handleInputChange("student", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyStudents.map((student) => (
                      <SelectItem key={student.id} value={student.name}>
                        {student.name} - {student.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {formData.type === 'Salary' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employee" className="text-right">
                  Employee
                </Label>
                <Select value={formData.employee} onValueChange={(value) => handleInputChange("employee", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.name}>
                        {employee.name} - {employee.role} ({employee.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

EditJournalDialog.displayName = "EditJournalDialog";

// Virtual grid component for large datasets
const VirtualGrid = memo(({ 
  entries, 
  onEdit, 
  onDelete, 
  onView,
  selectedEntry,
  setSelectedEntry
}: { 
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: number) => void;
  onView: (entry: JournalEntry) => void;
  selectedEntry: JournalEntry | null;
  setSelectedEntry: (entry: JournalEntry | null) => void;
}) => {
  const ITEM_HEIGHT = 200; // Approximate height of each card
  const CONTAINER_HEIGHT = 600; // Height of the grid container
  const ITEMS_PER_ROW = 3; // Number of items per row

  const { 
    visibleItems, 
    containerRef, 
    totalHeight, 
    offsetY, 
    handleScroll 
  } = useVirtualScrolling(entries, ITEM_HEIGHT, CONTAINER_HEIGHT, 10);

  return (
    <>
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="overflow-auto"
        style={{ height: CONTAINER_HEIGHT }}
      >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((entry) => (
              <JournalCard
                key={entry.id}
                entry={entry}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                selectedEntry={selectedEntry}
                setSelectedEntry={setSelectedEntry}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
      
      {/* Journal Details Dialog */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <Suspense fallback={<div>Loading...</div>}>
            <LazyJournalDetailsDialog entry={selectedEntry} />
          </Suspense>
        </Dialog>
      )}
    </>
  );
});

VirtualGrid.displayName = "VirtualGrid";

const Journals = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Performance monitoring
  useEffect(() => {
    performanceLogger.logRender(performance.now());
  });

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtered entries
  const filteredEntries = useMemo(() => {
    const startTime = performance.now();
    
    let filtered = journalEntries.filter(
      (entry) =>
        entry.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        entry.billNumber.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (entry.student &&
          entry.student.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
        (entry.employee &&
          entry.employee.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );

    // Filter by tab
    if (selectedTab === "fees") {
      filtered = filtered.filter(entry => entry.type === "Fee");
    } else if (selectedTab === "salaries") {
      filtered = filtered.filter(entry => entry.type === "Salary");
    } else if (selectedTab === "petty") {
      filtered = filtered.filter(entry => entry.type === "Petty Cash");
    }

    const endTime = performance.now();
    performanceLogger.logRender(endTime - startTime);

    return filtered;
  }, [journalEntries, debouncedSearchTerm, selectedTab]);

  // Throttled handlers
  const handleEdit = useThrottle((entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  }, 300);

  const handleDelete = useThrottle((id: number) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== id));
  }, 300);

  const handleView = useThrottle((entry: JournalEntry) => {
    // View logic here
  }, 300);

  const handleSaveEdit = useCallback((updatedEntry: JournalEntry) => {
    setJournalEntries(prev => 
      prev.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
    setEditingEntry(null);
  }, []);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        const data = getDummyJournalEntries();
        setJournalEntries(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading journal entries:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle search change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Handle URL parameters for active tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setSelectedTab(tabParam);
    }
  }, [searchParams]);

  // Handle tab change with URL update
  const handleTabChange = useCallback((value: string) => {
    setSelectedTab(value);
    setSearchParams({ tab: value });
  }, [setSearchParams]);

  if (isLoading) {
    return <CardGridSkeleton cards={6} columns={3} showHeader={true} />;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Journals</h1>
            <p className="text-muted-foreground">
              Manage fees, salaries, and petty cash transactions ({journalEntries.length} total)
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <Suspense fallback={<div>Loading...</div>}>
                <LazyAddJournalDialog />
              </Suspense>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <FilterTabs 
              selectedTab={selectedTab}
              onTabChange={handleTabChange}
              journalEntries={journalEntries}
            />

            <div className="flex items-center space-x-2">
              <SearchComponent 
                searchTerm={searchTerm} 
                onSearchChange={handleSearchChange} 
              />
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            {filteredEntries.length > 0 ? (
              <VirtualGrid
                entries={filteredEntries}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                selectedEntry={selectedEntry}
                setSelectedEntry={setSelectedEntry}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No journal entries found matching your search.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="fees">
            {filteredEntries.length > 0 ? (
              <VirtualGrid
                entries={filteredEntries}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                selectedEntry={selectedEntry}
                setSelectedEntry={setSelectedEntry}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No fee entries found.
                </p>
              </div>
            )}
        </TabsContent>

        <TabsContent value="salaries">
            {filteredEntries.length > 0 ? (
              <VirtualGrid
                entries={filteredEntries}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                selectedEntry={selectedEntry}
                setSelectedEntry={setSelectedEntry}
              />
            ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
                  No salary entries found.
            </p>
          </div>
            )}
        </TabsContent>

        <TabsContent value="petty">
            {filteredEntries.length > 0 ? (
              <VirtualGrid
                entries={filteredEntries}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                selectedEntry={selectedEntry}
                setSelectedEntry={setSelectedEntry}
              />
            ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
                  No petty cash entries found.
            </p>
          </div>
            )}
        </TabsContent>
      </Tabs>

        {/* Edit Journal Dialog */}
        <EditJournalDialog
          entry={editingEntry}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEdit}
        />
    </div>
    </>
  );
};

export default memo(Journals);
