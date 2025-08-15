import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  DollarSign,
  Download,
  Edit,
  GraduationCap,
  Plus,
  TrendingUp,
  Upload,
  Users,
  UserX,
} from "lucide-react";
import { memo } from "react";
import TasksDashboard from "@/components/TasksDashboard";

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

interface TutorDetailsDialogProps {
  tutor: Tutor;
}

const TutorDetailsDialog = memo(({ tutor }: TutorDetailsDialogProps) => {
  return (
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={tutor.photo} />
              <AvatarFallback>
                {tutor.firstName[0]}
                {tutor.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">
                {tutor.firstName} {tutor.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{tutor.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <UserX className="h-4 w-4 mr-1" />
              {tutor.status === "active" ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="batch">Batches</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm">{tutor.email}</p>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <p className="text-sm">{tutor.phone}</p>
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <p className="text-sm">{tutor.dob}</p>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <p className="text-sm">{tutor.gender}</p>
            </div>
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <p className="text-sm">{tutor.bloodGroup}</p>
            </div>
            <div className="space-y-2">
              <Label>Religion</Label>
              <p className="text-sm">{tutor.religion || "Not specified"}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Address</Label>
              <p className="text-sm">
                {tutor.address}, {tutor.pin}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Professional Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Qualification</Label>
              <p className="text-sm">{tutor.qualification}</p>
            </div>
            <div className="space-y-2">
              <Label>Experience</Label>
              <p className="text-sm">{tutor.experience}</p>
            </div>
            <div className="space-y-2">
              <Label>Subjects</Label>
              <div className="flex flex-wrap gap-1">
                {tutor.subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Joining Date</Label>
              <p className="text-sm">{tutor.joiningDate}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Account Details</Label>
            <div className="bg-muted p-3 rounded">
              <p className="text-sm">
                <strong>Bank:</strong> {tutor.accountDetails.bankName}
              </p>
              <p className="text-sm">
                <strong>Account:</strong> {tutor.accountDetails.accountNumber}
              </p>
              <p className="text-sm">
                <strong>IFSC:</strong> {tutor.accountDetails.ifsc}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Documents</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(tutor.documents).map(
                ([key, value]) =>
                  value && (
                    <Badge
                      key={key}
                      variant="outline"
                      className="justify-center"
                    >
                      {key.toUpperCase()}
                    </Badge>
                  )
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="batch" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Batch Assignment</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Assign Batch
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Batches
                    </p>
                    <p className="text-lg font-semibold">
                      {tutor.batches.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Batches
                    </p>
                    <p className="text-lg font-semibold">
                      {tutor.batches.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-lg font-semibold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Label>Assigned Batches</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tutor.batches.map((batchId, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{batchId}</p>
                        <p className="text-sm text-muted-foreground">
                          Batch ID: {batchId}
                        </p>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Payment Management</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Payment
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm opacity-90">Total Salary</p>
                <p className="text-xl font-bold">
                  ₹{tutor.salary.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm opacity-90">Paid Amount</p>
                <p className="text-xl font-bold">
                  ₹{tutor.paidAmount.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm opacity-90">Balance Due</p>
                <p className="text-xl font-bold">
                  ₹{(tutor.salary - tutor.paidAmount).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm opacity-90">Payment %</p>
                <p className="text-xl font-bold">
                  {Math.round((tutor.paidAmount / tutor.salary) * 100)}%
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Payment History</Label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            {tutor.payments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{payment.category}</h4>
                        <Badge
                          variant={
                            payment.status === "approved"
                              ? "success"
                              : payment.status === "rejected"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Date: {payment.date}
                      </p>
                      <p className="text-sm">{payment.description}</p>
                      {payment.screenshot && (
                        <Badge variant="outline" className="mt-2">
                          <Upload className="h-3 w-3 mr-1" />
                          Screenshot Available
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        ₹{payment.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Paid: ₹{payment.paid.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Attendance Management</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Record
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Total Present</p>
                <p className="text-xl font-semibold text-success">
                  {tutor.attendance.reduce(
                    (sum, record) => sum + record.present,
                    0
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-warning" />
                <p className="text-sm text-muted-foreground">Total Leave</p>
                <p className="text-xl font-semibold text-warning">
                  {tutor.attendance.reduce(
                    (sum, record) => sum + record.leave,
                    0
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-info" />
                <p className="text-sm text-muted-foreground">Overtime</p>
                <p className="text-xl font-semibold text-info">
                  {tutor.attendance.reduce(
                    (sum, record) => sum + record.overtime,
                    0
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <p className="text-sm text-muted-foreground">Attendance %</p>
                <p className="text-xl font-semibold text-purple-500">
                  {tutor.attendance.length > 0
                    ? Math.round(
                        (tutor.attendance.reduce(
                          (sum, record) => sum + record.present,
                          0
                        ) /
                          tutor.attendance.reduce(
                            (sum, record) =>
                              sum + record.present + record.leave,
                            0
                          )) *
                          100
                      )
                    : 0}
                  %
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <Label>Monthly Attendance Records</Label>
            {tutor.attendance.map((record) => (
              <Card key={record.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {record.month} {record.year}
                      </h4>
                      <div className="flex gap-6 text-sm mt-2">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          Present: {record.present} days
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-warning rounded-full"></div>
                          Leave: {record.leave} days
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-info rounded-full"></div>
                          Overtime: {record.overtime} hrs
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Task Management</h3>
          </div>
          
          <TasksDashboard userId={tutor.id} />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
});

TutorDetailsDialog.displayName = "TutorDetailsDialog";

export default TutorDetailsDialog; 