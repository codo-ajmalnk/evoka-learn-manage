import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  Edit,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback, memo, Suspense, lazy, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CardGridSkeleton } from "@/components/ui/skeletons/card-grid-skeleton";

// Lazy load components for better performance
const LazyAssignmentDetailsDialog = lazy(() => import('./AssignmentDetailsDialog.tsx'));
const LazyAddAssignmentDialog = lazy(() => import('./AddAssignmentDialog.tsx'));

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
      console.log(`Assignments render time: ${time.toFixed(2)}ms`);
    }
  }
};

interface Assignment {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  dateCreated: string;
  dueDate: string;
  submissionDate?: string;
  grade?: number;
  maxGrade: number;
  stars?: number;
  maxStars: number;
  studentId: string;
  studentName: string;
  batchId: string;
  batchName: string;
  tutorId: string;
  tutorName: string;
  attachments: string[];
  submissions: {
    id: string;
    fileName: string;
    submittedAt: string;
    size: string;
  }[];
  feedback?: string;
}

// Memoized assignment data with caching
const getDummyAssignments = (() => {
  let cachedAssignments: Assignment[] | null = null;
  let cacheTime = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  return () => {
    const now = Date.now();
    if (cachedAssignments && (now - cacheTime) < CACHE_DURATION) {
      return cachedAssignments;
    }

    // Generate large dataset for testing
    const assignments = Array.from({ length: 1000 }, (_, index) => {
      const categories = ["Design", "Marketing", "Research", "Development", "Content"];
      const statuses: ("pending" | "submitted" | "graded" | "overdue")[] = ["pending", "submitted", "graded", "overdue"];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const assignment: Assignment = {
        id: `ASG${String(index + 1).padStart(3, '0')}`,
        title: `Assignment ${index + 1}: ${category} Project`,
        description: `This is a comprehensive ${category.toLowerCase()} assignment that requires students to demonstrate their skills and knowledge in the field.`,
        category,
        status,
        dateCreated: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        dueDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        maxGrade: 100,
        maxStars: 5,
        studentId: `STU${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
        studentName: `Student ${Math.floor(Math.random() * 100) + 1}`,
        batchId: `BAT${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}`,
        batchName: `Batch ${Math.floor(Math.random() * 10) + 1}`,
        tutorId: `TUT${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
        tutorName: `Tutor ${Math.floor(Math.random() * 20) + 1}`,
        attachments: Math.random() > 0.3 ? [`assignment_${index + 1}.pdf`] : [],
        submissions: Math.random() > 0.5 ? [{
          id: `SUB${index + 1}`,
          fileName: `submission_${index + 1}.zip`,
          submittedAt: new Date().toISOString(),
          size: `${Math.floor(Math.random() * 50) + 1} MB`
        }] : [],
      };

      // Add submission date if submitted or graded
      if (status === "submitted" || status === "graded") {
        assignment.submissionDate = assignment.dueDate;
      }

      // Add grade and stars if graded
      if (status === "graded") {
        assignment.grade = Math.floor(Math.random() * 40) + 60; // 60-100
        assignment.stars = Math.floor(Math.random() * 3) + 3; // 3-5
        assignment.feedback = "Good work! Keep improving your skills.";
      }

      return assignment;
    });

    cachedAssignments = assignments;
    cacheTime = now;
    return assignments;
  };
})();

// Memoized assignment row component
const AssignmentRow = memo(({ 
  assignment, 
  onEdit, 
  onDelete, 
  onView,
  selectedAssignment,
  setSelectedAssignment,
  userRole
}: { 
  assignment: Assignment; 
  onEdit: (assignment: Assignment) => void; 
  onDelete: (id: string) => void;
  onView: (assignment: Assignment) => void;
  selectedAssignment: Assignment | null;
  setSelectedAssignment: (assignment: Assignment | null) => void;
  userRole: string;
}) => {
  const handleView = useCallback(() => {
    setSelectedAssignment(assignment);
    onView(assignment);
  }, [assignment, setSelectedAssignment, onView]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(assignment);
  }, [assignment, onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(assignment.id);
  }, [assignment.id, onDelete]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "submitted":
        return "info";
      case "graded":
        return "success";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  }, []);

  const getProgressValue = useCallback((assignment: Assignment) => {
    if (assignment.status === "pending") return 25;
    if (assignment.status === "submitted") return 75;
    if (assignment.status === "graded") return 100;
    if (assignment.status === "overdue") return 10;
    return 0;
  }, []);

  return (
    <tr className="border-b hover:bg-muted/50 cursor-pointer transition-colors" onClick={handleView}>
      <td className="p-2">
          <div>
          <p className="font-medium">{assignment.title}</p>
            <p className="text-sm text-muted-foreground">
            {assignment.id}
            </p>
          </div>
      </td>
      <td className="p-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {assignment.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {assignment.studentName}
                  </p>
                  <p className="text-xs text-muted-foreground">
              {assignment.batchName}
                  </p>
                </div>
              </div>
      </td>
      <td className="p-2">
              <Badge variant="secondary">{assignment.category}</Badge>
      </td>
      <td className="p-2">
        <div>
              <p className="text-sm">{assignment.dueDate}</p>
          {assignment.status === "overdue" && (
            <p className="text-xs text-destructive">Overdue</p>
          )}
            </div>
      </td>
      <td className="p-2">
            <Badge variant={getStatusColor(assignment.status)}>
          {assignment.status}
            </Badge>
      </td>
      <td className="p-2">
        {assignment.grade !== undefined ? (
                  <div className="flex items-center gap-2">
            <span className="font-medium">
              {assignment.grade}/{assignment.maxGrade}
                    </span>
            <div className="flex">
              {Array.from(
                { length: assignment.maxStars },
                (_, i) => (
                      <Star
                        key={i}
                    className={`h-3 w-3 ${
                          i < (assignment.stars || 0)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                )
              )}
                  </div>
                </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>
      <td className="p-2">
        <div className="w-20">
          <Progress
            value={getProgressValue(assignment)}
            className="h-2"
          />
              </div>
      </td>
      <td className="p-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {(userRole === "admin" || userRole === "tutor") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
              )}
            </div>
      </td>
    </tr>
  );
});

AssignmentRow.displayName = "AssignmentRow";

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
        placeholder="Search assignments..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="pl-10 w-full sm:w-64"
                  />
                </div>
  );
});

SearchComponent.displayName = "SearchComponent";

// Memoized filter tabs component
const FilterTabs = memo(({ 
  activeTab, 
  onTabChange, 
  assignments 
}: { 
  activeTab: string; 
  onTabChange: (value: string) => void; 
  assignments: Assignment[];
}) => {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto">
              <Button
        variant={activeTab === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onTabChange("all")}
      >
        All ({assignments.length})
      </Button>
      <Button
        variant={activeTab === "pending" ? "default" : "outline"}
        size="sm"
        onClick={() => onTabChange("pending")}
      >
        Pending ({assignments.filter((a) => a.status === "pending").length})
      </Button>
      <Button
        variant={activeTab === "submitted" ? "default" : "outline"}
        size="sm"
        onClick={() => onTabChange("submitted")}
      >
        Submitted ({assignments.filter((a) => a.status === "submitted").length})
      </Button>
      <Button
        variant={activeTab === "graded" ? "default" : "outline"}
        size="sm"
        onClick={() => onTabChange("graded")}
      >
        Graded ({assignments.filter((a) => a.status === "graded").length})
      </Button>
      <Button
        variant={activeTab === "overdue" ? "default" : "outline"}
        size="sm"
        onClick={() => onTabChange("overdue")}
      >
        Overdue ({assignments.filter((a) => a.status === "overdue").length})
              </Button>
            </div>
  );
});

FilterTabs.displayName = "FilterTabs";

// Virtual table component for large datasets
const VirtualTable = memo(({ 
  assignments, 
  onEdit, 
  onDelete, 
  onView,
  selectedAssignment,
  setSelectedAssignment,
  userRole
}: { 
  assignments: Assignment[];
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
  onView: (assignment: Assignment) => void;
  selectedAssignment: Assignment | null;
  setSelectedAssignment: (assignment: Assignment | null) => void;
  userRole: string;
}) => {
  const ITEM_HEIGHT = 80; // Approximate height of each row
  const CONTAINER_HEIGHT = 600; // Height of the table container

  const { 
    visibleItems, 
    containerRef, 
    totalHeight, 
    offsetY, 
    handleScroll 
  } = useVirtualScrolling(assignments, ITEM_HEIGHT, CONTAINER_HEIGHT, 10);

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
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Assignment</th>
                  <th className="text-left p-2">Student</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Due Date</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Grade</th>
                  <th className="text-left p-2">Progress</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((assignment) => (
                  <AssignmentRow
                    key={assignment.id}
                    assignment={assignment}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                    selectedAssignment={selectedAssignment}
                    setSelectedAssignment={setSelectedAssignment}
                    userRole={userRole}
                  />
                ))}
              </tbody>
            </table>
                  </div>
                </div>
          </div>

      {/* Assignment Details Dialog */}
      {selectedAssignment && (
        <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
          <Suspense fallback={<div>Loading...</div>}>
            <LazyAssignmentDetailsDialog assignment={selectedAssignment} />
          </Suspense>
        </Dialog>
      )}
    </>
  );
});

VirtualTable.displayName = "VirtualTable";

const Assignments = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Performance monitoring
  useEffect(() => {
    performanceLogger.logRender(performance.now());
  });

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get user role
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role || "admin";

  // Memoized filtered assignments
  const filteredAssignments = useMemo(() => {
    const startTime = performance.now();
    
    let filtered = assignments.filter((assignment) => {
      const matchesSearch =
        `${assignment.title} ${assignment.studentName} ${assignment.category} ${assignment.id}`
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());

      if (activeTab === "all") return matchesSearch;
      if (activeTab === "pending")
        return matchesSearch && assignment.status === "pending";
      if (activeTab === "submitted")
        return matchesSearch && assignment.status === "submitted";
      if (activeTab === "graded")
        return matchesSearch && assignment.status === "graded";
      if (activeTab === "overdue")
        return matchesSearch && assignment.status === "overdue";

      return matchesSearch;
    });

    const endTime = performance.now();
    performanceLogger.logRender(endTime - startTime);

    return filtered;
  }, [assignments, debouncedSearchTerm, activeTab]);

  // Throttled handlers
  const handleEdit = useThrottle((assignment: Assignment) => {
    toast({
      title: "Edit Assignment",
      description: `Editing assignment: ${assignment.title}`,
    });
  }, 300);

  const handleDelete = useThrottle((id: string) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
    toast({
      title: "Assignment Deleted",
      description: "Assignment has been successfully deleted.",
    });
  }, 300);

  const handleView = useThrottle((assignment: Assignment) => {
    // View logic here
  }, 300);

  const handleGradeSubmission = useThrottle((
    assignmentId: string,
    grade: number,
    stars: number,
    feedback: string
  ) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, grade, stars, feedback, status: "graded" as const }
          : assignment
      )
    );
    toast({
      title: "Assignment Graded",
      description: "Grade and feedback have been submitted successfully.",
    });
  }, 300);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1100));
        const data = getDummyAssignments();
        setAssignments(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading assignments:', error);
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
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Handle tab change with URL update
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  }, [setSearchParams]);

  if (isLoading) {
    return <CardGridSkeleton cards={8} showHeader={true} />;
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Assignments Management</h1>
          <p className="text-muted-foreground">
              Track and manage student assignments ({assignments.length} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/students')}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Students
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/tutors')}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Tutors
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/executives')}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Executives
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/managers')}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Managers
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/hr')}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            HR
          </Button>
        {(userRole === "admin" || userRole === "tutor") && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
            <Plus className="h-4 w-4" />
                  Add Assignment
          </Button>
              </DialogTrigger>
              <Suspense fallback={<div>Loading...</div>}>
                <LazyAddAssignmentDialog />
              </Suspense>
            </Dialog>
        )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Assignments
                </p>
                <p className="text-xl font-semibold">{assignments.length}</p>
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
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-semibold">
                  {assignments.filter((a) => a.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <GraduationCap className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-xl font-semibold">
                  {assignments.filter((a) => a.status === "submitted").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Star className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Graded</p>
                <p className="text-xl font-semibold">
                  {assignments.filter((a) => a.status === "graded").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Assignments List</CardTitle>
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
        </CardHeader>

        <CardContent>
            <FilterTabs 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              assignments={assignments}
            />

            {filteredAssignments.length > 0 ? (
              <VirtualTable
                assignments={filteredAssignments}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                selectedAssignment={selectedAssignment}
                setSelectedAssignment={setSelectedAssignment}
                userRole={userRole}
              />
            ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No assignments found matching your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default memo(Assignments);
