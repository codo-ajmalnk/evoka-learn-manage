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
    onDelete(entry.id);
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
        placeholder="Search entries..."
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
  onTabChange 
}: { 
  selectedTab: string; 
  onTabChange: (value: string) => void; 
}) => {
  return (
    <TabsList>
      <TabsTrigger value="all" onClick={() => onTabChange("all")}>
        All Entries
      </TabsTrigger>
      <TabsTrigger value="fees" onClick={() => onTabChange("fees")}>
        Fees
      </TabsTrigger>
      <TabsTrigger value="salaries" onClick={() => onTabChange("salaries")}>
        Salaries
      </TabsTrigger>
      <TabsTrigger value="petty" onClick={() => onTabChange("petty")}>
        Petty Cash
      </TabsTrigger>
    </TabsList>
  );
});

FilterTabs.displayName = "FilterTabs";

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
    console.log("Edit entry:", entry);
  }, 300);

  const handleDelete = useThrottle((id: number) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== id));
  }, 300);

  const handleView = useThrottle((entry: JournalEntry) => {
    // View logic here
  }, 300);

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
      </div>
    </>
  );
};

export default memo(Journals);
