import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Plus, Upload, Download, Calendar as CalendarIcon, UserCheck, UserX, Users } from 'lucide-react';
import { format } from 'date-fns';

// Dummy data
const attendanceRecords = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Student',
    date: '2024-01-15',
    status: 'Present',
    timeIn: '09:00 AM',
    timeOut: '05:00 PM',
    batch: 'Web Development'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Tutor',
    date: '2024-01-15',
    status: 'Present',
    timeIn: '08:30 AM',
    timeOut: '06:00 PM',
    batch: 'Digital Marketing'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Student',
    date: '2024-01-15',
    status: 'Absent',
    timeIn: '-',
    timeOut: '-',
    batch: 'Graphic Design'
  }
];

const leaveRequests = [
  {
    id: 1,
    name: 'Sarah Wilson',
    role: 'Tutor',
    leaveType: 'Sick Leave',
    fromDate: '2024-01-16',
    toDate: '2024-01-18',
    status: 'Pending',
    reason: 'Medical emergency'
  },
  {
    id: 2,
    name: 'Tom Brown',
    role: 'Executive',
    leaveType: 'Personal Leave',
    fromDate: '2024-01-20',
    toDate: '2024-01-20',
    status: 'Approved',
    reason: 'Family function'
  }
];

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-success text-success-foreground';
      case 'Absent': return 'bg-destructive text-destructive-foreground';
      case 'Late': return 'bg-warning text-warning-foreground';
      case 'Approved': return 'bg-success text-success-foreground';
      case 'Pending': return 'bg-warning text-warning-foreground';
      case 'Rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const filteredRecords = attendanceRecords.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground">Track attendance for students and staff</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Leave Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Leave Request</DialogTitle>
                <DialogDescription>Request leave for specific dates</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="leaveType" className="text-right">Leave Type</Label>
                  <Select>
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
                  <Label htmlFor="fromDate" className="text-right">From Date</Label>
                  <Input id="fromDate" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="toDate" className="text-right">To Date</Label>
                  <Input id="toDate" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">Reason</Label>
                  <Input id="reason" placeholder="Enter reason for leave" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setIsLeaveDialogOpen(false)}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mark Attendance</DialogTitle>
                <DialogDescription>Record attendance for students or staff</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="person" className="text-right">Person</Label>
                  <Select>
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
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select>
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
                  <Label htmlFor="timeIn" className="text-right">Time In</Label>
                  <Input id="timeIn" type="time" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="timeOut" className="text-right">Time Out</Label>
                  <Input id="timeOut" type="time" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setIsAddDialogOpen(false)}>Save Attendance</Button>
              </DialogFooter>
            </DialogContent>
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
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search attendance..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
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

          <div className="grid gap-4">
            {filteredRecords.map((record) => (
              <Card key={record.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {record.status === 'Present' ? (
                          <UserCheck className="w-5 h-5 text-success" />
                        ) : (
                          <UserX className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{record.name}</CardTitle>
                        <CardDescription>{record.role} - {record.batch}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <div className="grid gap-4">
            {leaveRequests.map((leave) => (
              <Card key={leave.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{leave.name}</CardTitle>
                      <CardDescription>{leave.role} - {leave.leaveType}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(leave.status)}>{leave.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Duration:</span>
                      <p className="text-muted-foreground">{leave.fromDate} to {leave.toDate}</p>
                    </div>
                    <div>
                      <span className="font-medium">Reason:</span>
                      <p className="text-muted-foreground">{leave.reason}</p>
                    </div>
                    <div className="flex space-x-2">
                      {leave.status === 'Pending' && (
                        <>
                          <Button size="sm" variant="outline" className="text-success">Approve</Button>
                          <Button size="sm" variant="outline" className="text-destructive">Reject</Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Attendance CSV</CardTitle>
              <CardDescription>Upload attendance data using CSV file format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Drop your CSV file here or click to browse</p>
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
                    <span className="font-semibold text-success">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Absent:</span>
                    <span className="font-semibold text-destructive">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late:</span>
                    <span className="font-semibold text-warning">3</span>
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
  );
};

export default Attendance;