import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Book,
  Calendar,
  DollarSign,
  Edit,
  GraduationCap,
  Percent,
  Plus,
  Search,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo, memo, lazy, Suspense, useRef } from "react";
import { FormSkeleton } from "@/components/ui/skeletons/form-skeleton";
import { useBatches } from "@/contexts/BatchContext";
import { useLeaveTypes } from "@/contexts/LeaveTypesContext";
import { useSearchParams, useNavigate } from "react-router-dom";

// Performance optimization hooks
const useDebounce = (value: string, delay: number): string => {
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

const useThrottle = (func: (...args: any[]) => void, delay: number) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args: any[]) => {
    if (Date.now() - lastRun.current >= delay) {
      func(...args);
      lastRun.current = Date.now();
    }
  }, [func, delay]);
};

const performanceLogger = (componentName: string, operation: string) => {
  const start = performance.now();
  return () => {
    const end = performance.now();
    console.log(`${componentName} ${operation}: ${(end - start).toFixed(2)}ms`);
  };
};

const useVirtualScrolling = (items: any[], itemHeight: number, containerHeight: number) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, items.length);
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        width: '100%'
      }
    }));
  }, [items, itemHeight, containerHeight, scrollTop]);

  const totalHeight = items.length * itemHeight;
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return { visibleItems, totalHeight, handleScroll };
};

// Type definitions
interface Course {
  id: number;
  name: string;
  code: string;
  duration: string;
  status: string;
}

interface Syllabus {
  id: number;
  name: string;
  code: string;
  courses: string[];
}

interface Batch {
  id: number;
  name: string;
  syllabus: string;
  startDate: string;
  students: number;
}

interface Category {
  id: number;
  type: string;
  name: string;
  description: string;
}

interface Tax {
  id: number;
  name: string;
  rate: number;
  enabled: boolean;
  description: string;
}

