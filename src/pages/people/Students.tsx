import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/skeletons/table-skeleton";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Filter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback, memo, Suspense, lazy, useRef } from "react";
import { useBatches } from "@/contexts/BatchContext";
import { useNavigate, useSearchParams } from "react-router-dom";

// Add custom CSS for scrollbar hiding
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
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

// Lazy load components for better performance
const LazyStudentDetailsDialog = lazy(() => import('../dialogs/StudentDetailsDialog'));
const LazyAddStudentDialog = lazy(() => import('../dialogs/AddStudentDialog'));

// Simple performance logger
const performanceLogger = {
  logRender: (time: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Students render time: ${time.toFixed(2)}ms`);
    }
  }
};

// Memoized student data with caching
const getDummyStudents = (() => {
  let cachedStudents: any[] | null = null;
  let cacheTime = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  return () => {
    const now = Date.now();
    if (cachedStudents && (now - cacheTime) < CACHE_DURATION) {
      return cachedStudents;
    }

    // Generate large dataset for testing
    const students = Array.from({ length: 1000 }, (_, index) => ({
      id: `STU${String(index + 1).padStart(3, '0')}`,
      firstName: `Student${index + 1}`,
      lastName: `Last${index + 1}`,
      email: `student${index + 1}@email.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      whatsapp: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      address: `${Math.floor(Math.random() * 999) + 1} Street, City ${index + 1}`,
      dob: `199${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      gender: Math.random() > 0.5 ? "Male" : "Female",
      bloodGroup: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"][Math.floor(Math.random() * 8)],
      qualification: ["Bachelor's in Arts", "Bachelor's in Commerce", "Bachelor's in Science"][Math.floor(Math.random() * 3)],
      percentage: Math.floor(Math.random() * 30) + 70,
      fatherName: `Father${index + 1}`,
      motherName: `Mother${index + 1}`,
      batch: [`Batch A - 2025`, `Batch B - 2025`, `Batch C - 2025`][Math.floor(Math.random() * 3)],
      status: Math.random() > 0.1 ? "Active" : "Inactive",
      joinDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      totalFees: 50000,
      paidFees: Math.floor(Math.random() * 50000),
      pendingFees: 0,
      attendanceRate: Math.floor(Math.random() * 30) + 70,
      assignments: Math.floor(Math.random() * 20) + 10,
      pendingAssignments: Math.floor(Math.random() * 5),
    }));

    // Calculate pending fees
    students.forEach(student => {
      student.pendingFees = student.totalFees - student.paidFees;
    });

    cachedStudents = students;
    cacheTime = now;
    return students;
  };
})();

// Memoized student row component
const StudentRow = memo(({ 
  student, 
  onEdit, 
  onDelete, 
  onView,
  selectedStudent,
  setSelectedStudent 
}: { 
  student: any; 
  onEdit: (student: any) => void; 
  onDelete: (id: string) => void;
  onView: (student: any) => void;
  selectedStudent: any;
  setSelectedStudent: (student: any) => void;
}) => {
  const handleView = useCallback(() => {
    setSelectedStudent(student);
    onView(student);
  }, [student, setSelectedStudent, onView]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(student);
  }, [student, onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(student.id);
  }, [student.id, onDelete]);

  return (
                  <TableRow 
                    key={student.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={handleView}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {student.firstName.charAt(0)}
                            {student.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{student.id}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{student.phone}</p>
                        <p className="text-xs text-muted-foreground">
                          WhatsApp: {student.whatsapp}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{student.batch}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">
                          ₹{student.paidFees.toLocaleString()} / ₹
                          {student.totalFees.toLocaleString()}
                        </p>
                        <div className="w-20 bg-muted rounded-full h-1">
                          <div
                            className="bg-success h-1 rounded-full"
                            style={{
                width: `${(student.paidFees / student.totalFees) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.attendanceRate > 90
                            ? "default"
                            : student.attendanceRate > 75
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {student.attendanceRate}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEdit}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDelete}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
  );
});

StudentRow.displayName = "StudentRow";

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
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search students..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="pl-10 w-full sm:w-64"
      />
    </div>
  );
});

SearchComponent.displayName = "SearchComponent";

