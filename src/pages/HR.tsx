import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  DollarSign,
  Edit,
  Eye,
  Filter,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";

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

const dummyHRPersons: HRPerson[] = [
  {
    id: "HR001",
    firstName: "Deepa",
    lastName: "Singh",
    email: "deepa.singh@evoka.in",
    phone: "+91 9876543216",
    whatsapp: "+91 9876543216",
    dob: "1985-07-12",
    gender: "Female",
    bloodGroup: "B+",
    religion: "Hindu",
    address: "789 HSR Layout, Bangalore",
    pin: "560102",
    qualification: "MBA HR",
    experience: "12 years",
    specialization: "Talent Acquisition",
    designation: "Senior HR Executive",
    salary: 70000,
    paidAmount: 70000,
    status: "active",
    joiningDate: "2020-02-01",
    accountDetails: {
      bankName: "ICICI Bank",
      accountNumber: "40100555666777",
      ifsc: "ICIC0001236",
    },
    documents: {
      cv: "deepa_cv.pdf",
      pan: "deepa_pan.pdf",
      aadhar: "deepa_aadhar.pdf",
      certificates: ["hr_certification.pdf", "mba_degree.pdf"],
    },
    attendance: [
      { month: "November 2025", present: 25, leave: 0 },
      { month: "October 2025", present: 24, leave: 2 },
    ],
    payments: [
      {
        id: "PAY007",
        category: "Monthly Salary",
        date: "2025-11-01",
        amount: 70000,
        paid: 70000,
        status: "approved",
        description: "November salary",
      },
    ],
  },
  {
    id: "HR002",
    firstName: "Ravi",
    lastName: "Kumar",
    email: "ravi.kumar@evoka.in",
    phone: "+91 9876543217",
    whatsapp: "+91 9876543217",
    dob: "1988-02-28",
    gender: "Male",
    bloodGroup: "O-",
    address: "234 Electronic City, Bangalore",
    pin: "560100",
    qualification: "M.A. Psychology",
    experience: "8 years",
    specialization: "Employee Relations",
    designation: "HR Executive",
    salary: 60000,
    paidAmount: 60000,
    status: "active",
    joiningDate: "2021-05-10",
    accountDetails: {
      bankName: "SBI",
      accountNumber: "30100555666777",
      ifsc: "SBIN0001236",
    },
    documents: {
      cv: "ravi_cv.pdf",
      pan: "ravi_pan.pdf",
      aadhar: "ravi_aadhar.pdf",
    },
    attendance: [
      { month: "November 2025", present: 23, leave: 2 },
      { month: "October 2025", present: 26, leave: 0 },
    ],
    payments: [
      {
        id: "PAY008",
        category: "Monthly Salary",
        date: "2025-11-01",
        amount: 60000,
        paid: 60000,
        status: "approved",
        description: "November salary",
      },
    ],
  },
];

const HR = () => {
  const [hrPersons, setHRPersons] = useState<HRPerson[]>(dummyHRPersons);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedHR, setSelectedHR] = useState<HRPerson | null>(null);
  const { toast } = useToast();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role || "admin";

  const filteredHRPersons = hrPersons.filter((hr) => {
    const matchesSearch = `${hr.firstName} ${hr.lastName} ${hr.email} ${hr.id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && hr.status === "active";
    if (activeTab === "inactive")
      return matchesSearch && hr.status === "inactive";

    return matchesSearch;
  });

  const handleEdit = (hr: HRPerson) => {
    toast({
      title: "Edit HR Personnel",
      description: `Editing ${hr.firstName} ${hr.lastName}`,
    });
  };

  const handleDelete = (id: string) => {
    setHRPersons(hrPersons.filter((hr) => hr.id !== id));
    toast({
      title: "HR Personnel Deleted",
      description: "HR personnel has been successfully deleted.",
    });
  };

  const HRDetailsDialog = ({ hr }: { hr: HRPerson }) => (
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
      </Tabs>
    </DialogContent>
  );

  // Only admin and manager can access HR page
  if (userRole !== "admin" && userRole !== "manager") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">HR Management</h1>
          <p className="text-muted-foreground">
            Manage HR personnel and information
          </p>
        </div>
        {userRole === "admin" && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New HR
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total HR</p>
                <p className="text-xl font-semibold">{hrPersons.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-semibold">
                  {hrPersons.filter((hr) => hr.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="text-xl font-semibold">10+ Yrs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Salary</p>
                <p className="text-xl font-semibold">₹65K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>HR Personnel List</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search HR personnel..."
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
        </CardHeader>

        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("all")}
            >
              All HR ({hrPersons.length})
            </Button>
            <Button
              variant={activeTab === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("active")}
            >
              Active ({hrPersons.filter((hr) => hr.status === "active").length})
            </Button>
            <Button
              variant={activeTab === "inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("inactive")}
            >
              Inactive (
              {hrPersons.filter((hr) => hr.status === "inactive").length})
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">HR Personnel</th>
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Contact</th>
                  <th className="text-left p-2">Specialization</th>
                  <th className="text-left p-2">Experience</th>
                  <th className="text-left p-2">Salary</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHRPersons.map((hr) => (
                  <tr key={hr.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={hr.photo} />
                          <AvatarFallback>
                            {hr.firstName[0]}
                            {hr.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {hr.firstName} {hr.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {hr.designation}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{hr.id}</Badge>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="text-sm">{hr.phone}</p>
                        <p className="text-sm text-muted-foreground">
                          {hr.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="secondary">{hr.specialization}</Badge>
                    </td>
                    <td className="p-2">
                      <span className="text-sm">{hr.experience}</span>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="font-medium">
                          ₹{hr.salary.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Monthly</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge
                        variant={
                          hr.status === "active" ? "success" : "secondary"
                        }
                      >
                        {hr.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedHR(hr)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {selectedHR && <HRDetailsDialog hr={selectedHR} />}
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(hr)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {userRole === "admin" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(hr.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredHRPersons.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No HR personnel found matching your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HR;
