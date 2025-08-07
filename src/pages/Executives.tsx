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
  Briefcase,
  Calendar,
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
const LazyExecutiveDetailsDialog = lazy(() => import('./ExecutiveDetailsDialog.tsx'));
const LazyAddExecutiveDialog = lazy(() => import('./AddExecutiveDialog.tsx'));

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
      console.log(`Executives render time: ${time.toFixed(2)}ms`);
    }
  }
};

interface Executive {
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

// Memoized executive data with caching
const getDummyExecutives = (() => {
  let cachedExecutives: Executive[] | null = null;
  let cacheTime = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  return () => {
    const now = Date.now();
    if (cachedExecutives && (now - cacheTime) < CACHE_DURATION) {
      return cachedExecutives;
    }

    // Generate large dataset for testing
    const executives = Array.from({ length: 1000 }, (_, index) => ({
      id: `EXE${String(index + 1).padStart(3, '0')}`,
      firstName: `Executive${index + 1}`,
      lastName: `Last${index + 1}`,
      email: `executive${index + 1}@evoka.in`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      whatsapp: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      dob: `198${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      gender: Math.random() > 0.5 ? "Male" : "Female",
      bloodGroup: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"][Math.floor(Math.random() * 8)],
      religion: Math.random() > 0.3 ? "Hindu" : undefined,
      address: `${Math.floor(Math.random() * 999) + 1} Street, City ${index + 1}`,
      pin: `${Math.floor(Math.random() * 900000) + 100000}`,
      qualification: ["MBA Marketing", "M.Com", "B.Tech", "M.A. Economics"][Math.floor(Math.random() * 4)],
      experience: `${Math.floor(Math.random() * 20) + 1} years`,
      department: ["Student Affairs", "Administration", "Finance", "HR", "Operations"][Math.floor(Math.random() * 5)],
      designation: ["Senior Executive", "Executive", "Manager", "Assistant Manager"][Math.floor(Math.random() * 4)],
      salary: Math.floor(Math.random() * 40000) + 40000,
      paidAmount: Math.floor(Math.random() * 60000),
      status: Math.random() > 0.1 ? "active" : "inactive" as "active" | "inactive",
      joiningDate: `202${Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    accountDetails: {
        bankName: ["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank"][Math.floor(Math.random() * 4)],
        accountNumber: `${Math.floor(Math.random() * 900000000000000) + 100000000000000}`,
        ifsc: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}000${Math.floor(Math.random() * 9999) + 1000}`,
      },
      documents: {},
      attendance: [],
      payments: [],
    }));

    cachedExecutives = executives;
    cacheTime = now;
    return executives;
  };
})();

// Memoized executive row component
const ExecutiveRow = memo(({ 
  executive, 
  onEdit, 
  onDelete, 
  onView,
  selectedExecutive,
  setSelectedExecutive,
  userRole 
}: { 
  executive: Executive; 
  onEdit: (executive: Executive) => void; 
  onDelete: (id: string) => void;
  onView: (executive: Executive) => void;
  selectedExecutive: Executive | null;
  setSelectedExecutive: (executive: Executive | null) => void;
  userRole: string;
}) => {
  const handleView = useCallback(() => {
    setSelectedExecutive(executive);
    onView(executive);
  }, [executive, setSelectedExecutive, onView]);

  const handleEdit = useCallback(() => {
    onEdit(executive);
  }, [executive, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(executive.id);
  }, [executive.id, onDelete]);

  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={executive.photo} />
            <AvatarFallback>
              {executive.firstName[0]}
              {executive.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {executive.firstName} {executive.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {executive.designation}
            </p>
          </div>
            </div>
      </td>
      <td className="p-2">
        <Badge variant="outline">{executive.id}</Badge>
      </td>
      <td className="p-2">
        <div>
              <p className="text-sm">{executive.phone}</p>
          <p className="text-sm text-muted-foreground">
            {executive.email}
              </p>
            </div>
      </td>
      <td className="p-2">
        <Badge variant="secondary">{executive.department}</Badge>
      </td>
      <td className="p-2">
        <div>
          <p className="font-medium">
                  ₹{executive.salary.toLocaleString()}
                </p>
          <p className="text-xs text-muted-foreground">Monthly</p>
          </div>
      </td>
      <td className="p-2">
                      <Badge
                        variant={
            executive.status === "active"
                            ? "success"
              : "secondary"
                        }
                      >
          {executive.status}
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
            {selectedExecutive && (
              <Suspense fallback={<div>Loading...</div>}>
                <LazyExecutiveDetailsDialog executive={selectedExecutive} />
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
          {(userRole === "admin" ||
            userRole === "hr" ||
            userRole === "manager") && (
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

ExecutiveRow.displayName = "ExecutiveRow";

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
        placeholder="Search executives..."
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
  executives,
  userRole 
}: { 
  activeTab: string; 
  onTabChange: (value: string) => void; 
  executives: Executive[];
  userRole: string;
}) => {
  const getTabsForRole = useCallback(() => {
    switch (userRole) {
      case "admin":
      case "hr":
        return [
          { key: "all", label: `All Executives (${executives.length})` },
          {
            key: "active",
            label: `Active (${
              executives.filter((e) => e.status === "active").length
            })`,
          },
          {
            key: "inactive",
            label: `Inactive (${
              executives.filter((e) => e.status === "inactive").length
            })`,
          },
        ];
      case "manager":
        return [
          { key: "all", label: `All Executives (${executives.length})` },
          {
            key: "my",
            label: `My Executives (${
              executives.filter((e) => e.status === "active").length
            })`,
          },
          {
            key: "inactive",
            label: `Inactive (${
              executives.filter((e) => e.status === "inactive").length
            })`,
          },
        ];
      default:
        return [{ key: "all", label: `All Executives (${executives.length})` }];
    }
  }, [executives, userRole]);

  const tabs = getTabsForRole();

  return (
    <div className="flex gap-2 mb-4">
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant={activeTab === tab.key ? "default" : "outline"}
          size="sm"
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
});

FilterTabs.displayName = "FilterTabs";

// Virtual table component for large datasets
const VirtualTable = memo(({ 
  executives, 
  onEdit, 
  onDelete, 
  onView,
  selectedExecutive,
  setSelectedExecutive,
  userRole 
}: { 
  executives: Executive[];
  onEdit: (executive: Executive) => void;
  onDelete: (id: string) => void;
  onView: (executive: Executive) => void;
  selectedExecutive: Executive | null;
  setSelectedExecutive: (executive: Executive | null) => void;
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
  } = useVirtualScrolling(executives, ITEM_HEIGHT, CONTAINER_HEIGHT, 10);

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
                <th className="text-left p-2">Executive</th>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Contact</th>
                <th className="text-left p-2">Department</th>
                <th className="text-left p-2">Salary</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((executive) => (
                <ExecutiveRow
                  key={executive.id}
                  executive={executive}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  selectedExecutive={selectedExecutive}
                  setSelectedExecutive={setSelectedExecutive}
                  userRole={userRole}
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

const Executives = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null);
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

  // Memoized filtered executives
  const filteredExecutives = useMemo(() => {
    const startTime = performance.now();
    
    const filtered = executives.filter((executive) => {
      const matchesSearch =
        `${executive.firstName} ${executive.lastName} ${executive.email} ${executive.id}`
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());

      if (activeTab === "all") return matchesSearch;
      if (activeTab === "active")
        return matchesSearch && executive.status === "active";
      if (activeTab === "inactive")
        return matchesSearch && executive.status === "inactive";
      if (activeTab === "my" && userRole === "manager")
        return matchesSearch && executive.status === "active";

      return matchesSearch;
    });

    const endTime = performance.now();
    performanceLogger.logRender(endTime - startTime);

    return filtered;
  }, [executives, debouncedSearchTerm, activeTab, userRole]);

  // Throttled handlers
  const handleEdit = useThrottle((executive: Executive) => {
    toast({
      title: "Edit Executive",
      description: `Editing ${executive.firstName} ${executive.lastName}`,
    });
  }, 300);

  const handleDelete = useThrottle((id: string) => {
    setExecutives(executives.filter((executive) => executive.id !== id));
    toast({
      title: "Executive Deleted",
      description: "Executive has been successfully deleted.",
    });
  }, 300);

  const handleView = useThrottle((executive: Executive) => {
    // View logic here
  }, 300);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1100));
        const data = getDummyExecutives();
        setExecutives(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading executives:', error);
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
    return <TableSkeleton title="Executives Management" subtitle="Manage executive profiles and information" />;
  }

  return (
    <>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Executives Management</h1>
          <p className="text-muted-foreground">
              Manage executive profiles and information ({executives.length} total)
          </p>
        </div>
        {(userRole === "admin" ||
          userRole === "hr" ||
          userRole === "manager") && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Executive
          </Button>
              </DialogTrigger>
              <Suspense fallback={<div>Loading...</div>}>
                <LazyAddExecutiveDialog />
              </Suspense>
            </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Executives
                </p>
                <p className="text-xl font-semibold">{executives.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Briefcase className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-semibold">
                  {executives.filter((e) => e.status === "active").length}
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
                <p className="text-xl font-semibold">1</p>
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
                <p className="text-xl font-semibold">₹60K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Executives List</CardTitle>
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
              executives={executives}
              userRole={userRole}
            />

            {filteredExecutives.length > 0 ? (
              <VirtualTable
                executives={filteredExecutives}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                selectedExecutive={selectedExecutive}
                setSelectedExecutive={setSelectedExecutive}
                userRole={userRole}
              />
            ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No executives found matching your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default memo(Executives);
