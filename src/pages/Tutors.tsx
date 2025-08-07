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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  UserX,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback, memo, Suspense, lazy, useRef } from "react";
import { useForm } from "react-hook-form";
import { TableSkeleton } from "@/components/ui/skeletons/table-skeleton";

// Lazy load components for better performance
const LazyTutorDetailsDialog = lazy(() => import('./TutorDetailsDialog.tsx'));
const LazyAddTutorDialog = lazy(() => import('./AddTutorDialog.tsx'));

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
      console.log(`Tutors render time: ${time.toFixed(2)}ms`);
    }
  }
};

interface Tutor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  religion?: string;
  address: string;
  pin: string;
  photo?: string;
  qualification: string;
  experience: string;
  subjects: string[];
  batches: string[];
  salary: number;
  paidAmount: number;
  status: "active" | "inactive";
  joiningDate: string;
  accountDetails: {
    bankName: string;
    accountNumber: string;
    ifsc: string;
  };
  documents: {
    cv?: string;
    pan?: string;
    aadhar?: string;
    passbook?: string;
    paySlip?: string;
    certificates?: string[];
  };
  attendance: {
    id: string;
    month: string;
    year: string;
    present: number;
    leave: number;
    overtime: number;
  }[];
  payments: {
    id: string;
    category: string;
    date: string;
    amount: number;
    paid: number;
    status: "pending" | "approved" | "rejected";
    description: string;
    screenshot?: string;
  }[];
}

