import React, { useState, useCallback, useMemo, useEffect, memo, lazy, Suspense, useRef } from 'react';
import { DashboardSkeleton } from '@/components/ui/skeletons/dashboard-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { Download, FileText, TrendingUp, Users, DollarSign, Calendar as CalendarIcon, Filter, RefreshCw, Eye, BarChart3, PieChart as PieChartIcon, Activity, Target, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format, differenceInDays, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// Lazy load chart components for better performance
const LazyBarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
const LazyAreaChart = lazy(() => import('recharts').then(module => ({ default: module.AreaChart })));
const LazyPieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })));

// Simple debounce hook implementation
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

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
const useThrottle = <T extends (...args: any[]) => any>(func: T, delay: number): T => {
  const lastRun = useRef(Date.now());

  return useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      func(...args);
      lastRun.current = Date.now();
    }
  }, [func, delay]) as T;
};

// Performance logger
const performanceLogger = (componentName: string, operation: string) => {
  const start = performance.now();
  return () => {
    const end = performance.now();
    console.log(`${componentName} ${operation}: ${(end - start).toFixed(2)}ms`);
  };
};

// Virtual scrolling hook for large datasets
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

// Enhanced data with more comprehensive analytics - memoized for performance
const getAttendanceData = () => {
  const cacheKey = 'attendanceData';
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const data = [
    { month: 'Jan', present: 85, absent: 15, rate: 85, target: 90 },
    { month: 'Feb', present: 88, absent: 12, rate: 88, target: 90 },
    { month: 'Mar', present: 92, absent: 8, rate: 92, target: 90 },
    { month: 'Apr', present: 87, absent: 13, rate: 87, target: 90 },
    { month: 'May', present: 90, absent: 10, rate: 90, target: 90 },
    { month: 'Jun', present: 94, absent: 6, rate: 94, target: 90 },
    { month: 'Jul', present: 96, absent: 4, rate: 96, target: 90 }
  ];

  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};

const getRevenueData = () => {
  const cacheKey = 'revenueData';
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const data = [
    { month: 'Jan', fees: 450000, salaries: 250000, expenses: 100000, profit: 100000 },
    { month: 'Feb', fees: 480000, salaries: 260000, expenses: 110000, profit: 110000 },
    { month: 'Mar', fees: 520000, salaries: 270000, expenses: 120000, profit: 130000 },
    { month: 'Apr', fees: 495000, salaries: 255000, expenses: 115000, profit: 125000 },
    { month: 'May', fees: 540000, salaries: 280000, expenses: 125000, profit: 135000 },
    { month: 'Jun', fees: 580000, salaries: 290000, expenses: 130000, profit: 160000 },
    { month: 'Jul', fees: 620000, salaries: 300000, expenses: 135000, profit: 185000 }
  ];

  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};

const getCourseData = () => {
  const cacheKey = 'courseData';
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const data = [
    { name: 'Web Development', students: 45, completion: 85, revenue: 180000, color: 'hsl(var(--primary))' },
    { name: 'Digital Marketing', students: 32, completion: 78, revenue: 128000, color: 'hsl(var(--secondary))' },
    { name: 'Graphic Design', students: 28, completion: 92, revenue: 112000, color: 'hsl(var(--accent))' },
    { name: 'Data Science', students: 18, completion: 88, revenue: 90000, color: 'hsl(var(--muted))' }
  ];

  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};

const getPerformanceData = () => {
  const cacheKey = 'performanceData';
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const data = [
    { department: 'Frontend', students: 45, avgScore: 88, passRate: 94 },
    { department: 'Backend', students: 32, avgScore: 85, passRate: 91 },
    { department: 'Design', students: 28, avgScore: 92, passRate: 96 },
    { department: 'Data Science', students: 18, avgScore: 89, passRate: 89 }
  ];

  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};

const getRecentActivities = () => {
  const cacheKey = 'recentActivities';
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const data = [
    { id: 1, type: 'report', title: 'Monthly Financial Report Generated', time: '2 minutes ago', status: 'completed' },
    { id: 2, type: 'export', title: 'Student Data Export Completed', time: '15 minutes ago', status: 'completed' },
    { id: 3, type: 'alert', title: 'Low Attendance Alert for Web Dev Course', time: '1 hour ago', status: 'warning' },
    { id: 4, type: 'report', title: 'Weekly Analytics Report Scheduled', time: '2 hours ago', status: 'pending' }
  ];

  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};

