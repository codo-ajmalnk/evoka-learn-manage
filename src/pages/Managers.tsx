import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Crown,
  DollarSign,
  Edit,
  Eye,
  Filter,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback, memo, Suspense, lazy, useRef } from "react";
import { TableSkeleton } from "@/components/ui/skeletons/table-skeleton";

// Lazy load components for better performance
const LazyManagerDetailsDialog = lazy(() => import('./ManagerDetailsDialog'));
const LazyAddManagerDialog = lazy(() => import('./AddManagerDialog'));

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
      console.log(`Managers render time: ${time.toFixed(2)}ms`);
    }
  }
};

interface Manager {
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
  department: string;
  designation: string;
  salary: number;
  paidAmount: number;
  status: "active" | "inactive";
  joiningDate: string;
  teamSize: number;
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
    month: string;
    present: number;
    leave: number;
  }[];
  payments: {
    id: string;
    category: string;
    date: string;
    amount: number;
    paid: number;
    status: "pending" | "approved" | "rejected";
    description: string;
  }[];
}

// Memoized manager data with caching
const getDummyManagers = (() => {
  let cachedManagers: Manager[] | null = null;
  let cacheTime = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  return () => {
    const now = Date.now();
    if (cachedManagers && (now - cacheTime) < CACHE_DURATION) {
      return cachedManagers;
    }

    // Generate large dataset for testing
    const managers = Array.from({ length: 1000 }, (_, index) => ({
      id: `MGR${String(index + 1).padStart(3, '0')}`,
      firstName: `Manager${index + 1}`,
      lastName: `Last${index + 1}`,
      email: `manager${index + 1}@evoka.in`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      whatsapp: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      dob: `198${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      gender: Math.random() > 0.5 ? "Male" : "Female",
      bloodGroup: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"][Math.floor(Math.random() * 8)],
      religion: Math.random() > 0.3 ? "Hindu" : undefined,
      address: `${Math.floor(Math.random() * 999) + 1} Street, City ${index + 1}`,
      pin: `${Math.floor(Math.random() * 900000) + 100000}`,
      qualification: ["MBA Operations", "MBA HR", "MBA Finance", "MBA Marketing"][Math.floor(Math.random() * 4)],
      experience: `${Math.floor(Math.random() * 20) + 1} years`,
      department: ["Operations", "Human Resources", "Finance", "Marketing", "IT"][Math.floor(Math.random() * 5)],
      designation: ["Operations Manager", "HR Manager", "Finance Manager", "Marketing Manager", "IT Manager"][Math.floor(Math.random() * 5)],
      salary: Math.floor(Math.random() * 50000) + 70000,
      paidAmount: Math.floor(Math.random() * 80000),
      status: Math.random() > 0.1 ? "active" : "inactive" as "active" | "inactive",
      joiningDate: `202${Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      teamSize: Math.floor(Math.random() * 15) + 5,
    accountDetails: {
        bankName: ["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank"][Math.floor(Math.random() * 4)],
        accountNumber: `${Math.floor(Math.random() * 900000000000000) + 100000000000000}`,
        ifsc: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}000${Math.floor(Math.random() * 9999) + 1000}`,
      },
      documents: {},
      attendance: [],
      payments: [],
    }));

    cachedManagers = managers;
    cacheTime = now;
    return managers;
  };
})();

// Memoized manager row component
const ManagerRow = memo(({ 
  manager, 
  onEdit, 
  onDelete, 
  onView,
  selectedManager,
  setSelectedManager
}: { 
  manager: Manager; 
  onEdit: (manager: Manager) => void; 
  onDelete: (id: string) => void;
  onView: (manager: Manager) => void;
  selectedManager: Manager | null;
  setSelectedManager: (manager: Manager | null) => void;
}) => {
  const handleView = useCallback(() => {
    setSelectedManager(manager);
    onView(manager);
  }, [manager, setSelectedManager, onView]);

  const handleEdit = useCallback(() => {
    onEdit(manager);
  }, [manager, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(manager.id);
  }, [manager.id, onDelete]);

  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={manager.photo} />
            <AvatarFallback>
              {manager.firstName[0]}
              {manager.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {manager.firstName} {manager.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {manager.designation}
            </p>
          </div>
        </div>
      </td>
      <td className="p-2">
        <Badge variant="outline">{manager.id}</Badge>
      </td>
      <td className="p-2">
        <div>
          <p className="text-sm">{manager.phone}</p>
          <p className="text-sm text-muted-foreground">
            {manager.email}
          </p>
        </div>
      </td>
      <td className="p-2">
        <Badge variant="secondary">{manager.department}</Badge>
      </td>
      <td className="p-2">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span className="text-sm">{manager.teamSize}</span>
        </div>
      </td>
      <td className="p-2">
        <div>
          <p className="font-medium">
            ₹{manager.salary.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Monthly</p>
        </div>
      </td>
      <td className="p-2">
        <Badge
          variant={
            manager.status === "active" ? "success" : "secondary"
          }
        >
          {manager.status}
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
            {selectedManager && (
              <Suspense fallback={<div>Loading...</div>}>
                <LazyManagerDetailsDialog manager={selectedManager} />
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

ManagerRow.displayName = "ManagerRow";

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
        placeholder="Search managers..."
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
  managers 
}: { 
  activeTab: string; 
  onTabChange: (value: string) => void; 
  managers: Manager[];
}) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={activeTab === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onTabChange("all")}
      >
        All Managers ({managers.length})
      </Button>
      <Button
        variant={activeTab === "active" ? "default" : "outline"}
        size="sm"
        onClick={() => onTabChange("active")}
      >
        Active ({managers.filter((m) => m.status === "active").length})
      </Button>
      <Button
        variant={activeTab === "inactive" ? "default" : "outline"}
        size="sm"
        onClick={() => onTabChange("inactive")}
      >
        Inactive ({managers.filter((m) => m.status === "inactive").length})
      </Button>
    </div>
  );
});

FilterTabs.displayName = "FilterTabs";

// Virtual table component for large datasets
const VirtualTable = memo(({ 
  managers, 
  onEdit, 
  onDelete, 
  onView,
  selectedManager,
  setSelectedManager
}: { 
  managers: Manager[];
  onEdit: (manager: Manager) => void;
  onDelete: (id: string) => void;
  onView: (manager: Manager) => void;
  selectedManager: Manager | null;
  setSelectedManager: (manager: Manager | null) => void;
}) => {
  const ITEM_HEIGHT = 80; // Approximate height of each row
  const CONTAINER_HEIGHT = 600; // Height of the table container

  const { 
    visibleItems, 
    containerRef, 
    totalHeight, 
    offsetY, 
    handleScroll 
  } = useVirtualScrolling(managers, ITEM_HEIGHT, CONTAINER_HEIGHT, 10);

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
                <th className="text-left p-2">Manager</th>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Contact</th>
                <th className="text-left p-2">Department</th>
                <th className="text-left p-2">Team Size</th>
                <th className="text-left p-2">Salary</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((manager) => (
                <ManagerRow
                  key={manager.id}
                  manager={manager}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  selectedManager={selectedManager}
                  setSelectedManager={setSelectedManager}
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

const Managers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Performance monitoring
  useEffect(() => {
    performanceLogger.logRender(performance.now());
  });

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get user role
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role || "admin";

  // Memoized filtered managers
  const filteredManagers = useMemo(() => {
    const startTime = performance.now();
    
    const filtered = managers.filter((manager) => {
    const matchesSearch =
      `${manager.firstName} ${manager.lastName} ${manager.email} ${manager.id}`
        .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && manager.status === "active";
    if (activeTab === "inactive")
      return matchesSearch && manager.status === "inactive";

    return matchesSearch;
  });

    const endTime = performance.now();
    performanceLogger.logRender(endTime - startTime);

    return filtered;
  }, [managers, debouncedSearchTerm, activeTab]);

  // Throttled handlers
  const handleEdit = useThrottle((manager: Manager) => {
    toast({
      title: "Edit Manager",
      description: `Editing ${manager.firstName} ${manager.lastName}`,
    });
  }, 300);

  const handleDelete = useThrottle((id: string) => {
    setManagers(managers.filter((manager) => manager.id !== id));
    toast({
      title: "Manager Deleted",
      description: "Manager has been successfully deleted.",
    });
  }, 300);

  const handleView = useThrottle((manager: Manager) => {
    // View logic here
  }, 300);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = getDummyManagers();
        setManagers(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading managers:', error);
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
    return <TableSkeleton title="Managers Management" subtitle="Manage manager profiles and information" />;
  }

  // Only admin can access managers page
  if (userRole !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Managers Management</h1>
          <p className="text-muted-foreground">
              Manage manager profiles and information ({managers.length} total)
          </p>
        </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Manager
        </Button>
            </DialogTrigger>
            <Suspense fallback={<div>Loading...</div>}>
              <LazyAddManagerDialog />
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
                <p className="text-sm text-muted-foreground">Total Managers</p>
                <p className="text-xl font-semibold">{managers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Crown className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-semibold">
                  {managers.filter((m) => m.status === "active").length}
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
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-xl font-semibold">
                  {managers.reduce((sum, m) => sum + m.teamSize, 0)}
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
                <p className="text-sm text-muted-foreground">Avg Salary</p>
                <p className="text-xl font-semibold">₹82.5K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Managers List</CardTitle>
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
              managers={managers}
            />

            {filteredManagers.length > 0 ? (
              <VirtualTable
                managers={filteredManagers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                selectedManager={selectedManager}
                setSelectedManager={setSelectedManager}
              />
            ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No managers found matching your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default memo(Managers);