// Memoized tutor data with caching
const getDummyTutors = (() => {
  let cachedTutors: Tutor[] | null = null;
  let cacheTime = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  return () => {
    const now = Date.now();
    if (cachedTutors && (now - cacheTime) < CACHE_DURATION) {
      return cachedTutors;
    }

    // Generate large dataset for testing
    const tutors = Array.from({ length: 1000 }, (_, index) => ({
      id: `TUT${String(index + 1).padStart(3, '0')}`,
      firstName: `Tutor${index + 1}`,
      lastName: `Last${index + 1}`,
      email: `tutor${index + 1}@evoka.in`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      whatsapp: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      dob: `198${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      gender: Math.random() > 0.5 ? "Male" : "Female",
      bloodGroup: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"][Math.floor(Math.random() * 8)],
      religion: Math.random() > 0.3 ? "Hindu" : undefined,
      address: `${Math.floor(Math.random() * 999) + 1} Street, City ${index + 1}`,
      pin: `${Math.floor(Math.random() * 900000) + 100000}`,
      qualification: ["M.A. in Advertising", "M.Des Visual Communication", "B.Tech Computer Science"][Math.floor(Math.random() * 3)],
      experience: `${Math.floor(Math.random() * 15) + 1} years`,
      subjects: ["Creative Writing", "Brand Strategy", "Graphic Design", "UI/UX Design", "Full Stack Development"].slice(0, Math.floor(Math.random() * 3) + 1),
      batches: [],
      salary: Math.floor(Math.random() * 30000) + 30000,
      paidAmount: Math.floor(Math.random() * 50000),
      status: Math.random() > 0.1 ? "active" : "inactive" as "active" | "inactive",
      joiningDate: `202${Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      accountDetails: {
        bankName: ["HDFC Bank", "SBI", "ICICI Bank"][Math.floor(Math.random() * 3)],
        accountNumber: `${Math.floor(Math.random() * 900000000000000) + 100000000000000}`,
        ifsc: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}000${Math.floor(Math.random() * 9999) + 1000}`,
      },
      documents: {},
      attendance: [],
      payments: [],
    }));

    cachedTutors = tutors;
    cacheTime = now;
    return tutors;
  };
})();

const availableBatches = [
  { id: "ADV001", name: "Advanced Digital Marketing", status: "active" },
  { id: "ADV002", name: "Brand Strategy Masterclass", status: "active" },
  { id: "DES001", name: "UI/UX Design Fundamentals", status: "active" },
  { id: "DES002", name: "Graphic Design Pro", status: "active" },
  { id: "DEV001", name: "Full Stack Development", status: "active" },
  { id: "DEV002", name: "React Advanced", status: "active" },
];

// Memoized tutor row component
const TutorRow = memo(({ 
  tutor, 
  onEdit, 
  onDelete, 
  onView,
  selectedTutor,
  setSelectedTutor 
}: { 
  tutor: Tutor; 
  onEdit: (tutor: Tutor, type: string, item?: any) => void; 
  onDelete: (id: string, type?: string, itemId?: string) => void;
  onView: (tutor: Tutor) => void;
  selectedTutor: Tutor | null;
  setSelectedTutor: (tutor: Tutor | null) => void;
}) => {
  const handleView = useCallback(() => {
    setSelectedTutor(tutor);
    onView(tutor);
  }, [tutor, setSelectedTutor, onView]);

  const handleEdit = useCallback(() => {
    onEdit(tutor, "personal");
  }, [tutor, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(tutor.id);
  }, [tutor.id, onDelete]);

  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={tutor.photo} />
            <AvatarFallback>
              {tutor.firstName[0]}
              {tutor.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {tutor.firstName} {tutor.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {tutor.email}
            </p>
          </div>
        </div>
      </td>
      <td className="p-2">
        <Badge variant="outline">{tutor.id}</Badge>
      </td>
      <td className="p-2">
        <div>
          <p className="text-sm">{tutor.phone}</p>
          <p className="text-sm text-muted-foreground">
            {tutor.whatsapp}
          </p>
        </div>
      </td>
      <td className="p-2">
        <div className="flex flex-wrap gap-1">
          {tutor.subjects.slice(0, 2).map((subject, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs"
            >
              {subject}
            </Badge>
          ))}
          {tutor.subjects.length > 2 && (
            <span className="text-xs text-muted-foreground">
              +{tutor.subjects.length - 2}
            </span>
          )}
        </div>
      </td>
      <td className="p-2">
        <div>
          <p className="font-medium">
            ₹{tutor.salary.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Monthly</p>
        </div>
      </td>
      <td className="p-2">
        <Badge
          variant={
            tutor.status === "active" ? "success" : "secondary"
          }
        >
          {tutor.status}
        </Badge>
      </td>
      <td className="p-2">
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleView}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            {selectedTutor && (
              <Suspense fallback={<div>Loading...</div>}>
                <LazyTutorDetailsDialog tutor={selectedTutor} />
              </Suspense>
            )}
          </Dialog>
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
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
});

TutorRow.displayName = "TutorRow";

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
        placeholder="Search tutors..."
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
  tutors 
}: { 
  activeTab: string; 
  onTabChange: (value: string) => void; 
  tutors: Tutor[];
}) => {
  const activeCount = useMemo(() => tutors.filter((t) => t.status === "active").length, [tutors]);
  const inactiveCount = useMemo(() => tutors.filter((t) => t.status === "inactive").length, [tutors]);

  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={activeTab === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onTabChange("all")}
      >
        All Tutors ({tutors.length})
      </Button>
      <Button
        variant={activeTab === "active" ? "default" : "outline"}
        size="sm"
        onClick={() => onTabChange("active")}
      >
        Active ({activeCount})
      </Button>
      <Button
        variant={activeTab === "inactive" ? "default" : "outline"}
        size="sm"
        onClick={() => onTabChange("inactive")}
      >
        Inactive ({inactiveCount})
      </Button>
    </div>
  );
});

FilterTabs.displayName = "FilterTabs";

// Virtual table component for large datasets
const VirtualTable = memo(({ 
  tutors, 
  onEdit, 
  onDelete, 
  onView,
  selectedTutor,
  setSelectedTutor 
}: { 
  tutors: Tutor[];
  onEdit: (tutor: Tutor, type: string, item?: any) => void;
  onDelete: (id: string, type?: string, itemId?: string) => void;
  onView: (tutor: Tutor) => void;
  selectedTutor: Tutor | null;
  setSelectedTutor: (tutor: Tutor | null) => void;
}) => {
  const ITEM_HEIGHT = 80; // Approximate height of each row
  const CONTAINER_HEIGHT = 600; // Height of the table container

  const { 
    visibleItems, 
    containerRef, 
    totalHeight, 
    offsetY, 
    handleScroll 
  } = useVirtualScrolling(tutors, ITEM_HEIGHT, CONTAINER_HEIGHT, 10);

  return (
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
                <th className="text-left p-2">Tutor</th>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Contact</th>
                <th className="text-left p-2">Subjects</th>
                <th className="text-left p-2">Salary</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((tutor) => (
                <TutorRow
                  key={tutor.id}
                  tutor={tutor}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  selectedTutor={selectedTutor}
                  setSelectedTutor={setSelectedTutor}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

VirtualTable.displayName = "VirtualTable";

const Tutors = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<
    "personal" | "payment" | "attendance" | "batch" | null
  >(null);
  const { toast } = useToast();
  const form = useForm();

  // Performance monitoring
  useEffect(() => {
    performanceLogger.logRender(performance.now());
  });

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized filtered tutors
  const filteredTutors = useMemo(() => {
    const startTime = performance.now();
    
    const filtered = tutors.filter((tutor) => {
    const matchesSearch =
      `${tutor.firstName} ${tutor.lastName} ${tutor.email} ${tutor.id}`
        .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && tutor.status === "active";
    if (activeTab === "inactive")
      return matchesSearch && tutor.status === "inactive";

    return matchesSearch;
  });

    const endTime = performance.now();
    performanceLogger.logRender(endTime - startTime);

    return filtered;
  }, [tutors, debouncedSearchTerm, activeTab]);

  // Throttled handlers
  const handleEdit = useThrottle((tutor: Tutor, type: string, item?: any) => {
    setSelectedTutor(tutor);
    setEditingType(type as any);
    setEditingItem(item);
  }, 300);

  const handleDelete = useThrottle((tutorId: string, type?: string, itemId?: string) => {
    if (type && itemId && selectedTutor) {
      const updatedTutors = tutors.map((tutor) => {
        if (tutor.id === tutorId) {
          if (type === "payment") {
            return {
              ...tutor,
              payments: tutor.payments.filter((p) => p.id !== itemId),
            };
          } else if (type === "attendance") {
            return {
              ...tutor,
              attendance: tutor.attendance.filter((a) => a.id !== itemId),
            };
          }
        }
        return tutor;
      });
      setTutors(updatedTutors);
      setSelectedTutor(updatedTutors.find((t) => t.id === tutorId) || null);
      toast({
        title: `${type} Deleted`,
        description: `${type} record has been deleted successfully.`,
      });
    } else {
      setTutors(tutors.filter((tutor) => tutor.id !== tutorId));
      toast({
        title: "Tutor Deleted",
        description: "Tutor has been successfully deleted.",
      });
    }
  }, 300);

  const handleView = useThrottle((tutor: Tutor) => {
    // View logic here
  }, 300);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1300));
        const data = getDummyTutors();
        setTutors(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading tutors:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle search change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  if (isLoading) {
    return <TableSkeleton title="Tutors" subtitle="Manage tutor profiles and information" />;
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tutors Management</h1>
          <p className="text-muted-foreground">
              Manage tutor profiles and information ({tutors.length} total)
          </p>
        </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Tutor
              </Button>
            </DialogTrigger>
            <Suspense fallback={<div>Loading...</div>}>
              <LazyAddTutorDialog />
            </Suspense>
          </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tutors</p>
                <p className="text-xl font-semibold">{tutors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <GraduationCap className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Tutors</p>
                <p className="text-xl font-semibold">
                  {tutors.filter((t) => t.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-xl font-semibold">2</p>
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
                <p className="text-sm text-muted-foreground">Avg Salary</p>
                <p className="text-xl font-semibold">₹47.5K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Tutors List</CardTitle>
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
              tutors={tutors}
            />

            {filteredTutors.length > 0 ? (
              <VirtualTable
                tutors={filteredTutors}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                selectedTutor={selectedTutor}
                setSelectedTutor={setSelectedTutor}
              />
            ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No tutors found matching your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default memo(Tutors);
