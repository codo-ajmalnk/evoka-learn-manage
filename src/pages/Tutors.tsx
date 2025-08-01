import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Edit, Trash2, Plus, Search, Filter, Users, GraduationCap, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const dummyTutors: Tutor[] = [
  {
    id: "TUT001",
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@evoka.in",
    phone: "+91 9876543210",
    whatsapp: "+91 9876543210",
    dob: "1985-06-15",
    gender: "Male",
    bloodGroup: "O+",
    religion: "Hindu",
    address: "123 MG Road, Bangalore",
    pin: "560001",
    qualification: "M.A. in Advertising",
    experience: "8 years",
    subjects: ["Creative Writing", "Brand Strategy"],
    batches: ["ADV001", "ADV002"],
    salary: 50000,
    paidAmount: 45000,
    status: "active",
    joiningDate: "2020-01-15",
    accountDetails: {
      bankName: "HDFC Bank",
      accountNumber: "50100123456789",
      ifsc: "HDFC0001234"
    },
    documents: {
      cv: "rajesh_cv.pdf",
      pan: "rajesh_pan.pdf",
      aadhar: "rajesh_aadhar.pdf"
    },
    attendance: [
      { month: "November 2024", present: 22, leave: 3 },
      { month: "October 2024", present: 24, leave: 2 }
    ],
    payments: [
      {
        id: "PAY001",
        category: "Monthly Salary",
        date: "2024-11-01",
        amount: 50000,
        paid: 50000,
        status: "approved",
        description: "November salary"
      }
    ]
  },
  {
    id: "TUT002",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@evoka.in",
    phone: "+91 9876543211",
    whatsapp: "+91 9876543211",
    dob: "1990-03-22",
    gender: "Female",
    bloodGroup: "A+",
    address: "456 Brigade Road, Bangalore",
    pin: "560025",
    qualification: "M.Des Visual Communication",
    experience: "5 years",
    subjects: ["Graphic Design", "UI/UX Design"],
    batches: ["DES001", "DES002"],
    salary: 45000,
    paidAmount: 45000,
    status: "active",
    joiningDate: "2021-03-01",
    accountDetails: {
      bankName: "SBI",
      accountNumber: "30123456789",
      ifsc: "SBIN0001234"
    },
    documents: {
      cv: "priya_cv.pdf",
      pan: "priya_pan.pdf"
    },
    attendance: [
      { month: "November 2024", present: 25, leave: 0 },
      { month: "October 2024", present: 23, leave: 3 }
    ],
    payments: [
      {
        id: "PAY002",
        category: "Monthly Salary",
        date: "2024-11-01",
        amount: 45000,
        paid: 45000,
        status: "approved",
        description: "November salary"
      }
    ]
  }
];

const Tutors = () => {
  const [tutors, setTutors] = useState<Tutor[]>(dummyTutors);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const { toast } = useToast();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role || "admin";

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = `${tutor.firstName} ${tutor.lastName} ${tutor.email} ${tutor.id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && tutor.status === "active";
    if (activeTab === "inactive") return matchesSearch && tutor.status === "inactive";
    
    return matchesSearch;
  });

  const handleDelete = (id: string) => {
    setTutors(tutors.filter(tutor => tutor.id !== id));
    toast({
      title: "Tutor Deleted",
      description: "Tutor has been successfully deleted.",
    });
  };

  const TutorDetailsDialog = ({ tutor }: { tutor: Tutor }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={tutor.photo} />
            <AvatarFallback>{tutor.firstName[0]}{tutor.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{tutor.firstName} {tutor.lastName}</h3>
            <p className="text-sm text-muted-foreground">{tutor.id}</p>
          </div>
        </DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="batch">Batches</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
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
              <p className="text-sm">{tutor.address}, {tutor.pin}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
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
                  <Badge key={index} variant="secondary">{subject}</Badge>
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
              <p className="text-sm"><strong>Bank:</strong> {tutor.accountDetails.bankName}</p>
              <p className="text-sm"><strong>Account:</strong> {tutor.accountDetails.accountNumber}</p>
              <p className="text-sm"><strong>IFSC:</strong> {tutor.accountDetails.ifsc}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Documents</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(tutor.documents).map(([key, value]) => (
                value && (
                  <Badge key={key} variant="outline" className="justify-center">
                    {key.toUpperCase()}
                  </Badge>
                )
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="batch" className="space-y-4">
          <div className="space-y-2">
            <Label>Assigned Batches</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tutor.batches.map((batch, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{batch}</p>
                        <p className="text-sm text-muted-foreground">Active Batch</p>
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
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">Total Salary</p>
                <p className="text-lg font-semibold">₹{tutor.salary.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-lg font-semibold text-success">₹{tutor.paidAmount.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-lg font-semibold text-warning">₹{(tutor.salary - tutor.paidAmount).toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <Label>Payment History</Label>
            {tutor.payments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{payment.category}</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                      <p className="text-sm">{payment.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{payment.amount.toLocaleString()}</p>
                      <Badge variant={payment.status === "approved" ? "success" : payment.status === "rejected" ? "destructive" : "warning"}>
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
            {tutor.attendance.map((record, index) => (
              <Card key={index}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{record.month}</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-success">Present: {record.present}</span>
                      <span className="text-warning">Leave: {record.leave}</span>
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tutors Management</h1>
          <p className="text-muted-foreground">Manage tutor profiles and information</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Tutor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tutors</p>
                <p className="text-xl font-semibold">{tutors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <GraduationCap className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Tutors</p>
                <p className="text-xl font-semibold">{tutors.filter(t => t.status === "active").length}</p>
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
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-xl font-semibold">2</p>
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
                <p className="text-xl font-semibold">₹47.5K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Tutors List</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tutors..."
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
              All Tutors ({tutors.length})
            </Button>
            <Button
              variant={activeTab === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("active")}
            >
              Active ({tutors.filter(t => t.status === "active").length})
            </Button>
            <Button
              variant={activeTab === "inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("inactive")}
            >
              Inactive ({tutors.filter(t => t.status === "inactive").length})
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tutor</th>
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Contact</th>
                  <th className="text-left p-2">Subjects</th>
                  <th className="text-left p-2">Salary</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTutors.map((tutor) => (
                  <tr key={tutor.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={tutor.photo} />
                          <AvatarFallback>{tutor.firstName[0]}{tutor.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{tutor.firstName} {tutor.lastName}</p>
                          <p className="text-sm text-muted-foreground">{tutor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{tutor.id}</Badge>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="text-sm">{tutor.phone}</p>
                        <p className="text-sm text-muted-foreground">{tutor.whatsapp}</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects.slice(0, 2).map((subject, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">{subject}</Badge>
                        ))}
                        {tutor.subjects.length > 2 && <span className="text-xs text-muted-foreground">+{tutor.subjects.length - 2}</span>}
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="font-medium">₹{tutor.salary.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Monthly</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant={tutor.status === "active" ? "success" : "secondary"}>
                        {tutor.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTutor(tutor)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {selectedTutor && <TutorDetailsDialog tutor={selectedTutor} />}
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(tutor.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTutors.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tutors found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Tutors;