import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Download,
  Plus,
  Search,
  Upload,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback, memo, Suspense, lazy, useRef, Component, ReactNode } from "react";
import { CardGridSkeleton } from "@/components/ui/skeletons/card-grid-skeleton";

// Inline dialog components to avoid import issues

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

// Simple error boundary component
class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Simple performance logger
const performanceLogger = {
  logRender: (time: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Attendance render time: ${time.toFixed(2)}ms`);
    }
  }
};

interface AttendanceRecord {
  id: number;
  name: string;
  role: string;
  date: string;
  status: "Present" | "Absent" | "Late";
  timeIn: string;
  timeOut: string;
  batch: string;
}

interface LeaveRequest {
  id: number;
  name: string;
  role: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
}

// Memoized attendance data with caching
const getDummyAttendanceRecords = (() => {
  let cachedRecords: AttendanceRecord[] | null = null;
  let cacheTime = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  return () => {
    const now = Date.now();
    if (cachedRecords && (now - cacheTime) < CACHE_DURATION) {
      return cachedRecords;
    }

    // Generate large dataset for testing
    const records = Array.from({ length: 1000 }, (_, index) => {
      const roles = ["Student", "Tutor", "Executive", "Manager", "HR"];
      const statuses: ("Present" | "Absent" | "Late")[] = ["Present", "Absent", "Late"];
      const batches = ["Web Development", "Digital Marketing", "Graphic Design", "Data Science", "Mobile Development"];
      
      const role = roles[Math.floor(Math.random() * roles.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const batch = batches[Math.floor(Math.random() * batches.length)];
      
      const record: AttendanceRecord = {
        id: index + 1,
        name: `Person ${index + 1}`,
        role,
        date: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        status,
        timeIn: status === "Absent" ? "-" : `${String(Math.floor(Math.random() * 3) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM`,
        timeOut: status === "Absent" ? "-" : `${String(Math.floor(Math.random() * 3) + 5).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} PM`,
        batch,
      };

      return record;
    });

    cachedRecords = records;
    cacheTime = now;
    return records;
  };
})();

// Memoized leave requests data with caching
const getDummyLeaveRequests = (() => {
  let cachedRequests: LeaveRequest[] | null = null;
  let cacheTime = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  return () => {
    const now = Date.now();
    if (cachedRequests && (now - cacheTime) < CACHE_DURATION) {
      return cachedRequests;
    }

    // Generate large dataset for testing
    const requests = Array.from({ length: 500 }, (_, index) => {
      const roles = ["Student", "Tutor", "Executive", "Manager", "HR"];
      const leaveTypes = ["Sick Leave", "Personal Leave", "Vacation", "Emergency Leave"];
      const statuses: ("Pending" | "Approved" | "Rejected")[] = ["Pending", "Approved", "Rejected"];
      
      const role = roles[Math.floor(Math.random() * roles.length)];
      const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const request: LeaveRequest = {
        id: index + 1,
        name: `Person ${index + 1}`,
        role,
        leaveType,
        fromDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        toDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        status,
        reason: `Reason for leave request ${index + 1}`,
      };

      return request;
    });

    cachedRequests = requests;
    cacheTime = now;
    return requests;
  };
})();

// Memoized attendance record card component
const AttendanceRecordCard = memo(({ record }: { record: AttendanceRecord }) => {
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Present":
        return "bg-success text-success-foreground";
      case "Absent":
        return "bg-destructive text-destructive-foreground";
      case "Late":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {record.status === "Present" ? (
                <UserCheck className="w-5 h-5 text-success" />
              ) : (
                <UserX className="w-5 h-5 text-destructive" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{record.name}</CardTitle>
              <CardDescription>
                {record.role} - {record.batch}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(record.status)}>
              {record.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Date:</span>
            <p className="text-muted-foreground">{record.date}</p>
          </div>
          <div>
            <span className="font-medium">Time In:</span>
            <p className="text-muted-foreground">{record.timeIn}</p>
          </div>
          <div>
            <span className="font-medium">Time Out:</span>
            <p className="text-muted-foreground">{record.timeOut}</p>
          </div>
          <div>
            <span className="font-medium">Status:</span>
            <p className="text-muted-foreground">{record.status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

AttendanceRecordCard.displayName = "AttendanceRecordCard";

// Memoized leave request card component
const LeaveRequestCard = memo(({ leave }: { leave: LeaveRequest }) => {
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

  const handleApprove = useCallback(() => {
    // Handle approve logic
  }, []);

  const handleReject = useCallback(() => {
    // Handle reject logic
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{leave.name}</CardTitle>
            <CardDescription>
              {leave.role} - {leave.leaveType}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(leave.status)}>
            {leave.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Duration:</span>
            <p className="text-muted-foreground">
              {leave.fromDate} to {leave.toDate}
            </p>
          </div>
          <div>
            <span className="font-medium">Reason:</span>
            <p className="text-muted-foreground">{leave.reason}</p>
          </div>
          <div className="flex space-x-2">
            {leave.status === "Pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-success"
                  onClick={handleApprove}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

LeaveRequestCard.displayName = "LeaveRequestCard";

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
        placeholder="Search attendance..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="pl-8 w-64"
      />
    </div>
  );
});

SearchComponent.displayName = "SearchComponent";

// Virtual list component for large datasets
const VirtualList = memo(({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem 
}: { 
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any) => React.ReactNode;
}) => {
  const { 
    visibleItems, 
    containerRef, 
    totalHeight, 
    offsetY, 
    handleScroll 
  } = useVirtualScrolling(items, itemHeight, containerHeight, 10);

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="overflow-auto"
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          <div className="grid gap-4">
            {visibleItems.map((item) => renderItem(item))}
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualList.displayName = "VirtualList";

// Inline dialog components
const AddAttendanceDialog = memo(() => {
  const [formData, setFormData] = useState({
    person: "",
    status: "",
    timeIn: "",
    timeOut: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Mark Attendance</DialogTitle>
        <DialogDescription>
          Record attendance for students or staff
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="person" className="text-right">
              Person
            </Label>
            <Select value={formData.person} onValueChange={(value) => handleInputChange("person", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john">John Doe (Student)</SelectItem>
                <SelectItem value="jane">Jane Smith (Tutor)</SelectItem>
                <SelectItem value="mike">Mike Johnson (Student)</SelectItem>
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
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeIn" className="text-right">
              Time In
            </Label>
            <Input 
              id="timeIn" 
              type="time" 
              className="col-span-3"
              value={formData.timeIn}
              onChange={(e) => handleInputChange("timeIn", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeOut" className="text-right">
              Time Out
            </Label>
            <Input 
              id="timeOut" 
              type="time" 
              className="col-span-3"
              value={formData.timeOut}
              onChange={(e) => handleInputChange("timeOut", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            Save Attendance
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
});

const LeaveRequestDialog = memo(() => {
  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Submit Leave Request</DialogTitle>
        <DialogDescription>
          Request leave for specific dates
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="leaveType" className="text-right">
              Leave Type
            </Label>
            <Select value={formData.leaveType} onValueChange={(value) => handleInputChange("leaveType", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="emergency">Emergency Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fromDate" className="text-right">
              From Date
            </Label>
            <Input 
              id="fromDate" 
              type="date" 
              className="col-span-3"
              value={formData.fromDate}
              onChange={(e) => handleInputChange("fromDate", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="toDate" className="text-right">
              To Date
            </Label>
            <Input 
              id="toDate" 
              type="date" 
              className="col-span-3"
              value={formData.toDate}
              onChange={(e) => handleInputChange("toDate", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Reason
            </Label>
            <Input
              id="reason"
              placeholder="Enter reason for leave"
              className="col-span-3"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            Submit Request
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
});

const Attendance = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  // Performance monitoring
  useEffect(() => {
    performanceLogger.logRender(performance.now());
  });

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtered records
  const filteredRecords = useMemo(() => {
    const startTime = performance.now();
    
    let filtered = attendanceRecords.filter(
      (record) =>
        record.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        record.role.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        record.batch.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const endTime = performance.now();
    performanceLogger.logRender(endTime - startTime);

    return filtered;
  }, [attendanceRecords, debouncedSearchTerm]);

  // Throttled handlers
  const handleApproveLeave = useThrottle((id: number) => {
    setLeaveRequests(leaveRequests.map(leave => 
      leave.id === id ? { ...leave, status: "Approved" as const } : leave
    ));
  }, 300);

  const handleRejectLeave = useThrottle((id: number) => {
    setLeaveRequests(leaveRequests.map(leave => 
      leave.id === id ? { ...leave, status: "Rejected" as const } : leave
    ));
  }, 300);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const recordsData = getDummyAttendanceRecords();
        const requestsData = getDummyLeaveRequests();
        setAttendanceRecords(recordsData);
        setLeaveRequests(requestsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading attendance data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle search change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  if (isLoading) {
    return <CardGridSkeleton cards={6} showHeader={true} />;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Attendance Management
            </h1>
            <p className="text-muted-foreground">
              Track attendance for students and staff ({attendanceRecords.length} records)
            </p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Leave Request
                </Button>
              </DialogTrigger>
              <LeaveRequestDialog />
            </Dialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Mark Attendance
                </Button>
              </DialogTrigger>
              <AddAttendanceDialog />
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Daily Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave Requests</TabsTrigger>
            <TabsTrigger value="upload">CSV Upload</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SearchComponent 
                  searchTerm={searchTerm} 
                  onSearchChange={handleSearchChange} 
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {filteredRecords.length > 0 ? (
              <VirtualList
                items={filteredRecords}
                itemHeight={120}
                containerHeight={600}
                renderItem={(record) => <AttendanceRecordCard key={record.id} record={record} />}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No attendance records found matching your search.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            {leaveRequests.length > 0 ? (
              <VirtualList
                items={leaveRequests}
                itemHeight={140}
                containerHeight={600}
                renderItem={(leave) => <LeaveRequestCard key={leave.id} leave={leave} />}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No leave requests found.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Attendance CSV</CardTitle>
                <CardDescription>
                  Upload attendance data using CSV file format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drop your CSV file here or click to browse
                  </p>
                  <Input type="file" accept=".csv" className="max-w-xs mx-auto" />
                </div>
                <div className="flex justify-between">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Sample Template
                  </Button>
                  <Button>Upload CSV</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Today's Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Present:</span>
                      <span className="font-semibold text-success">
                        {attendanceRecords.filter(r => r.status === "Present").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Absent:</span>
                      <span className="font-semibold text-destructive">
                        {attendanceRecords.filter(r => r.status === "Absent").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late:</span>
                      <span className="font-semibold text-warning">
                        {attendanceRecords.filter(r => r.status === "Late").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Attendance:</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Working Days:</span>
                      <span className="font-semibold">22</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Daily Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Monthly Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default memo(Attendance);
