import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { memo } from "react";

interface StudentDetailsDialogProps {
  student: any;
}

const StudentDetailsDialog = memo(({ student }: StudentDetailsDialogProps) => {
  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>
          Student Details - {student.firstName} {student.lastName}
        </DialogTitle>
        <DialogDescription>Student ID: {student.id}</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="assignment">Assignment</TabsTrigger>
          <TabsTrigger value="batch">Batch</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex items-center gap-4 mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-lg">
                    {student.firstName.charAt(0)}
                    {student.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {student.firstName} {student.lastName}
                  </h3>
                  <Badge
                    variant={
                      student.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {student.status}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {student.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {student.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {student.dob}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Gender
                </label>
                <p>{student.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Blood Group
                </label>
                <p>{student.bloodGroup}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Qualification
                </label>
                <p>{student.qualification}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {student.address}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Father's Name
                </label>
                <p>{student.fatherName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Mother's Name
                </label>
                <p>{student.motherName}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    ₹{student.totalFees.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">
                    ₹{student.paidFees.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Paid</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-destructive">
                    ₹{student.pendingFees.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full"
                  style={{
                    width: `${(student.paidFees / student.totalFees) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {Math.round((student.paidFees / student.totalFees) * 100)}%
                Completed
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Assignment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{student.assignments}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Assignments
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">
                    {student.pendingAssignments}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${
                      ((student.assignments - student.pendingAssignments) /
                        student.assignments) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {Math.round(
                  ((student.assignments - student.pendingAssignments) /
                    student.assignments) *
                    100
                )}
                % Completed
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Batch Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Current Batch
                  </label>
                  <p className="text-lg font-medium">{student.batch}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Join Date
                  </label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {student.joinDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Attendance Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-primary">
                  {student.attendanceRate}%
                </p>
                <p className="text-muted-foreground">Overall Attendance Rate</p>
              </div>

              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full"
                  style={{ width: `${student.attendanceRate}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
});

StudentDetailsDialog.displayName = "StudentDetailsDialog";
export default StudentDetailsDialog;