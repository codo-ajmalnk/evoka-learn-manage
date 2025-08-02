import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Filter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";

// Dummy student data
const dummyStudents = [
  {
    id: "STU001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+91 9876543210",
    whatsapp: "+91 9876543210",
    address: "123 Main St, Mumbai, MH 400001",
    dob: "1998-05-15",
    gender: "Male",
    bloodGroup: "O+",
    qualification: "Bachelor's in Arts",
    percentage: 78.5,
    fatherName: "Robert Doe",
    motherName: "Mary Doe",
    batch: "Batch A - 2025",
    status: "Active",
    joinDate: "2025-01-15",
    totalFees: 50000,
    paidFees: 35000,
    pendingFees: 15000,
    attendanceRate: 94,
    assignments: 12,
    pendingAssignments: 2,
  },
  {
    id: "STU002",
    firstName: "Sarah",
    lastName: "Wilson",
    email: "sarah.wilson@email.com",
    phone: "+91 9876543211",
    whatsapp: "+91 9876543211",
    address: "456 Oak Ave, Delhi, DL 110001",
    dob: "1999-08-22",
    gender: "Female",
    bloodGroup: "A+",
    qualification: "Bachelor's in Commerce",
    percentage: 85.2,
    fatherName: "David Wilson",
    motherName: "Lisa Wilson",
    batch: "Batch B - 2025",
    status: "Active",
    joinDate: "2025-02-01",
    totalFees: 50000,
    paidFees: 50000,
    pendingFees: 0,
    attendanceRate: 97,
    assignments: 15,
    pendingAssignments: 1,
  },
  {
    id: "STU003",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@email.com",
    phone: "+91 9876543212",
    whatsapp: "+91 9876543212",
    address: "789 Pine St, Bangalore, KA 560001",
    dob: "1997-12-10",
    gender: "Male",
    bloodGroup: "B+",
    qualification: "Bachelor's in Science",
    percentage: 82.1,
    fatherName: "James Johnson",
    motherName: "Emma Johnson",
    batch: "Batch A - 2025",
    status: "Inactive",
    joinDate: "2023-11-15",
    totalFees: 50000,
    paidFees: 25000,
    pendingFees: 25000,
    attendanceRate: 76,
    assignments: 18,
    pendingAssignments: 5,
  },
];

const Students = () => {
  const [students, setStudents] = useState(dummyStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      `${student.firstName} ${student.lastName} ${student.email} ${student.id}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && student.status === "Active") ||
      (activeTab === "inactive" && student.status === "Inactive");

    return matchesSearch && matchesTab;
  });

  const handleEdit = (student: any) => {
    toast({
      title: "Edit Student",
      description: `Editing ${student.firstName} ${student.lastName}`,
    });
  };

  const handleDelete = (id: string) => {
    setStudents(students.filter((student) => student.id !== id));
    toast({
      title: "Student Deleted",
      description: "Student has been successfully deleted.",
    });
  };

  const StudentDetailsDialog = ({ student }: { student: any }) => (
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            Manage student information and records
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Create a new student profile
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter first name" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter last name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter address" />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Create Student</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Student List</CardTitle>
              <CardDescription>View and manage all students</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList>
              <TabsTrigger value="all">
                All Students ({students.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({students.filter((s) => s.status === "Active").length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive (
                {students.filter((s) => s.status === "Inactive").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Fees Status</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {student.firstName.charAt(0)}
                            {student.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{student.id}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{student.phone}</p>
                        <p className="text-xs text-muted-foreground">
                          WhatsApp: {student.whatsapp}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{student.batch}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">
                          ₹{student.paidFees.toLocaleString()} / ₹
                          {student.totalFees.toLocaleString()}
                        </p>
                        <div className="w-20 bg-muted rounded-full h-1">
                          <div
                            className="bg-success h-1 rounded-full"
                            style={{
                              width: `${
                                (student.paidFees / student.totalFees) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.attendanceRate > 90
                            ? "default"
                            : student.attendanceRate > 75
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {student.attendanceRate}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {selectedStudent && (
                            <StudentDetailsDialog student={selectedStudent} />
                          )}
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No students found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Students;