// Memoized components for better performance
const MetricCard = memo(({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  borderColor, 
  iconColor, 
  textColor, 
  growth, 
  progressValue 
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  borderColor: string;
  iconColor: string;
  textColor: string;
  growth: { value: number; label: string };
  progressValue: number;
}) => {
  const logRender = performanceLogger('MetricCard', 'render');
  
  useEffect(() => {
    logRender();
  });

  return (
    <Card className={`bg-gradient-to-br ${gradient} ${borderColor}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 ${iconColor} rounded-lg`}>
          <Icon className={`h-5 w-5 ${textColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${textColor}`}>{value}</div>
        <div className="flex items-center mt-2 text-sm">
          <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-green-600 dark:text-green-400 font-medium">+{growth.value}%</span>
          <span className="text-muted-foreground ml-1">{growth.label}</span>
        </div>
        <Progress value={progressValue} className="mt-3" />
      </CardContent>
    </Card>
  );
});

const ActivityItem = memo(({ activity }: { activity: any }) => {
  const logRender = performanceLogger('ActivityItem', 'render');
  
  useEffect(() => {
    logRender();
  });

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <div className="flex items-center gap-3">
        <div className={cn("w-2 h-2 rounded-full", 
          activity.status === 'completed' ? 'bg-green-500' :
          activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        )} />
        <div>
          <p className="text-sm font-medium">{activity.title}</p>
          <p className="text-xs text-muted-foreground">{activity.time}</p>
        </div>
      </div>
      <Badge variant={activity.status === 'completed' ? 'success' : 
                     activity.status === 'warning' ? 'warning' : 'default'}>
        {activity.status}
      </Badge>
    </div>
  );
});

const ReportButton = memo(({ 
  icon: Icon, 
  title, 
  subtitle, 
  onClick, 
  variant = "outline",
  iconColor = "text-primary",
  hoverColor = "hover:bg-primary/10"
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  onClick: () => void;
  variant?: "outline" | "default";
  iconColor?: string;
  hoverColor?: string;
}) => {
  const logRender = performanceLogger('ReportButton', 'render');
  
  useEffect(() => {
    logRender();
  });

  return (
    <Button 
      variant={variant} 
      className={`h-24 flex flex-col gap-2 ${hoverColor} transition-colors`}
      onClick={onClick}
    >
      <Icon className={`w-8 h-8 ${iconColor}`} />
      <span className="font-medium">{title}</span>
      <span className="text-xs text-muted-foreground">{subtitle}</span>
    </Button>
  );
});

