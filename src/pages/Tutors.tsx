import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, Edit, Trash2, Plus, Search, Filter, Users, GraduationCap, Calendar, DollarSign, Upload, Download, UserX, Clock, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

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

const availableBatches = [
  { id: "ADV001", name: "Advanced Digital Marketing", status: "active" },
  { id: "ADV002", name: "Brand Strategy Masterclass", status: "active" },
  { id: "DES001", name: "UI/UX Design Fundamentals", status: "active" },
  { id: "DES002", name: "Graphic Design Pro", status: "active" },
  { id: "DEV001", name: "Full Stack Development", status: "active" },
  { id: "DEV002", name: "React Advanced", status: "active" }
];

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
      { id: "ATT001", month: "November", year: "2024", present: 22, leave: 3, overtime: 5 },
      { id: "ATT002", month: "October", year: "2024", present: 24, leave: 2, overtime: 3 }
    ],
    payments: [
      {
        id: "PAY001",
        category: "Monthly Salary",
        date: "2024-11-01",
        amount: 50000,
        paid: 50000,
        status: "approved",
        description: "November salary",
        screenshot: "salary_nov.jpg"
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
      { id: "ATT003", month: "November", year: "2024", present: 25, leave: 0, overtime: 2 },
      { id: "ATT004", month: "October", year: "2024", present: 23, leave: 3, overtime: 0 }
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<"personal" | "payment" | "attendance" | "batch" | null>(null);
  const { toast } = useToast();
  const form = useForm();

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

  const handleAddTutor = (data: any) => {
    const newTutor: Tutor = {
      id: `TUT${String(tutors.length + 1).padStart(3, '0')}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      dob: data.dob,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      religion: data.religion,
      address: data.address,
      pin: data.pin,
      qualification: data.qualification,
      experience: data.experience,
      subjects: data.subjects?.split(',') || [],
      batches: [],
      salary: parseInt(data.salary) || 0,
      paidAmount: 0,
      status: "active",
      joiningDate: new Date().toISOString().split('T')[0],
      accountDetails: {
        bankName: data.bankName || "",
        accountNumber: data.accountNumber || "",
        ifsc: data.ifsc || ""
      },
      documents: {},
      attendance: [],
      payments: []
    };

    setTutors([...tutors, newTutor]);
    setIsAddDialogOpen(false);
    toast({
      title: "Tutor Added",
      description: `${newTutor.firstName} ${newTutor.lastName} has been added successfully.`,
    });
  };

  const handleEdit = (tutor: Tutor, type: "personal" | "payment" | "attendance" | "batch", item?: any) => {
    setSelectedTutor(tutor);
    setEditingType(type);
    setEditingItem(item);
  };

  const handleDelete = (tutorId: string, type?: "payment" | "attendance", itemId?: string) => {
    if (type && itemId && selectedTutor) {
      const updatedTutors = tutors.map(tutor => {
        if (tutor.id === tutorId) {
          if (type === "payment") {
            return { ...tutor, payments: tutor.payments.filter(p => p.id !== itemId) };
          } else if (type === "attendance") {
            return { ...tutor, attendance: tutor.attendance.filter(a => a.id !== itemId) };
          }
        }
        return tutor;
      });
      setTutors(updatedTutors);
      setSelectedTutor(updatedTutors.find(t => t.id === tutorId) || null);
      toast({
        title: `${type} Deleted`,
        description: `${type} record has been deleted successfully.`,
      });
    } else {
      setTutors(tutors.filter(tutor => tutor.id !== tutorId));
      toast({
        title: "Tutor Deleted",
        description: "Tutor has been successfully deleted.",
      });
    }
  };

  const handleStatusToggle = (tutorId: string) => {
    const updatedTutors = tutors.map(tutor => 
      tutor.id === tutorId 
        ? { ...tutor, status: tutor.status === "active" ? "inactive" : "active" as "active" | "inactive" }
        : tutor
    );
    setTutors(updatedTutors);
    const tutor = updatedTutors.find(t => t.id === tutorId);
    toast({
      title: "Status Updated",
      description: `Tutor status changed to ${tutor?.status}.`,
    });
  };

  const AddNewTutorDialog = () => (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Tutor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Tutor</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleAddTutor)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name*</Label>
              <Input {...form.register("firstName", { required: true })} placeholder="Enter first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name*</Label>
              <Input {...form.register("lastName", { required: true })} placeholder="Enter last name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input {...form.register("email", { required: true })} type="email" placeholder="Enter email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone*</Label>
              <Input {...form.register("phone", { required: true })} placeholder="Enter phone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input {...form.register("dob")} type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => form.setValue("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input {...form.register("qualification")} placeholder="Enter qualification" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input {...form.register("experience")} placeholder="e.g., 5 years" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjects">Subjects (comma separated)</Label>
              <Input {...form.register("subjects")} placeholder="e.g., Math, Physics" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Monthly Salary</Label>
              <Input {...form.register("salary")} type="number" placeholder="Enter salary amount" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea {...form.register("address")} placeholder="Enter complete address" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Tutor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  const TutorDetailsDialog = ({ tutor }: { tutor: Tutor }) => (
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={tutor.photo} />
              <AvatarFallback>{tutor.firstName[0]}{tutor.lastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{tutor.firstName} {tutor.lastName}</h3>
              <p className="text-sm text-muted-foreground">{tutor.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(tutor, "personal")}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDelete(tutor.id)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button 
              variant={tutor.status === "active" ? "destructive" : "success"} 
              size="sm" 
              onClick={() => handleStatusToggle(tutor.id)}
            >
              <UserX className="h-4 w-4 mr-1" />
              {tutor.status === "active" ? "Deactivate" : "Activate"}
            </Button>
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(tutor, "personal")}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(tutor.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button 
                variant={tutor.status === "active" ? "destructive" : "success"} 
                size="sm" 
                onClick={() => handleStatusToggle(tutor.id)}
              >
                <UserX className="h-4 w-4 mr-1" />
                {tutor.status === "active" ? "Inactive" : "Active"}
              </Button>
            </div>
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
              <p className="text-sm">{tutor.address}, {tutor.pin}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Professional Information</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(tutor, "personal")}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(tutor.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button 
                variant={tutor.status === "active" ? "destructive" : "success"} 
                size="sm" 
                onClick={() => handleStatusToggle(tutor.id)}
              >
                <UserX className="h-4 w-4 mr-1" />
                {tutor.status === "active" ? "Inactive" : "Active"}
              </Button>
            </div>
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Batch Assignment</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(tutor, "batch")}>
                <Plus className="h-4 w-4 mr-1" />
                Assign Batch
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(tutor, "batch")}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(tutor.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button 
                variant={tutor.status === "active" ? "destructive" : "success"} 
                size="sm" 
                onClick={() => handleStatusToggle(tutor.id)}
              >
                <UserX className="h-4 w-4 mr-1" />
                {tutor.status === "active" ? "Inactive" : "Active"}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Batches</p>
                    <p className="text-lg font-semibold">{tutor.batches.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active Batches</p>
                    <p className="text-lg font-semibold">{tutor.batches.length}</p>
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
              {tutor.batches.map((batchId, index) => {
                const batchInfo = availableBatches.find(b => b.id === batchId);
                return (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{batchInfo?.name || batchId}</p>
                          <p className="text-sm text-muted-foreground">Batch ID: {batchId}</p>
                        </div>
                        <Badge variant="success">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="mt-4">
              <Label>Available Batches</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {availableBatches
                  .filter(batch => !tutor.batches.includes(batch.id))
                  .map((batch) => (
                    <Card key={batch.id} className="border-dashed">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{batch.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {batch.id}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const updatedTutors = tutors.map(t => 
                                t.id === tutor.id 
                                  ? { ...t, batches: [...t.batches, batch.id] }
                                  : t
                              );
                              setTutors(updatedTutors);
                              setSelectedTutor(updatedTutors.find(t => t.id === tutor.id) || null);
                              toast({
                                title: "Batch Assigned",
                                description: `${batch.name} assigned to tutor.`,
                              });
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Payment Management</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(tutor, "payment")}>
                <Plus className="h-4 w-4 mr-1" />
                Add Payment
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(tutor, "payment")}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(tutor.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button 
                variant={tutor.status === "active" ? "destructive" : "success"} 
                size="sm" 
                onClick={() => handleStatusToggle(tutor.id)}
              >
                <UserX className="h-4 w-4 mr-1" />
                {tutor.status === "active" ? "Inactive" : "Active"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm opacity-90">Total Salary</p>
                <p className="text-xl font-bold">₹{tutor.salary.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm opacity-90">Paid Amount</p>
                <p className="text-xl font-bold">₹{tutor.paidAmount.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm opacity-90">Balance Due</p>
                <p className="text-xl font-bold">₹{(tutor.salary - tutor.paidAmount).toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm opacity-90">Payment %</p>
                <p className="text-xl font-bold">{Math.round((tutor.paidAmount / tutor.salary) * 100)}%</p>
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
                        <Badge variant={payment.status === "approved" ? "success" : payment.status === "rejected" ? "destructive" : "warning"}>
                          {payment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Date: {payment.date}</p>
                      <p className="text-sm">{payment.description}</p>
                      {payment.screenshot && (
                        <Badge variant="outline" className="mt-2">
                          <Upload className="h-3 w-3 mr-1" />
                          Screenshot Available
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">₹{payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Paid: ₹{payment.paid.toLocaleString()}</p>
                      <div className="flex gap-1 mt-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(tutor, "payment", payment)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(tutor.id, "payment", payment.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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
              <Button variant="outline" size="sm" onClick={() => handleEdit(tutor, "attendance")}>
                <Plus className="h-4 w-4 mr-1" />
                Add Record
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(tutor, "attendance")}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDelete(tutor.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button 
                variant={tutor.status === "active" ? "destructive" : "success"} 
                size="sm" 
                onClick={() => handleStatusToggle(tutor.id)}
              >
                <UserX className="h-4 w-4 mr-1" />
                {tutor.status === "active" ? "Inactive" : "Active"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Total Present</p>
                <p className="text-xl font-semibold text-success">
                  {tutor.attendance.reduce((sum, record) => sum + record.present, 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-warning" />
                <p className="text-sm text-muted-foreground">Total Leave</p>
                <p className="text-xl font-semibold text-warning">
                  {tutor.attendance.reduce((sum, record) => sum + record.leave, 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-info" />
                <p className="text-sm text-muted-foreground">Overtime</p>
                <p className="text-xl font-semibold text-info">
                  {tutor.attendance.reduce((sum, record) => sum + record.overtime, 0)}
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
                        (tutor.attendance.reduce((sum, record) => sum + record.present, 0) / 
                         tutor.attendance.reduce((sum, record) => sum + record.present + record.leave, 0)) * 100
                      )
                    : 0}%
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
                      <h4 className="font-medium">{record.month} {record.year}</h4>
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
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(tutor, "attendance", record)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(tutor.id, "attendance", record.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
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
        <AddNewTutorDialog />
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
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(tutor, "personal")}>
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