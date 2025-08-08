import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomDatePicker, CustomTimePicker } from "@/components/ui/custom-date-picker";
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

import {
  Calendar as CalendarIcon,
  Clock,
  Download,
  Plus,
  Search,
  Upload,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback, memo, Suspense, lazy, useRef, Component, ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLeaveTypes } from "@/contexts/LeaveTypesContext";
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
  status: "Pending" | "Approved" | "Rejected" | "Discussion";
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
      const statuses: ("Pending" | "Approved" | "Rejected" | "Discussion")[] = ["Pending", "Approved", "Rejected", "Discussion"];
      
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
const AttendanceRecordCard = memo(({ 
  record, 
  onView,
  selectedRecord,
  setSelectedRecord
}: { 
  record: AttendanceRecord;
  onView: (record: AttendanceRecord) => void;
  selectedRecord: AttendanceRecord | null;
  setSelectedRecord: (record: AttendanceRecord | null) => void;
}) => {
  const handleView = useCallback(() => {
    setSelectedRecord(record);
    onView(record);
  }, [record, setSelectedRecord, onView]);

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
    <Card 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={handleView}
    >
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
const LeaveRequestCard = memo(({ 
  leave, 
  onView,
  selectedLeave,
  setSelectedLeave,
  onApprove,
  onReject,
  onDiscuss
}: { 
  leave: LeaveRequest;
  onView: (leave: LeaveRequest) => void;
  selectedLeave: LeaveRequest | null;
  setSelectedLeave: (leave: LeaveRequest | null) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDiscuss: (id: number) => void;
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'discuss' | null>(null);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success text-success-foreground";
      case "Pending":
        return "bg-warning text-warning-foreground";
      case "Rejected":
        return "bg-destructive text-destructive-foreground";
      case "Discussion":
        return "bg-blue-600 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  }, []);

  const handleView = useCallback(() => {
    setSelectedLeave(leave);
    onView(leave);
  }, [leave, setSelectedLeave, onView]);

  const handleApprove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmAction('approve');
    setShowConfirmDialog(true);
  }, []);

  const handleReject = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmAction('reject');
    setShowConfirmDialog(true);
  }, []);

  const handleDiscuss = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmAction('discuss');
    setShowConfirmDialog(true);
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (confirmAction === 'approve') {
      onApprove(leave.id);
    } else if (confirmAction === 'reject') {
      onReject(leave.id);
    } else if (confirmAction === 'discuss') {
      onDiscuss(leave.id);
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  }, [confirmAction, leave.id, onApprove, onReject, onDiscuss]);

  return (
    <>
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={handleView}
      >
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600"
                    onClick={handleDiscuss}
                  >
                    Discussion
                  </Button>
                </>
              )}
              {leave.status === "Discussion" && (
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

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent>
              <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
                <DialogDescription>
              {confirmAction === 'approve' && `Are you sure you want to approve ${leave.name}'s leave request?`}
              {confirmAction === 'reject' && `Are you sure you want to reject ${leave.name}'s leave request?`}
              {confirmAction === 'discuss' && `Are you sure you want to start a discussion with ${leave.name} about their leave request?`}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
                <Button
              onClick={handleConfirmAction}
              className={
                confirmAction === 'approve' ? 'bg-success hover:bg-success/90' :
                confirmAction === 'reject' ? 'bg-destructive hover:bg-destructive/90' :
                'bg-blue-600 hover:bg-blue-700'
              }
            >
              {confirmAction === 'approve' ? 'Approve' :
               confirmAction === 'reject' ? 'Reject' :
               'Discussion'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    </>
  );
});

LeaveRequestCard.displayName = "LeaveRequestCard";

