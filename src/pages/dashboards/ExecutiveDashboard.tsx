import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/ui/skeletons/dashboard-skeleton";
import { DashboardCalendar } from "@/components/DashboardCalendar";
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  BookOpen,
  UserCheck,
  AlertCircle,
  Plus,
  CheckSquare,
  Calendar as CalendarIcon
} from "lucide-react";
import { useState, useEffect } from "react";

// Dummy data based on user role
const getDashboardData = (role: string) => {
  const commonStats = {
    totalStudents: 245,
    totalTutors: 18,
    totalRevenue: 125000,
    monthlyGrowth: 12.5,
  };

  const roleSpecificData: Record<string, any> = {
    admin: {
      ...commonStats,
      pendingApprovals: 8,
      activeAssignments: 34,
      todayAttendance: 89,
      recentActivities: [
        { id: 1, type: "payment", message: "New payment received from John Doe", time: "2 hours ago" },
        { id: 2, type: "student", message: "New student registration - Sarah Wilson", time: "4 hours ago" },
        { id: 3, type: "approval", message: "Salary approval pending for 3 tutors", time: "6 hours ago" },
        { id: 4, type: "attendance", message: "Monthly attendance report generated", time: "1 day ago" },
      ]
    },
    manager: {
      ...commonStats,
      myStudents: 45,
      myExecutives: 6,
      pendingApprovals: 5,
      todayAttendance: 89,
    },
    hr: {
      ...commonStats,
      totalEmployees: 67,
      pendingLeaves: 4,
      salaryApprovals: 12,
      newApplications: 8,
    },
    executive: {
      myStudents: 32,
      feesCollected: 45000,
      pendingFees: 8,
      todayAttendance: 28,
    },
    tutor: {
      myStudents: 25,
      myAssignments: 8,
      pendingGrading: 12,
      todayClasses: 4,
    },
    student: {
      myAssignments: 6,
      pendingSubmissions: 2,
      attendanceRate: 94,
      feeBalance: 15000,
    }
  };

  return roleSpecificData[role] || roleSpecificData.student;
};

const ExecutiveDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || "student";
  const data = getDashboardData(role);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const StatCard = ({ title, value, change, icon: Icon, variant = "default" }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">
            <span className={`inline-flex items-center ${change > 0 ? 'text-success' : 'text-destructive'}`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {change > 0 ? '+' : ''}{change}%
            </span>
            {" "}from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  const renderAdminDashboard = () => (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={data.totalStudents}
          change={8.2}
          icon={GraduationCap}
        />
        <StatCard
          title="Total Tutors"
          value={data.totalTutors}
          change={2.1}
          icon={Users}
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${data.totalRevenue.toLocaleString()}`}
          change={data.monthlyGrowth}
          icon={DollarSign}
        />
        <StatCard
          title="Pending Approvals"
          value={data.pendingApprovals}
          icon={AlertCircle}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest activities across the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivities.map((activity: any) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline" onClick={() => window.location.href = '/students'}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
            <Button className="w-full" variant="outline" onClick={() => window.location.href = '/tutors'}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tutor
            </Button>
            <Button className="w-full" variant="outline" onClick={() => window.location.href = '/attendance'}>
              <Calendar className="h-4 w-4 mr-2" />
              View Attendance
            </Button>
            <Button className="w-full" variant="outline" onClick={() => window.location.href = '/assignments'}>
              <BookOpen className="h-4 w-4 mr-2" />
              Manage Assignments
            </Button>
            <Button className="w-full" variant="outline" onClick={() => window.location.href = '/tasks'}>
              <CheckSquare className="h-4 w-4 mr-2" />
              Manage Tasks
            </Button>
            <Button className="w-full" variant="outline" onClick={() => window.location.href = '/tasks?view=calendar'}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Widget */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-6">
        <DashboardCalendar userId={user.id || 'ADMIN001'} userRole={role} />
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="font-medium">{data.totalStudents + data.totalTutors}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">System Status</span>
                <Badge variant="outline" className="text-green-600">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Backup</span>
                <span className="text-sm">2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderRoleSpecificDashboard = () => {
    switch (role) {
      case "admin":
        return renderAdminDashboard();
      
      case "manager":
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="My Students" value={data.myStudents} icon={GraduationCap} />
              <StatCard title="My Executives" value={data.myExecutives} icon={UserCheck} />
              <StatCard title="Pending Approvals" value={data.pendingApprovals} icon={AlertCircle} />
              <StatCard title="Today's Attendance" value={`${data.todayAttendance}%`} icon={Calendar} />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" onClick={() => window.location.href = '/tasks'}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Manage Tasks
                </Button>
              </CardContent>
            </Card>

            {/* Calendar Widget */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-6">
              <DashboardCalendar userId={user.id || 'MGR001'} userRole={role} />
              <Card>
                <CardHeader>
                  <CardTitle>Team Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Team Members</span>
                      <span className="font-medium">{data.myStudents + data.myExecutives}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending Approvals</span>
                      <span className="font-medium text-orange-600">{data.pendingApprovals}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );
      
              case "hr":
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Employees" value={data.totalEmployees} icon={Users} />
              <StatCard title="Pending Leaves" value={data.pendingLeaves} icon={Calendar} />
              <StatCard title="Salary Approvals" value={data.salaryApprovals} icon={DollarSign} />
              <StatCard title="New Applications" value={data.newApplications} icon={AlertCircle} />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" onClick={() => window.location.href = '/tasks'}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  View Tasks
                </Button>
              </CardContent>
            </Card>

            {/* Calendar Widget */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-6">
              <DashboardCalendar userId={user.id || 'HR001'} userRole={role} />
              <Card>
                <CardHeader>
                  <CardTitle>HR Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Employees</span>
                      <span className="font-medium">{data.totalEmployees}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending Leaves</span>
                      <span className="font-medium text-orange-600">{data.pendingLeaves}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Salary Approvals</span>
                      <span className="font-medium text-blue-600">{data.salaryApprovals}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );
      
      case "executive":
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="My Students" value={data.myStudents} icon={GraduationCap} />
              <StatCard title="Fees Collected" value={`₹${data.feesCollected.toLocaleString()}`} icon={DollarSign} />
              <StatCard title="Pending Fees" value={data.pendingFees} icon={AlertCircle} />
              <StatCard title="Today's Attendance" value={data.todayAttendance} icon={Calendar} />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" onClick={() => window.location.href = '/tasks'}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  View Tasks
                </Button>
              </CardContent>
            </Card>

            {/* Calendar Widget */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-6">
              <DashboardCalendar userId={user.id || 'EXE001'} userRole={role} />
              <Card>
                <CardHeader>
                  <CardTitle>Executive Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">My Students</span>
                      <span className="font-medium">{data.myStudents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fees Collected</span>
                      <span className="font-medium text-green-600">₹{data.feesCollected.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending Fees</span>
                      <span className="font-medium text-orange-600">{data.pendingFees}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );
      
      case "tutor":
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="My Students" value={data.myStudents} icon={GraduationCap} />
              <StatCard title="My Assignments" value={data.myAssignments} icon={BookOpen} />
              <StatCard title="Pending Grading" value={data.pendingGrading} icon={AlertCircle} />
              <StatCard title="Today's Classes" value={data.todayClasses} icon={Calendar} />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" onClick={() => window.location.href = '/tasks'}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  View My Tasks
                </Button>
              </CardContent>
            </Card>

            {/* Calendar Widget */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-6">
              <DashboardCalendar userId={user.id || 'TUT001'} userRole={role} />
              <Card>
                <CardHeader>
                  <CardTitle>Tutor Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">My Students</span>
                      <span className="font-medium">{data.myStudents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">My Assignments</span>
                      <span className="font-medium">{data.myAssignments}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending Grading</span>
                      <span className="font-medium text-orange-600">{data.pendingGrading}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );
      
      case "student":
        return (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="My Assignments" value={data.myAssignments} icon={BookOpen} />
              <StatCard title="Pending Submissions" value={data.pendingSubmissions} icon={AlertCircle} />
              <StatCard title="Attendance Rate" value={`${data.attendanceRate}%`} icon={Calendar} />
              <StatCard title="Fee Balance" value={`₹${data.feeBalance.toLocaleString()}`} icon={DollarSign} />
            </div>

            {/* Calendar Widget */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mt-6">
              <DashboardCalendar userId={user.id || 'STU001'} userRole={role} compact />
              <Card>
                <CardHeader>
                  <CardTitle>Student Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">My Assignments</span>
                      <span className="font-medium">{data.myAssignments}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Attendance Rate</span>
                      <span className="font-medium text-green-600">{data.attendanceRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fee Balance</span>
                      <span className="font-medium text-orange-600">₹{data.feeBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );
      
      default:
        return renderAdminDashboard();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user.name || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening in your {role} portal today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="capitalize">
            {role} Dashboard
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/calendar'}
            className="hidden md:flex"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </div>
      </div>

      {renderRoleSpecificDashboard()}
    </div>
  );
};

export default ExecutiveDashboard;