// Simple filter tabs component
const FilterTabs = memo(({ 
  activeFilter, 
  onFilterChange, 
  students, 
  uniqueBatches 
}: { 
  activeFilter: string; 
  onFilterChange: (value: string) => void; 
  students: any[];
  uniqueBatches: string[];
}) => {
  const activeCount = useMemo(() => students.filter((s) => s.status === "Active").length, [students]);
  const inactiveCount = useMemo(() => students.filter((s) => s.status === "Inactive").length, [students]);

  return (
    <div className="mt-4">
      <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full">
        <TabsList className="flex flex-wrap w-full gap-1 h-auto p-1">
          <TabsTrigger 
            value="all" 
            className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-2 h-auto whitespace-nowrap flex-shrink-0"
          >
            All ({students.length})
          </TabsTrigger>
          <TabsTrigger 
            value="active" 
            className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-2 h-auto whitespace-nowrap flex-shrink-0"
          >
            Active ({activeCount})
          </TabsTrigger>
          <TabsTrigger 
            value="inactive" 
            className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-2 h-auto whitespace-nowrap flex-shrink-0"
          >
            Inactive ({inactiveCount})
          </TabsTrigger>
          {uniqueBatches.map((batch) => (
            <TabsTrigger 
              key={batch} 
              value={batch} 
              className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-2 h-auto whitespace-nowrap flex-shrink-0"
            >
              {batch} ({students.filter((s) => s.batch === batch).length})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
});

FilterTabs.displayName = "FilterTabs";

// Virtual table component for large datasets
const VirtualTable = memo(({ 
  students, 
  onEdit, 
  onDelete, 
  onView,
  selectedStudent,
  setSelectedStudent 
}: { 
  students: any[];
  onEdit: (student: any) => void;
  onDelete: (id: string) => void;
  onView: (student: any) => void;
  selectedStudent: any;
  setSelectedStudent: (student: any) => void;
}) => {
  const ITEM_HEIGHT = 80; // Approximate height of each row
  const CONTAINER_HEIGHT = 600; // Height of the table container

  const { 
    visibleItems, 
    containerRef, 
    totalHeight, 
    offsetY, 
    handleScroll 
  } = useVirtualScrolling(students, ITEM_HEIGHT, CONTAINER_HEIGHT, 10);

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Fees Status</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleItems.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                    selectedStudent={selectedStudent}
                    setSelectedStudent={setSelectedStudent}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {/* Student Details Dialog */}
      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <Suspense fallback={<div>Loading...</div>}>
            <LazyStudentDetailsDialog student={selectedStudent} />
          </Suspense>
        </Dialog>
      )}
    </>
  );
});

VirtualTable.displayName = "VirtualTable";

const Students = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();
  const { batches } = useBatches();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Inject custom styles for scrollbar hiding
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = scrollbarHideStyles;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Performance monitoring
  useEffect(() => {
    performanceLogger.logRender(performance.now());
  });

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtered students
  const filteredStudents = useMemo(() => {
    const startTime = performance.now();
    
    const filtered = students.filter((student) => {
      const matchesSearch =
        `${student.firstName} ${student.lastName} ${student.email} ${student.id}`
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "active" && student.status === "Active") ||
        (activeFilter === "inactive" && student.status === "Inactive") ||
        (activeFilter === student.batch);

      return matchesSearch && matchesFilter;
    });

    const endTime = performance.now();
    performanceLogger.logRender(endTime - startTime);

    return filtered;
  }, [students, debouncedSearchTerm, activeFilter]);

  // Memoized unique batches
  const uniqueBatches = useMemo(() => {
    return [...new Set([
      ...students.map(student => student.batch),
      ...batches.map(batch => batch.name)
    ])];
  }, [students, batches]);

  // Throttled handlers
  const handleEdit = useThrottle((student: any) => {
    toast({
      title: "Edit Student",
      description: `Editing ${student.firstName} ${student.lastName}`,
    });
  }, 300);

  const handleDelete = useThrottle((id: string) => {
    setStudents(prev => prev.filter((student) => student.id !== id));
    toast({
      title: "Student Deleted",
      description: "Student has been successfully deleted.",
    });
  }, 300);

  const handleView = useThrottle((student: any) => {
    // View logic here
  }, 300);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        const data = getDummyStudents();
        setStudents(data);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading students:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle search change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Handle URL parameters for active filter
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setActiveFilter(filterParam);
    }
  }, [searchParams]);

  // Handle filter change with URL update
  const handleFilterChange = useCallback((value: string) => {
    setActiveFilter(value);
    setSearchParams({ filter: value });
  }, [setSearchParams]);

  if (isLoading) {
    return <TableSkeleton title="Students" subtitle="Manage student information and records" />;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">
              Manage student information and records ({students.length} total)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/settings?tab=batches')}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Manage Batches
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <Suspense fallback={<div>Loading...</div>}>
                <LazyAddStudentDialog />
              </Suspense>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-xl font-semibold">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Students</p>
                  <p className="text-xl font-semibold">
                    {students.filter((s) => s.status === "Active").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Fees</p>
                  <p className="text-xl font-semibold">
                    {students.filter((s) => s.pendingFees > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Attendance</p>
                  <p className="text-xl font-semibold">
                    {Math.round(
                      students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length
                    )}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Student List</CardTitle>
                <CardDescription>
                  View and manage all students ({filteredStudents.length} filtered)
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <SearchComponent 
                  searchTerm={searchTerm} 
                  onSearchChange={handleSearchChange} 
                />
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <FilterTabs 
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              students={students}
              uniqueBatches={uniqueBatches}
            />
          </CardHeader>

          <CardContent>
            {filteredStudents.length > 0 ? (
              <VirtualTable
                students={filteredStudents}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                selectedStudent={selectedStudent}
                setSelectedStudent={setSelectedStudent}
              />
            ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No students found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default memo(Students);