interface Coupon {
  id: number;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface LeaveType {
  id: number;
  name: string;
  description: string;
  maxDays: number;
  status: "active" | "inactive";
}

interface JournalType {
  id: number;
  name: string;
  description: string;
  dashboards: string[];
  color: string;
  status: "active" | "inactive";
}

// Memoized data generation with caching
const getInitialCourses = (): Course[] => {
  const cacheKey = 'settingsCourses';
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const data = [
  {
    id: 1,
    name: "Web Development",
    code: "WD001",
    duration: "6 months",
    status: "Active",
  },
  {
    id: 2,
    name: "Digital Marketing",
    code: "DM001",
    duration: "4 months",
    status: "Active",
  },
      {
      id: 3,
      name: "Graphic Design",
      code: "GD001",
      duration: "5 months",
      status: "Active",
    },
  ];

  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};

const initialSyllabi: Syllabus[] = [
  {
    id: 1,
    name: "Full Stack Development",
    code: "FSD001",
    courses: ["Web Development"],
  },
  {
    id: 2,
    name: "Digital Marketing Mastery",
    code: "DMM001",
    courses: ["Digital Marketing"],
  },
  {
    id: 3,
    name: "Creative Design",
    code: "CD001",
    courses: ["Graphic Design"],
  },
];

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

const initialCategories: Category[] = [
  {
    id: 1,
    type: "Salary",
    name: "Monthly Salary",
    description: "Regular monthly salary payment",
  },
  {
    id: 2,
    type: "Payment",
    name: "Course Fee",
    description: "Student course fee payment",
  },
  {
    id: 3,
    type: "Leave",
    name: "Sick Leave",
    description: "Medical leave category",
  },
  {
    id: 4,
    type: "Assignment",
    name: "Project Work",
    description: "Project-based assignments",
  },
];

const initialTaxSettings: Tax[] = [
  {
    id: 1,
    name: "GST",
    rate: 18,
    enabled: true,
    description: "Goods and Services Tax",
  },
  {
    id: 2,
    name: "TDS",
    rate: 10,
    enabled: true,
    description: "Tax Deducted at Source",
  },
  {
    id: 3,
    name: "Service Tax",
    rate: 15,
    enabled: false,
    description: "Service Tax",
  },
];

const initialCoupons: Coupon[] = [
  {
    id: 1,
    code: "EARLY2025",
    discount: 20,
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    status: "Active",
  },
  {
    id: 2,
    code: "STUDENT50",
    discount: 50,
    startDate: "2025-02-01",
    endDate: "2025-12-31",
    status: "Active",
  },
  {
    id: 3,
    code: "WINTER25",
    discount: 25,
    startDate: "2025-01-15",
    endDate: "2025-02-29",
    status: "Expired",
  },
];

const initialLeaveTypes: LeaveType[] = [
  {
    id: 1,
    name: "Sick Leave",
    description: "Medical leave for health-related issues",
    maxDays: 15,
    status: "active",
  },
  {
    id: 2,
    name: "Personal Leave",
    description: "Personal time off for personal matters",
    maxDays: 10,
    status: "active",
  },
  {
    id: 3,
    name: "Vacation",
    description: "Annual vacation leave",
    maxDays: 30,
    status: "active",
  },
  {
    id: 4,
    name: "Emergency Leave",
    description: "Urgent leave for emergency situations",
    maxDays: 5,
    status: "active",
  },
];

const initialJournalTypes: JournalType[] = [
  {
    id: 1,
    name: "Student Fee Payment",
    description: "Fee payments from students for courses",
    dashboards: ["Students", "Finance", "Reports"],
    color: "#10B981",
    status: "active",
  },
  {
    id: 2,
    name: "Employee Salary",
    description: "Monthly salary payments to employees",
    dashboards: ["HR", "Finance", "Reports"],
    color: "#3B82F6",
    status: "active",
  },
  {
    id: 3,
    name: "Office Expenses",
    description: "Day-to-day office operational expenses",
    dashboards: ["Finance", "Reports"],
    color: "#F59E0B",
    status: "active",
  },
  {
    id: 4,
    name: "Equipment Purchase",
    description: "Purchase of office equipment and supplies",
    dashboards: ["Finance", "Reports"],
    color: "#8B5CF6",
    status: "active",
  },
  {
    id: 5,
    name: "Marketing Expenses",
    description: "Marketing and advertising related expenses",
    dashboards: ["Marketing", "Finance", "Reports"],
    color: "#EF4444",
    status: "active",
  },
];

// Utility functions
const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-success text-success-foreground";
    case "Inactive":
      return "bg-secondary text-secondary-foreground";
    case "Expired":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

// Memoized components for better performance
const SettingsCard = memo(({ 
  item, 
  icon: Icon, 
  title, 
  subtitle, 
  status, 
  onEdit, 
  onDelete, 
  showSwitch = false,
  switchChecked = false,
  onSwitchChange = () => {}
}: {
  item: any;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  status?: string;
  onEdit: () => void;
  onDelete: () => void;
  showSwitch?: boolean;
  switchChecked?: boolean;
  onSwitchChange?: () => void;
}) => {
  const logRender = performanceLogger('SettingsCard', 'render');
  
  useEffect(() => {
    logRender();
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{subtitle}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {status && (
              <Badge className={getStatusColor(status)}>
                {status}
              </Badge>
            )}
            {showSwitch && (
              <Switch
                checked={switchChecked}
                onCheckedChange={onSwitchChange}
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
});

const VirtualList = memo(({ 
  items, 
  renderItem, 
  itemHeight = 120, 
  containerHeight = 600 
}: {
  items: any[];
  renderItem: (item: any) => React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
}) => {
  const { visibleItems, totalHeight, handleScroll } = useVirtualScrolling(items, itemHeight, containerHeight);

  return (
    <div 
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, style }) => (
          <div key={item.id} style={style}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
});

// Error Boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Settings Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Something went wrong</h3>
            <p className="text-muted-foreground">Please refresh the page to try again</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Settings = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("courses");
  
  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { batches, addBatch, updateBatch, deleteBatch } = useBatches();
  const { leaveTypes, addLeaveType, updateLeaveType, deleteLeaveType } = useLeaveTypes();
  const [journalTypesData, setJournalTypesData] = useState<JournalType[]>(initialJournalTypes);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State for all data - moved before conditional return to fix hooks order
  const [coursesData, setCoursesData] = useState<Course[]>(getInitialCourses());
  const [syllabiData, setSyllabiData] = useState<Syllabus[]>(initialSyllabi);
  const [batchesData, setBatchesData] = useState<Batch[]>(initialBatches);
  const [categoriesData, setCategoriesData] =
    useState<Category[]>(initialCategories);
  const [taxData, setTaxData] = useState<Tax[]>(initialTaxSettings);
  const [couponsData, setCouponsData] = useState<Coupon[]>(initialCoupons);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    duration: "",
    description: "",
    type: "",
    rate: "",
    discount: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    syllabus: "",
    dashboards: [] as string[],
    color: "",
  });

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  // Handle URL parameter for active tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  // Memoized filtered data
  const filteredCourses = useMemo(() => {
    if (!debouncedSearchTerm) return coursesData;
    return coursesData.filter(course => 
      course.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [coursesData, debouncedSearchTerm]);

  const filteredSyllabi = useMemo(() => {
    if (!debouncedSearchTerm) return syllabiData;
    return syllabiData.filter(syllabus => 
      syllabus.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      syllabus.code.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [syllabiData, debouncedSearchTerm]);

  const filteredBatches = useMemo(() => {
    if (!debouncedSearchTerm) return batches;
    return batches.filter(batch => 
      batch.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      batch.syllabus.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [batches, debouncedSearchTerm]);

  const filteredCategories = useMemo(() => {
    if (!debouncedSearchTerm) return categoriesData;
    return categoriesData.filter(category => 
      category.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      category.type.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [categoriesData, debouncedSearchTerm]);

  const filteredTaxes = useMemo(() => {
    if (!debouncedSearchTerm) return taxData;
    return taxData.filter(tax => 
      tax.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [taxData, debouncedSearchTerm]);

  const filteredCoupons = useMemo(() => {
    if (!debouncedSearchTerm) return couponsData;
    return couponsData.filter(coupon => 
      coupon.code.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [couponsData, debouncedSearchTerm]);

  const filteredLeaveTypes = useMemo(() => {
    if (!debouncedSearchTerm) return leaveTypes;
    return leaveTypes.filter(leaveType => 
      leaveType.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      leaveType.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [leaveTypes, debouncedSearchTerm]);

  const filteredJournalTypes = useMemo(() => {
    if (!debouncedSearchTerm) return journalTypesData;
    return journalTypesData.filter(journalType => 
      journalType.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      journalType.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [journalTypesData, debouncedSearchTerm]);

  const openDialog = useCallback((type: string, item?: any) => {
    setDialogType(type);
    setEditingItem(item);
    if (item) {
      setFormData({
        name: item.name || "",
        code: item.code || "",
        duration: item.duration || "",
        description: item.description || "",
        type: item.type || "",
        rate: item.rate?.toString() || "",
        discount: item.discount?.toString() || "",
        startDate: item.startDate ? new Date(item.startDate) : null,
        endDate: item.endDate ? new Date(item.endDate) : null,
        syllabus: item.syllabus || "",
        dashboards: item.dashboards || [],
        color: item.color || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        duration: "",
        description: "",
        type: "",
        rate: "",
        discount: "",
        startDate: null,
        endDate: null,
        syllabus: "",
        dashboards: [],
        color: "",
      });
    }
    setIsDialogOpen(true);
  }, []);

  // Loading check must come after all hooks
  if (isLoading) {
    return <FormSkeleton fields={10} showHeader={true} />;
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newId = editingItem ? editingItem.id : Date.now();

    switch (dialogType) {
      case "course":
        const courseItem: Course = {
          id: newId,
          name: formData.name,
          code: formData.code,
          duration: formData.duration,
          status: editingItem ? editingItem.status : "Active",
        };
        if (editingItem) {
          setCoursesData((prev) =>
            prev.map((item) => (item.id === editingItem.id ? courseItem : item))
          );
        } else {
          setCoursesData((prev) => [...prev, courseItem]);
        }
        break;

      case "syllabus":
        const syllabusItem: Syllabus = {
          id: newId,
          name: formData.name,
          code: formData.code,
          courses: [formData.name],
        };
        if (editingItem) {
          setSyllabiData((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? syllabusItem : item
            )
          );
        } else {
          setSyllabiData((prev) => [...prev, syllabusItem]);
        }
        break;

      case "batch":
        const batchItem: Batch = {
          id: newId,
          name: formData.name,
          syllabus: formData.syllabus,
          startDate: formData.startDate ? formData.startDate.toISOString().split('T')[0] : "",
          students: editingItem ? editingItem.students : 0,
        };
        if (editingItem) {
          updateBatch(editingItem.id, batchItem);
        } else {
          addBatch({
            name: formData.name,
            syllabus: formData.syllabus,
            startDate: formData.startDate ? formData.startDate.toISOString().split('T')[0] : "",
            students: 0,
          });
        }
        break;

      case "category":
        const categoryItem: Category = {
          id: newId,
          type: formData.type,
          name: formData.name,
          description: formData.description,
        };
        if (editingItem) {
          setCategoriesData((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? categoryItem : item
            )
          );
        } else {
          setCategoriesData((prev) => [...prev, categoryItem]);
        }
        break;

      case "tax":
        const taxItem: Tax = {
          id: newId,
          name: formData.name,
          rate: parseFloat(formData.rate) || 0,
          enabled: editingItem ? editingItem.enabled : true,
          description: formData.description,
        };
        if (editingItem) {
          setTaxData((prev) =>
            prev.map((item) => (item.id === editingItem.id ? taxItem : item))
          );
        } else {
          setTaxData((prev) => [...prev, taxItem]);
        }
        break;

      case "coupon":
        const couponItem: Coupon = {
          id: newId,
          code: formData.name,
          discount: parseFloat(formData.discount) || 0,
          startDate: formData.startDate ? formData.startDate.toISOString().split('T')[0] : "",
          endDate: formData.endDate ? formData.endDate.toISOString().split('T')[0] : "",
          status: editingItem ? editingItem.status : "Active",
        };
        if (editingItem) {
          setCouponsData((prev) =>
            prev.map((item) => (item.id === editingItem.id ? couponItem : item))
          );
        } else {
          setCouponsData((prev) => [...prev, couponItem]);
        }
        break;

      case "leaveType":
        if (editingItem) {
          updateLeaveType(editingItem.id, {
            name: formData.name,
            description: formData.description,
            maxDays: parseInt(formData.duration) || 0,
          });
        } else {
          addLeaveType({
            name: formData.name,
            description: formData.description,
            maxDays: parseInt(formData.duration) || 0,
            status: "active",
          });
        }
        break;

      case "journalType":
        const journalTypeItem: JournalType = {
          id: newId,
          name: formData.name,
          description: formData.description,
          dashboards: formData.dashboards,
          color: formData.color,
          status: editingItem ? editingItem.status : "active",
        };
        if (editingItem) {
          setJournalTypesData((prev) =>
            prev.map((item) => (item.id === editingItem.id ? journalTypeItem : item))
          );
        } else {
          setJournalTypesData((prev) => [...prev, journalTypeItem]);
        }
        break;
    }

    toast({
      title: "Success",
      description: `${
        editingItem ? "Updated" : "Created"
      } ${dialogType} successfully`,
    });
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (type: string, id: number) => {
    switch (type) {
      case "course":
        setCoursesData((prev) => prev.filter((item) => item.id !== id));
        break;
      case "syllabus":
        setSyllabiData((prev) => prev.filter((item) => item.id !== id));
        break;
      case "batch":
        deleteBatch(id);
        break;
      case "category":
        setCategoriesData((prev) => prev.filter((item) => item.id !== id));
        break;
      case "tax":
        setTaxData((prev) => prev.filter((item) => item.id !== id));
        break;
      case "coupon":
        setCouponsData((prev) => prev.filter((item) => item.id !== id));
        break;
      case "leaveType":
        deleteLeaveType(id);
        break;
      case "journalType":
        setJournalTypesData((prev) => prev.filter((item) => item.id !== id));
        break;
    }
    toast({
      title: "Success",
      description: `Deleted ${type} successfully`,
    });
  };

  const toggleTaxStatus = (id: number) => {
    setTaxData((prev) =>
      prev.map((tax) =>
        tax.id === id ? { ...tax, enabled: !tax.enabled } : tax
      )
    );
    toast({
      title: "Success",
      description: "Tax status updated",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Inactive":
        return "bg-secondary text-secondary-foreground";
      case "Expired":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const renderFormFields = () => {
    switch (dialogType) {
      case "course":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Course Name
              </Label>
              <Input
                id="name"
                placeholder="Enter course name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Course Code
              </Label>
              <Input
                id="code"
                placeholder="Enter course code"
                className="col-span-3"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input
                id="duration"
                placeholder="e.g., 6 months"
                className="col-span-3"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>
          </>
        );
      case "syllabus":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Syllabus Name
              </Label>
              <Input
                id="name"
                placeholder="Enter syllabus name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Syllabus Code
              </Label>
              <Input
                id="code"
                placeholder="Enter syllabus code"
                className="col-span-3"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>
          </>
        );
      case "batch":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Batch Name
              </Label>
              <Input
                id="name"
                placeholder="Enter batch name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="syllabus" className="text-right">
                Syllabus
              </Label>
              <Input
                id="syllabus"
                placeholder="Enter syllabus name"
                className="col-span-3"
                value={formData.syllabus}
                onChange={(e) =>
                  setFormData({ ...formData, syllabus: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <CustomDatePicker
                  value={formData.startDate}
                  onChange={(date) =>
                    setFormData({ ...formData, startDate: date })
                  }
                  placeholder="Select start date"
                  size="md"
                  className="w-full"
                />
              </div>
            </div>
          </>
        );
      case "category":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Category Name
              </Label>
              <Input
                id="name"
                placeholder="Enter category name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Leave">Leave</SelectItem>
                  <SelectItem value="Assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                className="col-span-3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </>
        );
      case "tax":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tax Name
              </Label>
              <Input
                id="name"
                placeholder="Enter tax name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rate" className="text-right">
                Rate (%)
              </Label>
              <Input
                id="rate"
                type="number"
                placeholder="Enter tax rate"
                className="col-span-3"
                value={formData.rate}
                onChange={(e) =>
                  setFormData({ ...formData, rate: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                className="col-span-3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </>
        );
      case "coupon":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Coupon Code
              </Label>
              <Input
                id="name"
                placeholder="Enter coupon code"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discount" className="text-right">
                Discount %
              </Label>
              <Input
                id="discount"
                type="number"
                placeholder="Enter discount percentage"
                className="col-span-3"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <CustomDatePicker
                  value={formData.startDate}
                  onChange={(date) =>
                    setFormData({ ...formData, startDate: date })
                  }
                  placeholder="Select start date"
                  size="md"
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <CustomDatePicker
                  value={formData.endDate}
                  onChange={(date) =>
                    setFormData({ ...formData, endDate: date })
                  }
                  placeholder="Select end date"
                  size="md"
                  className="w-full"
                />
              </div>
            </div>
          </>
        );
      case "leaveType":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Leave Type Name
              </Label>
              <Input
                id="name"
                placeholder="Enter leave type name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                className="col-span-3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Max Days
              </Label>
              <Input
                id="duration"
                type="number"
                placeholder="Enter maximum days"
                className="col-span-3"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>
          </>
        );
      case "journalType":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Journal Type Name
              </Label>
              <Input
                id="name"
                placeholder="Enter journal type name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                className="col-span-3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Input
                id="color"
                type="color"
                placeholder="Select color"
                className="col-span-3"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dashboards" className="text-right">
                Dashboards
              </Label>
              <div className="col-span-3 space-y-2">
                <p className="text-sm text-muted-foreground">Select which dashboards this journal type will appear in:</p>
                <div className="grid grid-cols-2 gap-2">
                  {["Students", "Tutors", "HR", "Finance", "Reports", "Marketing"].map((dashboard) => (
                    <div key={dashboard} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`dashboard-${dashboard}`}
                        checked={formData.dashboards.includes(dashboard)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              dashboards: [...formData.dashboards, dashboard]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              dashboards: formData.dashboards.filter(d => d !== dashboard)
                            });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`dashboard-${dashboard}`} className="text-sm">
                        {dashboard}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage system configuration and preferences
          </p>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tax">Tax Settings</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="leaveTypes">Leave Types</TabsTrigger>
          <TabsTrigger value="journalTypes">Journal Types</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Course Management</h2>
            </div>
            <div className="flex items-center space-x-2">
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
                onClick={() => navigate('/attendance')}
                className="text-xs sm:text-sm"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Attendance
              </Button>
              <Button onClick={() => openDialog("course")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {coursesData.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Book className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                        <CardDescription>
                          Code: {course.code} | Duration: {course.duration}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("course", course)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("course", course.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="syllabus" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Syllabus Management</h2>
            </div>
            <div className="flex items-center space-x-2">
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
              
              <Button onClick={() => openDialog("syllabus")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Syllabus
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {syllabiData.map((syllabus) => (
              <Card key={syllabus.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {syllabus.name}
                        </CardTitle>
                        <CardDescription>
                          Code: {syllabus.code} | Courses:{" "}
                          {syllabus.courses.join(", ")}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("syllabus", syllabus)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("syllabus", syllabus.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Batch Management</h2>
            </div>
            <div className="flex items-center space-x-2">
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
                onClick={() => navigate('/attendance')}
                className="text-xs sm:text-sm"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Attendance
              </Button>
              <Button onClick={() => openDialog("batch")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Batch
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {batches.map((batch) => (
              <Card key={batch.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{batch.name}</CardTitle>
                        <CardDescription>
                          Syllabus: {batch.syllabus} | Start: {batch.startDate}{" "}
                          | Students: {batch.students}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("batch", batch)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("batch", batch.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Category Management</h2>
            </div>
            <div className="flex items-center space-x-2">
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
                onClick={() => navigate('/attendance')}
                className="text-xs sm:text-sm"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Attendance
              </Button>
              <Button onClick={() => openDialog("category")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {categoriesData.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Tag className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {category.name}
                        </CardTitle>
                        <CardDescription>
                          Type: {category.type} | {category.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("category", category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("category", category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Tax Configuration</h2>
            </div>
            <div className="flex items-center space-x-2">
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
                onClick={() => navigate('/attendance')}
                className="text-xs sm:text-sm"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Attendance
              </Button>
              <Button onClick={() => openDialog("tax")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Tax
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {taxData.map((tax) => (
              <Card key={tax.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {tax.name} - {tax.rate}%
                        </CardTitle>
                        <CardDescription>{tax.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={tax.enabled}
                        onCheckedChange={() => toggleTaxStatus(tax.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("tax", tax)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("tax", tax.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coupons" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Coupon Management</h2>
            </div>
            <div className="flex items-center space-x-2">
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
                onClick={() => navigate('/attendance')}
                className="text-xs sm:text-sm"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Attendance
              </Button>
              <Button onClick={() => openDialog("coupon")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Coupon
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {couponsData.map((coupon) => (
              <Card key={coupon.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Percent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {coupon.code} - {coupon.discount}% OFF
                        </CardTitle>
                        <CardDescription>
                          Valid: {coupon.startDate} to {coupon.endDate}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(coupon.status)}>
                        {coupon.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("coupon", coupon)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("coupon", coupon.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaveTypes" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Leave Types Management</h2>
            </div>
            <div className="flex items-center space-x-2">
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
                onClick={() => navigate('/attendance')}
                className="text-xs sm:text-sm"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Attendance
              </Button>
              <Button onClick={() => openDialog("leaveType")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Leave Type
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {leaveTypes.map((leaveType) => (
              <Card key={leaveType.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {leaveType.name}
                        </CardTitle>
                        <CardDescription>
                          {leaveType.description} | Max Days: {leaveType.maxDays}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(leaveType.status === "active" ? "Active" : "Inactive")}>
                        {leaveType.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("leaveType", leaveType)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("leaveType", leaveType.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="journalTypes" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Journal Types Management</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/journals')}
                className="text-xs sm:text-sm"
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Journals
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/reports')}
                className="text-xs sm:text-sm"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Reports
              </Button>
              <Button onClick={() => openDialog("journalType")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Journal Type
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredJournalTypes.map((journalType) => (
              <Card key={journalType.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="p-2 rounded-lg" 
                        style={{ backgroundColor: `${journalType.color}20` }}
                      >
                        <Book 
                          className="w-5 h-5" 
                          style={{ color: journalType.color }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {journalType.name}
                        </CardTitle>
                        <CardDescription>
                          {journalType.description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {journalType.dashboards.map((dashboard) => (
                            <Badge 
                              key={dashboard} 
                              variant="outline" 
                              className="text-xs"
                            >
                              {dashboard}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(journalType.status === "active" ? "Active" : "Inactive")}>
                        {journalType.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("journalType", journalType)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("journalType", journalType.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit" : "Add"} {dialogType}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? "Update" : "Create a new"} {dialogType} entry
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">{renderFormFields()}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save {dialogType}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

// Set display names for debugging
SettingsCard.displayName = "SettingsCard";
VirtualList.displayName = "VirtualList";
Settings.displayName = "Settings";

export default Settings;
