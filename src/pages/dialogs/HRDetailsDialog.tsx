import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo } from "react";
import TasksDashboard from "@/components/TasksDashboard";

interface HRPerson {
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
  specialization: string;
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

const HRDetailsDialog = memo(({ hr }: { hr: HRPerson }) => (
  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={hr.photo} />
          <AvatarFallback>
            {hr.firstName[0]}
            {hr.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold">
            {hr.firstName} {hr.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {hr.id} • {hr.designation}
          </p>
        </div>
      </DialogTitle>
    </DialogHeader>

    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="professional">Professional</TabsTrigger>
        <TabsTrigger value="payment">Payments</TabsTrigger>
        <TabsTrigger value="attendance">Attendance</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-sm">{hr.email}</p>
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <p className="text-sm">{hr.phone}</p>
          </div>
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <p className="text-sm">{hr.dob}</p>
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <p className="text-sm">{hr.gender}</p>
          </div>
          <div className="space-y-2">
            <Label>Blood Group</Label>
            <p className="text-sm">{hr.bloodGroup}</p>
          </div>
          <div className="space-y-2">
            <Label>Religion</Label>
            <p className="text-sm">{hr.religion || "Not specified"}</p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Address</Label>
            <p className="text-sm">
              {hr.address}, {hr.pin}
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="professional" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Designation</Label>
            <p className="text-sm">{hr.designation}</p>
          </div>
          <div className="space-y-2">
            <Label>Specialization</Label>
            <p className="text-sm">{hr.specialization}</p>
          </div>
          <div className="space-y-2">
            <Label>Qualification</Label>
            <p className="text-sm">{hr.qualification}</p>
          </div>
          <div className="space-y-2">
            <Label>Experience</Label>
            <p className="text-sm">{hr.experience}</p>
          </div>
          <div className="space-y-2">
            <Label>Joining Date</Label>
            <p className="text-sm">{hr.joiningDate}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Account Details</Label>
          <div className="bg-muted p-3 rounded">
            <p className="text-sm">
              <strong>Bank:</strong> {hr.accountDetails.bankName}
            </p>
            <p className="text-sm">
              <strong>Account:</strong> {hr.accountDetails.accountNumber}
            </p>
            <p className="text-sm">
              <strong>IFSC:</strong> {hr.accountDetails.ifsc}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Documents</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(hr.documents).map(
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

      <TabsContent value="payment" className="space-y-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-sm text-muted-foreground">Total Salary</p>
              <p className="text-lg font-semibold">
                ₹{hr.salary.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-lg font-semibold text-success">
                ₹{hr.paidAmount.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className="text-lg font-semibold text-warning">
                ₹{(hr.salary - hr.paidAmount).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <Label>Payment History</Label>
          {hr.payments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{payment.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.date}
                    </p>
                    <p className="text-sm">{payment.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{payment.amount.toLocaleString()}
                    </p>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="attendance" className="space-y-4">
        <div className="space-y-3">
          <Label>Monthly Attendance</Label>
          {hr.attendance.map((record, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{record.month}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-success">
                      Present: {record.present}
                    </span>
                    <span className="text-warning">
                      Leave: {record.leave}
                    </span>
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
          
          <TasksDashboard userId={hr.id} />
        </TabsContent>
      </Tabs>
    </DialogContent>
  ));

HRDetailsDialog.displayName = "HRDetailsDialog";

export default HRDetailsDialog; 