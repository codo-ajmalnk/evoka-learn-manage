import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Edit, Trash2, Plus, Search, Filter, Users, Crown, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Manager {
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
  teamSize: number;
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

const dummyManagers: Manager[] = [
  {
    id: "MGR001",
    firstName: "Suresh",
    lastName: "Nair",
    email: "suresh.nair@evoka.in",
    phone: "+91 9876543214",
    whatsapp: "+91 9876543214",
    dob: "1980-04-20",
    gender: "Male",
    bloodGroup: "O+",
    religion: "Hindu",
    address: "456 Koramangala, Bangalore",
    pin: "560034",
    qualification: "MBA Operations",
    experience: "15 years",
    department: "Operations",
    designation: "Operations Manager",
    salary: 85000,
    paidAmount: 85000,
    status: "active",
    joiningDate: "2018-01-10",
    teamSize: 12,
    accountDetails: {
      bankName: "HDFC Bank",
      accountNumber: "50100987654321",
      ifsc: "HDFC0001235"
    },
    documents: {
      cv: "suresh_cv.pdf",
      pan: "suresh_pan.pdf",
      aadhar: "suresh_aadhar.pdf",
      passbook: "suresh_passbook.pdf"
    },
    attendance: [
      { month: "November 2024", present: 24, leave: 1 },
      { month: "October 2024", present: 26, leave: 0 }
    ],
    payments: [
      {
        id: "PAY005",
        category: "Monthly Salary",
        date: "2024-11-01",
        amount: 85000,
        paid: 85000,
        status: "approved",
        description: "November salary"
      }
    ]
  },
  {
    id: "MGR002",
    firstName: "Kavitha",
    lastName: "Menon",
    email: "kavitha.menon@evoka.in",
    phone: "+91 9876543215",
    whatsapp: "+91 9876543215",
    dob: "1983-11-18",
    gender: "Female",
    bloodGroup: "A+",
    address: "123 JP Nagar, Bangalore",
    pin: "560078",
    qualification: "MBA HR",
    experience: "12 years",
    department: "Human Resources",
    designation: "HR Manager",
    salary: 80000,
    paidAmount: 80000,
    status: "active",
    joiningDate: "2019-03-15",
    teamSize: 8,
    accountDetails: {
      bankName: "SBI",
      accountNumber: "30100987654321",
      ifsc: "SBIN0001235"
    },
    documents: {
      cv: "kavitha_cv.pdf",
      pan: "kavitha_pan.pdf",
      aadhar: "kavitha_aadhar.pdf"
    },
    attendance: [
      { month: "November 2024", present: 25, leave: 0 },
      { month: "October 2024", present: 24, leave: 2 }
    ],
    payments: [
      {
        id: "PAY006",
        category: "Monthly Salary",
        date: "2024-11-01",
        amount: 80000,
        paid: 80000,
        status: "approved",
        description: "November salary"
      }
    ]
  }
];

const Managers = () => {
  const [managers, setManagers] = useState<Manager[]>(dummyManagers);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const { toast } = useToast();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role || "admin";

  const filteredManagers = managers.filter(manager => {
    const matchesSearch = `${manager.firstName} ${manager.lastName} ${manager.email} ${manager.id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && manager.status === "active";
    if (activeTab === "inactive") return matchesSearch && manager.status === "inactive";
    
    return matchesSearch;
  });

  const handleEdit = (manager: Manager) => {
    toast({
      title: "Edit Manager",
      description: `Editing ${manager.firstName} ${manager.lastName}`,
    });
  };

  const handleDelete = (id: string) => {
    setManagers(managers.filter(manager => manager.id !== id));
    toast({
      title: "Manager Deleted",
      description: "Manager has been successfully deleted.",
    });
  };

  const ManagerDetailsDialog = ({ manager }: { manager: Manager }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={manager.photo} />
            <AvatarFallback>{manager.firstName[0]}{manager.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{manager.firstName} {manager.lastName}</h3>
            <p className="text-sm text-muted-foreground">{manager.id} • {manager.designation}</p>
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
              <p className="text-sm">{manager.email}</p>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <p className="text-sm">{manager.phone}</p>
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <p className="text-sm">{manager.dob}</p>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <p className="text-sm">{manager.gender}</p>
            </div>
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <p className="text-sm">{manager.bloodGroup}</p>
            </div>
            <div className="space-y-2">
              <Label>Religion</Label>
              <p className="text-sm">{manager.religion || "Not specified"}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Address</Label>
              <p className="text-sm">{manager.address}, {manager.pin}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <p className="text-sm">{manager.department}</p>
            </div>
            <div className="space-y-2">
              <Label>Designation</Label>
              <p className="text-sm">{manager.designation}</p>
            </div>
            <div className="space-y-2">
              <Label>Team Size</Label>
              <p className="text-sm">{manager.teamSize} members</p>
            </div>
            <div className="space-y-2">
              <Label>Qualification</Label>
              <p className="text-sm">{manager.qualification}</p>
            </div>
            <div className="space-y-2">
              <Label>Experience</Label>
              <p className="text-sm">{manager.experience}</p>
            </div>
            <div className="space-y-2">
              <Label>Joining Date</Label>
              <p className="text-sm">{manager.joiningDate}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Account Details</Label>
            <div className="bg-muted p-3 rounded">
              <p className="text-sm"><strong>Bank:</strong> {manager.accountDetails.bankName}</p>
              <p className="text-sm"><strong>Account:</strong> {manager.accountDetails.accountNumber}</p>
              <p className="text-sm"><strong>IFSC:</strong> {manager.accountDetails.ifsc}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Documents</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(manager.documents).map(([key, value]) => (
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
                <p className="text-lg font-semibold">₹{manager.salary.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-lg font-semibold text-success">₹{manager.paidAmount.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-lg font-semibold text-warning">₹{(manager.salary - manager.paidAmount).toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <Label>Payment History</Label>
            {manager.payments.map((payment) => (
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
            {manager.attendance.map((record, index) => (
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

  // Only admin can access managers page
  if (userRole !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Managers Management</h1>
          <p className="text-muted-foreground">Manage manager profiles and information</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Manager
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
                <p className="text-sm text-muted-foreground">Total Managers</p>
                <p className="text-xl font-semibold">{managers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Crown className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-semibold">{managers.filter(m => m.status === "active").length}</p>
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
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-xl font-semibold">{managers.reduce((sum, m) => sum + m.teamSize, 0)}</p>
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
                <p className="text-xl font-semibold">₹82.5K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Managers List</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search managers..."
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
              All Managers ({managers.length})
            </Button>
            <Button
              variant={activeTab === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("active")}
            >
              Active ({managers.filter(m => m.status === "active").length})
            </Button>
            <Button
              variant={activeTab === "inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("inactive")}
            >
              Inactive ({managers.filter(m => m.status === "inactive").length})
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Manager</th>
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Contact</th>
                  <th className="text-left p-2">Department</th>
                  <th className="text-left p-2">Team Size</th>
                  <th className="text-left p-2">Salary</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredManagers.map((manager) => (
                  <tr key={manager.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={manager.photo} />
                          <AvatarFallback>{manager.firstName[0]}{manager.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{manager.firstName} {manager.lastName}</p>
                          <p className="text-sm text-muted-foreground">{manager.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{manager.id}</Badge>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="text-sm">{manager.phone}</p>
                        <p className="text-sm text-muted-foreground">{manager.email}</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="secondary">{manager.department}</Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="text-sm">{manager.teamSize}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="font-medium">₹{manager.salary.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Monthly</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant={manager.status === "active" ? "success" : "secondary"}>
                        {manager.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedManager(manager)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {selectedManager && <ManagerDetailsDialog manager={selectedManager} />}
                        </Dialog>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(manager)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(manager.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredManagers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No managers found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Managers;