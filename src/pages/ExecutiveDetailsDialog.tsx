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

interface ExecutiveDetailsDialogProps {
  executive: Executive;
}

const ExecutiveDetailsDialog = memo(({ executive }: ExecutiveDetailsDialogProps) => {
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={executive.photo} />
            <AvatarFallback>
              {executive.firstName[0]}
              {executive.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">
              {executive.firstName} {executive.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {executive.id} • {executive.designation}
            </p>
          </div>
        </DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm">{executive.email}</p>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <p className="text-sm">{executive.phone}</p>
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <p className="text-sm">{executive.dob}</p>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <p className="text-sm">{executive.gender}</p>
            </div>
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <p className="text-sm">{executive.bloodGroup}</p>
            </div>
            <div className="space-y-2">
              <Label>Religion</Label>
              <p className="text-sm">{executive.religion || "Not specified"}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Address</Label>
              <p className="text-sm">
                {executive.address}, {executive.pin}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <p className="text-sm">{executive.department}</p>
            </div>
            <div className="space-y-2">
              <Label>Designation</Label>
              <p className="text-sm">{executive.designation}</p>
            </div>
            <div className="space-y-2">
              <Label>Qualification</Label>
              <p className="text-sm">{executive.qualification}</p>
            </div>
            <div className="space-y-2">
              <Label>Experience</Label>
              <p className="text-sm">{executive.experience}</p>
            </div>
            <div className="space-y-2">
              <Label>Joining Date</Label>
              <p className="text-sm">{executive.joiningDate}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Account Details</Label>
            <div className="bg-muted p-3 rounded">
              <p className="text-sm">
                <strong>Bank:</strong> {executive.accountDetails.bankName}
              </p>
              <p className="text-sm">
                <strong>Account:</strong>{" "}
                {executive.accountDetails.accountNumber}
              </p>
              <p className="text-sm">
                <strong>IFSC:</strong> {executive.accountDetails.ifsc}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Documents</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(executive.documents).map(
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
                  ₹{executive.salary.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-lg font-semibold text-success">
                  ₹{executive.paidAmount.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-lg font-semibold text-warning">
                  ₹{(executive.salary - executive.paidAmount).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <Label>Payment History</Label>
            {executive.payments.map((payment) => (
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
            {executive.attendance.map((record, index) => (
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
      </Tabs>
    </DialogContent>
  );
});

ExecutiveDetailsDialog.displayName = "ExecutiveDetailsDialog";

export default ExecutiveDetailsDialog; 