// CSV Upload Section Component
const CSVUploadSection = memo(({ 
  onUploadSuccess 
}: { 
  onUploadSuccess: (records: AttendanceRecord[]) => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewData, setPreviewData] = useState<AttendanceRecord[]>([]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setUploadStatus('idle');
      setErrorMessage('');
      parseCSVFile(file);
    } else {
      setErrorMessage('Please select a valid CSV file');
    }
  }, []);

  const parseCSVFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      // Validate headers
      const requiredHeaders = ['name', 'role', 'date', 'status', 'timeIn', 'timeOut', 'batch'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setErrorMessage(`Missing required headers: ${missingHeaders.join(', ')}`);
        return;
      }

      const records: AttendanceRecord[] = [];
      for (let i = 1; i < Math.min(lines.length, 6); i++) { // Preview first 5 rows
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const record: AttendanceRecord = {
            id: Date.now() + i,
            name: values[headers.indexOf('name')] || '',
            role: values[headers.indexOf('role')] || '',
            date: values[headers.indexOf('date')] || '',
            status: (values[headers.indexOf('status')] as "Present" | "Absent" | "Late") || 'Present',
            timeIn: values[headers.indexOf('timeIn')] || '',
            timeOut: values[headers.indexOf('timeOut')] || '',
            batch: values[headers.indexOf('batch')] || '',
          };
          records.push(record);
        }
      }
      setPreviewData(records);
    };
    reader.readAsText(file);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Parse all data from file
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const records: AttendanceRecord[] = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const record: AttendanceRecord = {
              id: Date.now() + i,
              name: values[headers.indexOf('name')] || '',
              role: values[headers.indexOf('role')] || '',
              date: values[headers.indexOf('date')] || '',
              status: (values[headers.indexOf('status')] as "Present" | "Absent" | "Late") || 'Present',
              timeIn: values[headers.indexOf('timeIn')] || '',
              timeOut: values[headers.indexOf('timeOut')] || '',
              batch: values[headers.indexOf('batch')] || '',
            };
            records.push(record);
          }
        }
        
        onUploadSuccess(records);
        setUploadStatus('success');
        setSelectedFile(null);
        setPreviewData([]);
      };
      reader.readAsText(selectedFile);
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage('Failed to upload CSV file');
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, onUploadSuccess]);

  const downloadTemplate = useCallback(() => {
    const headers = ['name', 'role', 'date', 'status', 'timeIn', 'timeOut', 'batch'];
    const sampleData = [
      ['John Doe', 'Student', '2025-01-15', 'Present', '09:00 AM', '05:00 PM', 'Web Development'],
      ['Jane Smith', 'Tutor', '2025-01-15', 'Present', '08:30 AM', '06:00 PM', 'Digital Marketing'],
      ['Mike Johnson', 'Student', '2025-01-15', 'Late', '09:30 AM', '05:00 PM', 'Graphic Design'],
      ['Sarah Wilson', 'Student', '2025-01-15', 'Absent', '', '', 'Data Science']
    ];
    
    const csvContent = [headers, ...sampleData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Attendance CSV</CardTitle>
        <CardDescription>
          Upload attendance data using CSV file format. Make sure your CSV has the required headers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            Drop your CSV file here or click to browse
          </p>
          <Input 
            type="file" 
            accept=".csv" 
            className="max-w-xs mx-auto" 
            onChange={handleFileSelect}
          />
          {selectedFile && (
            <p className="text-sm text-green-600 mt-2">
              Selected: {selectedFile.name}
            </p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-600 mt-2">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Preview Section */}
        {previewData.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Preview (First 5 rows):</h4>
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Time In</th>
                    <th className="text-left p-2">Time Out</th>
                    <th className="text-left p-2">Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((record, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{record.name}</td>
                      <td className="p-2">{record.role}</td>
                      <td className="p-2">{record.date}</td>
                      <td className="p-2">
                        <Badge variant={
                          record.status === 'Present' ? 'default' :
                          record.status === 'Absent' ? 'destructive' :
                          'secondary'
                        }>
                          {record.status}
                        </Badge>
                      </td>
                      <td className="p-2">{record.timeIn}</td>
                      <td className="p-2">{record.timeOut}</td>
                      <td className="p-2">{record.batch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Sample Template
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className={uploadStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isUploading ? 'Uploading...' : 
             uploadStatus === 'success' ? 'Uploaded Successfully!' : 
             'Upload CSV'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

CSVUploadSection.displayName = "CSVUploadSection";

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
    timeIn: null as Date | null,
    timeOut: null as Date | null,
  });

  const handleInputChange = (field: string, value: string | Date | null) => {
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
                          <div className="col-span-3">
                <CustomTimePicker
                  value={formData.timeIn}
                  onChange={(date) => handleInputChange("timeIn", date)}
                  placeholder="Select time in"
                  size="md"
                  className="w-full"
                />
              </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="timeOut" className="text-right">
                    Time Out
                  </Label>
                          <div className="col-span-3">
                <CustomTimePicker
                  value={formData.timeOut}
                  onChange={(date) => handleInputChange("timeOut", date)}
                  placeholder="Select time out"
                  size="md"
                  className="w-full"
                />
              </div>
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
    fromDate: null as Date | null,
    toDate: null as Date | null,
    reason: "",
  });

  const { getActiveLeaveTypes } = useLeaveTypes();
  const activeLeaveTypes = getActiveLeaveTypes();

  const handleInputChange = (field: string, value: string | Date | null) => {
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
                {activeLeaveTypes.map((leaveType) => (
                  <SelectItem key={leaveType.id} value={leaveType.name.toLowerCase()}>
                    {leaveType.name}
                      </SelectItem>
                ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fromDate" className="text-right">
              From Date
                  </Label>
            <div className="col-span-3">
              <CustomDatePicker
                value={formData.fromDate}
                onChange={(date) => handleInputChange("fromDate", date)}
                placeholder="Select from date"
                size="md"
                className="w-full"
              />
            </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="toDate" className="text-right">
              To Date
                  </Label>
            <div className="col-span-3">
              <CustomDatePicker
                value={formData.toDate}
                onChange={(date) => handleInputChange("toDate", date)}
                placeholder="Select to date"
                size="md"
                className="w-full"
              />
            </div>
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
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getActiveLeaveTypes } = useLeaveTypes();

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
  const handleViewRecord = useThrottle((record: AttendanceRecord) => {
    // View logic here
  }, 300);

  const handleViewLeave = useThrottle((leave: LeaveRequest) => {
    // View logic here
  }, 300);

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

  const handleDiscussLeave = useThrottle((id: number) => {
    // Change status to Discussion
    setLeaveRequests(leaveRequests.map(leave => 
      leave.id === id ? { ...leave, status: "Discussion" as const } : leave
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Attendance Management
            </h1>
            <p className="text-muted-foreground">
              Track attendance for students and staff ({attendanceRecords.length} records)
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Leave Request
                </Button>
              </DialogTrigger>
              <LeaveRequestDialog />
            </Dialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <SearchComponent 
                  searchTerm={searchTerm} 
                  onSearchChange={handleSearchChange} 
                />
                <CustomDatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  placeholder="Pick a date"
                  size="md"
                  className="min-w-[200px] sm:min-w-[240px]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/students')}
                    className="text-xs sm:text-sm"
                  >
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Students
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/tutors')}
                    className="text-xs sm:text-sm"
                  >
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Tutors
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/executives')}
                    className="text-xs sm:text-sm"
                  >
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Executives
                  </Button>
                  
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
              </div>
          </div>

            {filteredRecords.length > 0 ? (
              <VirtualList
                items={filteredRecords}
                itemHeight={120}
                containerHeight={600}
                renderItem={(record) => (
                  <AttendanceRecordCard 
                    key={record.id} 
                    record={record}
                    onView={handleViewRecord}
                    selectedRecord={selectedRecord}
                    setSelectedRecord={setSelectedRecord}
                  />
                )}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">Leave Requests</h3>
                    </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/students')}
                  className="text-xs sm:text-sm"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Students
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/tutors')}
                  className="text-xs sm:text-sm"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Tutors
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/executives')}
                  className="text-xs sm:text-sm"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Executives
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/managers')}
                  className="text-xs sm:text-sm"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Managers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/hr')}
                  className="text-xs sm:text-sm"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  HR
                </Button>
                  </div>
            </div>
            {leaveRequests.length > 0 ? (
              <VirtualList
                items={leaveRequests}
                itemHeight={140}
                containerHeight={600}
                renderItem={(leave) => (
                  <LeaveRequestCard 
                    key={leave.id} 
                    leave={leave}
                    onView={handleViewLeave}
                    selectedLeave={selectedLeave}
                    setSelectedLeave={setSelectedLeave}
                    onApprove={handleApproveLeave}
                    onReject={handleRejectLeave}
                    onDiscuss={handleDiscussLeave}
                  />
                )}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">Upload Attendance</h3>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/students')}
                  className="text-xs sm:text-sm"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Students
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/tutors')}
                  className="text-xs sm:text-sm"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Tutors
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/executives')}
                  className="text-xs sm:text-sm"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Executives
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/managers')}
                  className="text-xs sm:text-sm"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Managers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/hr')}
                  className="text-xs sm:text-sm"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  HR
                </Button>
              </div>
            </div>
            
            <CSVUploadSection 
              onUploadSuccess={(newRecords) => {
                setAttendanceRecords(prev => [...prev, ...newRecords]);
              }}
            />
          </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">Attendance Reports</h3>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/students')}
                className="text-xs sm:text-sm"
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Students
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/tutors')}
                className="text-xs sm:text-sm"
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Tutors
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/executives')}
                className="text-xs sm:text-sm"
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Executives
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/managers')}
                className="text-xs sm:text-sm"
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Managers
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/hr')}
                className="text-xs sm:text-sm"
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                HR
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <UserCheck className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Present Today</p>
                    <p className="text-xl font-semibold text-success">
                      {attendanceRecords.filter(r => r.status === "Present").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <UserX className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Absent Today</p>
                    <p className="text-xl font-semibold text-destructive">
                      {attendanceRecords.filter(r => r.status === "Absent").length}
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
                    <p className="text-sm text-muted-foreground">Late Today</p>
                    <p className="text-xl font-semibold text-warning">
                      {attendanceRecords.filter(r => r.status === "Late").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Records</p>
                    <p className="text-xl font-semibold">
                      {attendanceRecords.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Role-wise Attendance */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance by Role</CardTitle>
                <CardDescription>Breakdown of attendance by different roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Student', 'Tutor', 'Executive', 'Manager', 'HR'].map((role) => {
                    const roleRecords = attendanceRecords.filter(r => r.role === role);
                    const present = roleRecords.filter(r => r.status === "Present").length;
                    const absent = roleRecords.filter(r => r.status === "Absent").length;
                    const late = roleRecords.filter(r => r.status === "Late").length;
                    const total = roleRecords.length;
                    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

                    return (
                      <div key={role} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{role}</span>
                          <span className="text-sm text-muted-foreground">{attendanceRate}%</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="flex-1 bg-success h-2 rounded" style={{ width: `${(present / total) * 100}%` }}></div>
                          <div className="flex-1 bg-warning h-2 rounded" style={{ width: `${(late / total) * 100}%` }}></div>
                          <div className="flex-1 bg-destructive h-2 rounded" style={{ width: `${(absent / total) * 100}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>P: {present}</span>
                          <span>L: {late}</span>
                          <span>A: {absent}</span>
                          <span>Total: {total}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Statistics</CardTitle>
                <CardDescription>Overview of this month's attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-success">92%</p>
                      <p className="text-sm text-muted-foreground">Average Attendance</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">22</p>
                      <p className="text-sm text-muted-foreground">Working Days</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Most Punctual Role:</span>
                      <span className="font-medium">Tutors</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Most Absent Role:</span>
                      <span className="font-medium">Students</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Best Batch:</span>
                      <span className="font-medium">Web Development</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>Download detailed attendance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Download className="w-6 h-6" />
                  <span>Daily Report</span>
                  <span className="text-xs text-muted-foreground">Today's attendance</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Download className="w-6 h-6" />
                  <span>Weekly Report</span>
                  <span className="text-xs text-muted-foreground">This week's summary</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Download className="w-6 h-6" />
                  <span>Monthly Report</span>
                  <span className="text-xs text-muted-foreground">Complete monthly data</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
};

export default memo(Attendance);
