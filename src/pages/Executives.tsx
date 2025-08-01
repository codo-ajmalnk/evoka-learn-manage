import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Edit, Trash2, Plus, Search, Filter, Users, Briefcase, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const dummyExecutives: Executive[] = [
  {
    id: "EXE001",
    firstName: "Amit",
    lastName: "Patel",
    email: "amit.patel@evoka.in",
    phone: "+91 9876543212",
    whatsapp: "+91 9876543212",
    dob: "1987-09-10",
    gender: "Male",
    bloodGroup: "B+",
    religion: "Hindu",
    address: "789 Commercial Street, Bangalore",
    pin: "560009",
    qualification: "MBA Marketing",
    experience: "10 years",
    department: "Student Affairs",
    designation: "Senior Executive",
    salary: 65000,
    paidAmount: 65000,
    status: "active",
    joiningDate: "2019-06-01",
    accountDetails: {
      bankName: "ICICI Bank",
      accountNumber: "40100123456789",
      ifsc: "ICIC0001234"
    },
    documents: {
      cv: "amit_cv.pdf",
      pan: "amit_pan.pdf",
      aadhar: "amit_aadhar.pdf"
    },
    attendance: [
      { month: "November 2024", present: 23, leave: 2 },
      { month: "October 2024", present: 25, leave: 1 }
    ],
    payments: [
      {
        id: "PAY003",
        category: "Monthly Salary",
        date: "2024-11-01",
        amount: 65000,
        paid: 65000,
        status: "approved",
        description: "November salary"
      }
    ]
  },
  {
    id: "EXE002",
    firstName: "Sneha",
    lastName: "Reddy",
    email: "sneha.reddy@evoka.in",
    phone: "+91 9876543213",
    whatsapp: "+91 9876543213",
    dob: "1991-12-05",
    gender: "Female",
    bloodGroup: "A-",
    address: "321 Indiranagar, Bangalore",
    pin: "560038",
    qualification: "M.Com",
    experience: "6 years",
    department: "Administration",
    designation: "Executive",
    salary: 55000,
    paidAmount: 55000,
    status: "active",
    joiningDate: "2020-08-15",
    accountDetails: {
      bankName: "Axis Bank",
      accountNumber: "60100123456789",
      ifsc: "UTIB0001234"
    },
    documents: {
      cv: "sneha_cv.pdf",
      pan: "sneha_pan.pdf"
    },
    attendance: [
      { month: "November 2024", present: 24, leave: 1 },
      { month: "October 2024", present: 26, leave: 0 }
    ],
    payments: [
      {
        id: "PAY004",
        category: "Monthly Salary",
        date: "2024-11-01",
        amount: 55000,
        paid: 55000,
        status: "approved",
        description: "November salary"
      }
    ]
  }
];

const Executives = () => {
  const [executives, setExecutives] = useState<Executive[]>(dummyExecutives);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null);
  const { toast } = useToast();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role || "admin";

  const filteredExecutives = executives.filter(executive => {
    const matchesSearch = `${executive.firstName} ${executive.lastName} ${executive.email} ${executive.id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && executive.status === "active";
    if (activeTab === "inactive") return matchesSearch && executive.status === "inactive";
    if (activeTab === "my" && userRole === "manager") return matchesSearch && executive.status === "active";
    
    return matchesSearch;
  });

  const handleDelete = (id: string) => {
    setExecutives(executives.filter(executive => executive.id !== id));
    toast({
      title: "Executive Deleted",
      description: "Executive has been successfully deleted.",
    });
  };

  const ExecutiveDetailsDialog = ({ executive }: { executive: Executive }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={executive.photo} />
            <AvatarFallback>{executive.firstName[0]}{executive.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{executive.firstName} {executive.lastName}</h3>
            <p className="text-sm text-muted-foreground">{executive.id} • {executive.designation}</p>
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
              <p className="text-sm">{executive.address}, {executive.pin}</p>
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
              <p className="text-sm"><strong>Bank:</strong> {executive.accountDetails.bankName}</p>
              <p className="text-sm"><strong>Account:</strong> {executive.accountDetails.accountNumber}</p>
              <p className="text-sm"><strong>IFSC:</strong> {executive.accountDetails.ifsc}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Documents</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(executive.documents).map(([key, value]) => (
                value && (
                  <Badge key={key} variant="outline" className="justify-center">
                    {key.toUpperCase()}
                  </Badge>
                )
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">Total Salary</p>
                <p className="text-lg font-semibold">₹{executive.salary.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-lg font-semibold text-success">₹{executive.paidAmount.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-lg font-semibold text-warning">₹{(executive.salary - executive.paidAmount).toLocaleString()}</p>
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
            {executive.attendance.map((record, index) => (
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

  const getTabsForRole = () => {
    switch (userRole) {
      case "admin":
      case "hr":
        return [
          { key: "all", label: `All Executives (${executives.length})` },
          { key: "active", label: `Active (${executives.filter(e => e.status === "active").length})` },
          { key: "inactive", label: `Inactive (${executives.filter(e => e.status === "inactive").length})` }
        ];
      case "manager":
        return [
          { key: "all", label: `All Executives (${executives.length})` },
          { key: "my", label: `My Executives (${executives.filter(e => e.status === "active").length})` },
          { key: "inactive", label: `Inactive (${executives.filter(e => e.status === "inactive").length})` }
        ];
      default:
        return [
          { key: "all", label: `All Executives (${executives.length})` }
        ];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Executives Management</h1>
          <p className="text-muted-foreground">Manage executive profiles and information</p>
        </div>
        {(userRole === "admin" || userRole === "hr" || userRole === "manager") && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Executive
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
                <p className="text-sm text-muted-foreground">Total Executives</p>
                <p className="text-xl font-semibold">{executives.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Briefcase className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-semibold">{executives.filter(e => e.status === "active").length}</p>
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
                <p className="text-xl font-semibold">1</p>
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
                <p className="text-xl font-semibold">₹60K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Executives List</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search executives..."
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
            {getTabsForRole().map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Executive</th>
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Contact</th>
                  <th className="text-left p-2">Department</th>
                  <th className="text-left p-2">Salary</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExecutives.map((executive) => (
                  <tr key={executive.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={executive.photo} />
                          <AvatarFallback>{executive.firstName[0]}{executive.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{executive.firstName} {executive.lastName}</p>
                          <p className="text-sm text-muted-foreground">{executive.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{executive.id}</Badge>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="text-sm">{executive.phone}</p>
                        <p className="text-sm text-muted-foreground">{executive.email}</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="secondary">{executive.department}</Badge>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="font-medium">₹{executive.salary.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Monthly</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant={executive.status === "active" ? "success" : "secondary"}>
                        {executive.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedExecutive(executive)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {selectedExecutive && <ExecutiveDetailsDialog executive={selectedExecutive} />}
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {(userRole === "admin" || userRole === "hr" || userRole === "manager") && (
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(executive.id)}>
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

          {filteredExecutives.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No executives found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Executives;