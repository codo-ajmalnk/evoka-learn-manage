import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CardGridSkeleton } from "@/components/ui/skeletons/card-grid-skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  BellOff,
  Calendar,
  Check,
  CheckCheck,
  DollarSign,
  GraduationCap,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

// Dummy notifications data
const notifications = [
  {
    id: 1,
    type: "payment",
    title: "Fee Payment Received",
    message: "John Doe has submitted fee payment of ₹25,000 for approval",
    time: "2 minutes ago",
    isRead: false,
    priority: "high",
  },
  {
    id: 2,
    type: "attendance",
    title: "Low Attendance Alert",
    message: "Student Jane Smith has attendance below 75% this month",
    time: "1 hour ago",
    isRead: false,
    priority: "medium",
  },
  {
    id: 3,
    type: "assignment",
    title: "Assignment Submitted",
    message:
      "New assignment submission from Mike Johnson for Web Development Project",
    time: "3 hours ago",
    isRead: true,
    priority: "low",
  },
  {
    id: 4,
    type: "leave",
    title: "Leave Request",
    message: "Sarah Wilson has requested 2 days sick leave starting tomorrow",
    time: "5 hours ago",
    isRead: false,
    priority: "medium",
  },
  {
    id: 5,
    type: "system",
    title: "System Maintenance",
    message:
      "Scheduled maintenance will be performed tonight from 11 PM to 2 AM",
    time: "1 day ago",
    isRead: true,
    priority: "high",
  },
];

const Notifications = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notificationList, setNotificationList] = useState(notifications);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    paymentAlerts: true,
    attendanceAlerts: true,
    assignmentAlerts: true,
    leaveAlerts: true,
    systemAlerts: true,
  });

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <CardGridSkeleton cards={5} columns={2} showHeader={true} />;
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <DollarSign className="w-5 h-5 text-primary" />;
      case "attendance":
        return <Calendar className="w-5 h-5 text-warning" />;
      case "assignment":
        return <GraduationCap className="w-5 h-5 text-info" />;
      case "leave":
        return <User className="w-5 h-5 text-secondary" />;
      case "system":
        return <Settings className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-info text-info-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const markAsRead = (id: number) => {
    setNotificationList((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotificationList((prev) => prev.filter((notif) => notif.id !== id));
  };

  const unreadCount = notificationList.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">
              Manage your notifications and alerts
            </p>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-3">
            {notificationList.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md border-border/50 ${
                  !notification.isRead
                    ? "border-primary/30 bg-primary/5 shadow-sm"
                    : "bg-card/80 backdrop-blur-sm"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-xl bg-background/80 border border-border/30 shadow-sm">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <CardTitle className="text-base font-semibold">
                            {notification.title}
                          </CardTitle>
                          {!notification.isRead && (
                            <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-sm"></div>
                          )}
                          <Badge
                            className={`${getPriorityColor(
                              notification.priority
                            )} text-xs font-medium`}
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2 text-sm leading-relaxed">
                          {notification.message}
                        </CardDescription>
                        <p className="text-xs text-muted-foreground mt-3 font-medium">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
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

        <TabsContent value="unread" className="space-y-4">
          <div className="space-y-3">
            {notificationList
              .filter((n) => !n.isRead)
              .map((notification) => (
                <Card
                  key={notification.id}
                  className="border-primary/30 bg-primary/5 cursor-pointer transition-all duration-200 hover:shadow-md shadow-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-xl bg-background/80 border border-border/30 shadow-sm">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <CardTitle className="text-base font-semibold">
                              {notification.title}
                            </CardTitle>
                            <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-sm"></div>
                            <Badge
                              className={`${getPriorityColor(
                                notification.priority
                              )} text-xs font-medium`}
                            >
                              {notification.priority}
                            </Badge>
                          </div>
                          <CardDescription className="mt-2 text-sm leading-relaxed">
                            {notification.message}
                          </CardDescription>
                          <p className="text-xs text-muted-foreground mt-3 font-medium">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            {notificationList.filter((n) => !n.isRead).length === 0 && (
              <div className="text-center py-8">
                <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No unread notifications</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Delivery Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          emailNotifications: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in browser
                      </p>
                    </div>
                    <Switch
                      id="push"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          pushNotifications: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="payment">Payment Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Fee payments and financial transactions
                      </p>
                    </div>
                    <Switch
                      id="payment"
                      checked={notificationSettings.paymentAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          paymentAlerts: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="attendance">Attendance Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Low attendance and absence notifications
                      </p>
                    </div>
                    <Switch
                      id="attendance"
                      checked={notificationSettings.attendanceAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          attendanceAlerts: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="assignment">Assignment Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Assignment submissions and deadlines
                      </p>
                    </div>
                    <Switch
                      id="assignment"
                      checked={notificationSettings.assignmentAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          assignmentAlerts: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="leave">Leave Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Leave requests and approvals
                      </p>
                    </div>
                    <Switch
                      id="leave"
                      checked={notificationSettings.leaveAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          leaveAlerts: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system">System Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        System maintenance and updates
                      </p>
                    </div>
                    <Switch
                      id="system"
                      checked={notificationSettings.systemAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          systemAlerts: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