const VirtualActivityList = memo(({ activities }: { activities: any[] }) => {
  const itemHeight = 80;
  const containerHeight = 400;
  const { visibleItems, totalHeight, handleScroll } = useVirtualScrolling(activities, itemHeight, containerHeight);

  return (
    <div 
      className="space-y-4 overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item: activity, style }) => (
          <div key={activity.id} style={style}>
            <ActivityItem activity={activity} />
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
    console.error('Reports Error:', error, errorInfo);
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

const Reports = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [fromDate, setFromDate] = useState<Date>(subDays(new Date(), 30));
  const [toDate, setToDate] = useState<Date>(new Date());
  const [reportType, setReportType] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized data
  const attendanceData = useMemo(() => getAttendanceData(), []);
  const revenueData = useMemo(() => getRevenueData(), []);
  const courseData = useMemo(() => getCourseData(), []);
  const performanceData = useMemo(() => getPerformanceData(), []);
  const recentActivities = useMemo(() => getRecentActivities(), []);

  // Professional-level analytics functions - moved before conditional return
  const handleExportReport = useCallback(async (type: string) => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast({
        title: "Export Successful",
        description: `${type} report has been exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  }, [toast]);

  const handleGenerateReport = useCallback(async () => {
    if (!reportType) {
      toast({
        title: "Report Type Required",
        description: "Please select a report type before generating.",
        variant: "destructive",
      });
      return;
    }
    
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing
      toast({
        title: "Report Generated",
        description: `${reportType} report has been generated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  }, [reportType, toast]);

  const handleDateRangeChange = useCallback((range: string) => {
    setSelectedDateRange(range);
    const now = new Date();
    
    switch (range) {
      case '7d':
        setFromDate(subDays(now, 7));
        setToDate(now);
        break;
      case '30d':
        setFromDate(subDays(now, 30));
        setToDate(now);
        break;
      case '3m':
        setFromDate(subMonths(now, 3));
        setToDate(now);
        break;
      case '6m':
        setFromDate(subMonths(now, 6));
        setToDate(now);
        break;
      case '1y':
        setFromDate(subMonths(now, 12));
        setToDate(now);
        break;
      default:
        break;
    }
  }, []);

  // Throttled handlers for better performance
  const throttledExportReport = useThrottle(handleExportReport, 1000);
  const throttledGenerateReport = useThrottle(handleGenerateReport, 1000);

  const analyticsMetrics = useMemo(() => {
    const totalStudents = courseData.reduce((sum, course) => sum + course.students, 0);
    const totalRevenue = courseData.reduce((sum, course) => sum + course.revenue, 0);
    const avgCompletion = courseData.reduce((sum, course) => sum + course.completion, 0) / courseData.length;
    const currentMonthRevenue = revenueData[revenueData.length - 1]?.fees || 0;
    const previousMonthRevenue = revenueData[revenueData.length - 2]?.fees || 0;
    const revenueGrowth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100);
    
    return {
      totalStudents,
      totalRevenue,
      avgCompletion,
      revenueGrowth,
      attendanceRate: attendanceData[attendanceData.length - 1]?.rate || 0
    };
  }, [courseData, revenueData, attendanceData]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Filtered activities based on search
  const filteredActivities = useMemo(() => {
    if (!debouncedSearchTerm) return recentActivities;
    return recentActivities.filter(activity => 
      activity.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      activity.type.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [recentActivities, debouncedSearchTerm]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Reports & Analytics</h1>
              <p className="text-lg text-muted-foreground mt-2">Generate and analyze comprehensive reports with advanced insights</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={() => setRefreshing(true)}
                disabled={refreshing}
                className="bg-background hover:bg-muted"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} />
                Refresh Data
              </Button>
              <Button 
                onClick={() => throttledExportReport('All Reports')}
                disabled={refreshing}
                className="bg-primary hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Export All Reports
              </Button>
            </div>
          </div>

          {/* Quick Date Range Filters */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Label className="text-sm font-medium">Quick Filters:</Label>
                {['7d', '30d', '3m', '6m', '1y'].map((range) => (
                  <Button
                    key={range}
                    variant={selectedDateRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDateRangeChange(range)}
                    className="h-8"
                  >
                    {range === '7d' ? '7 Days' : 
                     range === '30d' ? '30 Days' : 
                     range === '3m' ? '3 Months' : 
                     range === '6m' ? '6 Months' : '1 Year'}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advanced Report Filters */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Advanced Report Filters
              </CardTitle>
              <CardDescription>Configure your report parameters for detailed analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="reportType" className="text-sm font-medium">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview Report</SelectItem>
                      <SelectItem value="attendance">Attendance Report</SelectItem>
                      <SelectItem value="financial">Financial Report</SelectItem>
                      <SelectItem value="student">Student Report</SelectItem>
                      <SelectItem value="staff">Staff Report</SelectItem>
                      <SelectItem value="performance">Performance Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "MMM dd, yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar 
                        mode="single" 
                        selected={fromDate} 
                        onSelect={setFromDate} 
                        initialFocus 
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm font-medium">To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "MMM dd, yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar 
                        mode="single" 
                        selected={toDate} 
                        onSelect={setToDate} 
                        initialFocus 
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm font-medium">Metric Focus</Label>
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue Analysis</SelectItem>
                      <SelectItem value="attendance">Attendance Tracking</SelectItem>
                      <SelectItem value="performance">Performance Metrics</SelectItem>
                      <SelectItem value="enrollment">Enrollment Trends</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    className="w-full" 
                    onClick={throttledGenerateReport}
                    disabled={refreshing}
                  >
                    {refreshing ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activity Feed with Search */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Real-time Activity
              </CardTitle>
              <div className="mt-4">
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading activities...</div>}>
                <VirtualActivityList activities={filteredActivities} />
              </Suspense>
            </CardContent>
          </Card>

          {/* Enhanced Tabs with Professional Analytics */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Attendance
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Financial
              </TabsTrigger>
              <TabsTrigger value="academic" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Academic
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Enhanced Key Metrics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Students"
                  value={analyticsMetrics.totalStudents}
                  icon={Users}
                  gradient="from-blue-500/10 to-blue-600/10"
                  borderColor="border-blue-200 dark:border-blue-800"
                  iconColor="bg-blue-500/20"
                  textColor="text-blue-600 dark:text-blue-400"
                  growth={{ value: 12, label: "from last month" }}
                  progressValue={75}
                />

                <MetricCard
                  title="Monthly Revenue"
                  value={formatCurrency(revenueData[revenueData.length - 1]?.fees || 0)}
                  icon={DollarSign}
                  gradient="from-green-500/10 to-green-600/10"
                  borderColor="border-green-200 dark:border-green-800"
                  iconColor="bg-green-500/20"
                  textColor="text-green-600 dark:text-green-400"
                  growth={{ value: parseFloat(analyticsMetrics.revenueGrowth.toFixed(1)), label: "from last month" }}
                  progressValue={Math.min(analyticsMetrics.revenueGrowth * 10, 100)}
                />

                <MetricCard
                  title="Attendance Rate"
                  value={`${analyticsMetrics.attendanceRate}%`}
                  icon={TrendingUp}
                  gradient="from-purple-500/10 to-purple-600/10"
                  borderColor="border-purple-200 dark:border-purple-800"
                  iconColor="bg-purple-500/20"
                  textColor="text-purple-600 dark:text-purple-400"
                  growth={{ value: 2, label: "from last month" }}
                  progressValue={analyticsMetrics.attendanceRate}
                />

                <MetricCard
                  title="Course Completion"
                  value={`${analyticsMetrics.avgCompletion.toFixed(1)}%`}
                  icon={Target}
                  gradient="from-orange-500/10 to-orange-600/10"
                  borderColor="border-orange-200 dark:border-orange-800"
                  iconColor="bg-orange-500/20"
                  textColor="text-orange-600 dark:text-orange-400"
                  growth={{ value: 5, label: "from last month" }}
                  progressValue={analyticsMetrics.avgCompletion}
                />
              </div>

              {/* Enhanced Interactive Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Attendance Trends & Targets</span>
                      <Button variant="outline" size="sm" onClick={() => throttledExportReport('Attendance Trends')}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </CardTitle>
                    <CardDescription>Monthly attendance rates with target benchmarks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading chart...</div>}>
                      <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={attendanceData}>
                          <defs>
                            <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                          <YAxis stroke="hsl(var(--foreground))" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--background))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }} 
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="rate" 
                            stroke="hsl(var(--primary))" 
                            fillOpacity={1} 
                            fill="url(#colorAttendance)"
                            name="Attendance Rate"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="target" 
                            stroke="hsl(var(--destructive))" 
                            strokeDasharray="5 5"
                            name="Target"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Suspense>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Revenue vs Expenses Analysis</span>
                      <Button variant="outline" size="sm" onClick={() => throttledExportReport('Financial Analysis')}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </CardTitle>
                    <CardDescription>Comprehensive financial performance tracking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading chart...</div>}>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                          <YAxis stroke="hsl(var(--foreground))" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--background))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [formatCurrency(value), '']}
                          />
                          <Legend />
                          <Bar dataKey="fees" fill="hsl(var(--primary))" name="Fee Collection" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="salaries" fill="hsl(var(--secondary))" name="Salaries" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="expenses" fill="hsl(var(--accent))" name="Other Expenses" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="profit" fill="hsl(var(--success))" name="Net Profit" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Suspense>
                  </CardContent>
                </Card>
              </div>

              {/* Advanced Course Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Course Performance Matrix</CardTitle>
                    <CardDescription>Enrollment vs completion rates by course</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading chart...</div>}>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={courseData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="students"
                          >
                            {courseData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number, name: string) => [`${value} students`, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Suspense>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Department Performance Overview</CardTitle>
                    <CardDescription>Average scores and pass rates by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {performanceData.map((dept, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{dept.department}</span>
                            <div className="flex items-center gap-4 text-sm">
                              <span>Avg: {dept.avgScore}%</span>
                              <span>Pass: {dept.passRate}%</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Progress value={dept.avgScore} className="flex-1" />
                            <Progress value={dept.passRate} className="flex-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-6">
              <div className="grid gap-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Advanced Attendance Analytics</CardTitle>
                    <CardDescription>Comprehensive attendance tracking and reporting tools</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <ReportButton
                        icon={FileText}
                        title="Daily Report"
                        subtitle="Current day attendance"
                        onClick={() => throttledExportReport('Daily Attendance')}
                      />
                      <ReportButton
                        icon={BarChart3}
                        title="Weekly Report"
                        subtitle="7-day attendance trends"
                        onClick={() => throttledExportReport('Weekly Attendance')}
                      />
                      <ReportButton
                        icon={PieChartIcon}
                        title="Monthly Report"
                        subtitle="Monthly analytics"
                        onClick={() => throttledExportReport('Monthly Attendance')}
                      />
                      <ReportButton
                        icon={Activity}
                        title="Alert System"
                        subtitle="Low attendance alerts"
                        onClick={() => throttledExportReport('Attendance Alerts')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid gap-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Financial Intelligence Dashboard</CardTitle>
                    <CardDescription>Advanced financial reporting and business intelligence</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <ReportButton
                        icon={DollarSign}
                        title="Fee Collection"
                        subtitle="Revenue tracking"
                        onClick={() => throttledExportReport('Fee Collection Report')}
                        iconColor="text-green-600"
                        hoverColor="hover:bg-green-500/10"
                      />
                      <ReportButton
                        icon={Users}
                        title="Payroll Report"
                        subtitle="Staff compensation"
                        onClick={() => throttledExportReport('Salary Report')}
                        iconColor="text-blue-600"
                        hoverColor="hover:bg-blue-500/10"
                      />
                      <ReportButton
                        icon={TrendingUp}
                        title="Expense Analysis"
                        subtitle="Cost breakdown"
                        onClick={() => throttledExportReport('Expense Analysis')}
                        iconColor="text-orange-600"
                        hoverColor="hover:bg-orange-500/10"
                      />
                      <ReportButton
                        icon={FileText}
                        title="P&L Statement"
                        subtitle="Financial performance"
                        onClick={() => throttledExportReport('Profit & Loss Statement')}
                        iconColor="text-purple-600"
                        hoverColor="hover:bg-purple-500/10"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="academic" className="space-y-6">
              <div className="grid gap-6">
                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Academic Performance Intelligence</CardTitle>
                    <CardDescription>Student outcomes and educational effectiveness analytics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ReportButton
                        icon={Users}
                        title="Student Progress"
                        subtitle="Individual performance tracking"
                        onClick={() => throttledExportReport('Student Progress Report')}
                        iconColor="text-indigo-600"
                        hoverColor="hover:bg-indigo-500/10"
                      />
                      <ReportButton
                        icon={BarChart3}
                        title="Course Analytics"
                        subtitle="Course effectiveness metrics"
                        onClick={() => throttledExportReport('Course Analytics')}
                        iconColor="text-emerald-600"
                        hoverColor="hover:bg-emerald-500/10"
                      />
                      <ReportButton
                        icon={Target}
                        title="Performance Metrics"
                        subtitle="Learning outcomes analysis"
                        onClick={() => throttledExportReport('Performance Metrics')}
                        iconColor="text-rose-600"
                        hoverColor="hover:bg-rose-500/10"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
});

// Set display names for debugging
MetricCard.displayName = "MetricCard";
ActivityItem.displayName = "ActivityItem";
ReportButton.displayName = "ReportButton";
VirtualActivityList.displayName = "VirtualActivityList";
Reports.displayName = "Reports";

export default Reports;