import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Book,
  DollarSign,
  Edit,
  GraduationCap,
  Percent,
  Plus,
  Search,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";

// Type definitions
interface Course {
  id: number;
  name: string;
  code: string;
  duration: string;
  status: string;
}

interface Syllabus {
  id: number;
  name: string;
  code: string;
  courses: string[];
}

interface Batch {
  id: number;
  name: string;
  syllabus: string;
  startDate: string;
  students: number;
}

interface Category {
  id: number;
  type: string;
  name: string;
  description: string;
}

interface Tax {
  id: number;
  name: string;
  rate: number;
  enabled: boolean;
  description: string;
}

interface Coupon {
  id: number;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: string;
}

// Initial data
const initialCourses: Course[] = [
  {
    id: 1,
    name: "Web Development",
    code: "WD001",
    duration: "6 months",
    status: "Active",
  },
  {
    id: 2,
    name: "Digital Marketing",
    code: "DM001",
    duration: "4 months",
    status: "Active",
  },
  {
    id: 3,
    name: "Graphic Design",
    code: "GD001",
    duration: "5 months",
    status: "Active",
  },
];

const initialSyllabi: Syllabus[] = [
  {
    id: 1,
    name: "Full Stack Development",
    code: "FSD001",
    courses: ["Web Development"],
  },
  {
    id: 2,
    name: "Digital Marketing Mastery",
    code: "DMM001",
    courses: ["Digital Marketing"],
  },
  {
    id: 3,
    name: "Creative Design",
    code: "CD001",
    courses: ["Graphic Design"],
  },
];

const initialBatches: Batch[] = [
  {
    id: 1,
    name: "Batch WD-2025-01",
    syllabus: "Full Stack Development",
    startDate: "2025-01-15",
    students: 25,
  },
  {
    id: 2,
    name: "Batch DM-2025-01",
    syllabus: "Digital Marketing Mastery",
    startDate: "2025-02-01",
    students: 20,
  },
  {
    id: 3,
    name: "Batch GD-2025-01",
    syllabus: "Creative Design",
    startDate: "2025-01-20",
    students: 18,
  },
];

const initialCategories: Category[] = [
  {
    id: 1,
    type: "Salary",
    name: "Monthly Salary",
    description: "Regular monthly salary payment",
  },
  {
    id: 2,
    type: "Payment",
    name: "Course Fee",
    description: "Student course fee payment",
  },
  {
    id: 3,
    type: "Leave",
    name: "Sick Leave",
    description: "Medical leave category",
  },
  {
    id: 4,
    type: "Assignment",
    name: "Project Work",
    description: "Project-based assignments",
  },
];

const initialTaxSettings: Tax[] = [
  {
    id: 1,
    name: "GST",
    rate: 18,
    enabled: true,
    description: "Goods and Services Tax",
  },
  {
    id: 2,
    name: "TDS",
    rate: 10,
    enabled: true,
    description: "Tax Deducted at Source",
  },
  {
    id: 3,
    name: "Service Tax",
    rate: 15,
    enabled: false,
    description: "Service Tax",
  },
];

const initialCoupons: Coupon[] = [
  {
    id: 1,
    code: "EARLY2025",
    discount: 20,
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    status: "Active",
  },
  {
    id: 2,
    code: "STUDENT50",
    discount: 50,
    startDate: "2025-02-01",
    endDate: "2025-12-31",
    status: "Active",
  },
  {
    id: 3,
    code: "WINTER25",
    discount: 25,
    startDate: "2025-01-15",
    endDate: "2025-02-29",
    status: "Expired",
  },
];

const Settings = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // State for all data
  const [coursesData, setCoursesData] = useState<Course[]>(initialCourses);
  const [syllabiData, setSyllabiData] = useState<Syllabus[]>(initialSyllabi);
  const [batchesData, setBatchesData] = useState<Batch[]>(initialBatches);
  const [categoriesData, setCategoriesData] =
    useState<Category[]>(initialCategories);
  const [taxData, setTaxData] = useState<Tax[]>(initialTaxSettings);
  const [couponsData, setCouponsData] = useState<Coupon[]>(initialCoupons);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    duration: "",
    description: "",
    type: "",
    rate: "",
    discount: "",
    startDate: "",
    endDate: "",
    syllabus: "",
  });

  const openDialog = (type: string, item?: any) => {
    setDialogType(type);
    setEditingItem(item);
    if (item) {
      setFormData({
        name: item.name || "",
        code: item.code || "",
        duration: item.duration || "",
        description: item.description || "",
        type: item.type || "",
        rate: item.rate?.toString() || "",
        discount: item.discount?.toString() || "",
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        syllabus: item.syllabus || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        duration: "",
        description: "",
        type: "",
        rate: "",
        discount: "",
        startDate: "",
        endDate: "",
        syllabus: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newId = editingItem ? editingItem.id : Date.now();

    switch (dialogType) {
      case "course":
        const courseItem: Course = {
          id: newId,
          name: formData.name,
          code: formData.code,
          duration: formData.duration,
          status: editingItem ? editingItem.status : "Active",
        };
        if (editingItem) {
          setCoursesData((prev) =>
            prev.map((item) => (item.id === editingItem.id ? courseItem : item))
          );
        } else {
          setCoursesData((prev) => [...prev, courseItem]);
        }
        break;

      case "syllabus":
        const syllabusItem: Syllabus = {
          id: newId,
          name: formData.name,
          code: formData.code,
          courses: [formData.name],
        };
        if (editingItem) {
          setSyllabiData((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? syllabusItem : item
            )
          );
        } else {
          setSyllabiData((prev) => [...prev, syllabusItem]);
        }
        break;

      case "batch":
        const batchItem: Batch = {
          id: newId,
          name: formData.name,
          syllabus: formData.syllabus,
          startDate: formData.startDate,
          students: editingItem ? editingItem.students : 0,
        };
        if (editingItem) {
          setBatchesData((prev) =>
            prev.map((item) => (item.id === editingItem.id ? batchItem : item))
          );
        } else {
          setBatchesData((prev) => [...prev, batchItem]);
        }
        break;

      case "category":
        const categoryItem: Category = {
          id: newId,
          type: formData.type,
          name: formData.name,
          description: formData.description,
        };
        if (editingItem) {
          setCategoriesData((prev) =>
            prev.map((item) =>
              item.id === editingItem.id ? categoryItem : item
            )
          );
        } else {
          setCategoriesData((prev) => [...prev, categoryItem]);
        }
        break;

      case "tax":
        const taxItem: Tax = {
          id: newId,
          name: formData.name,
          rate: parseFloat(formData.rate) || 0,
          enabled: editingItem ? editingItem.enabled : true,
          description: formData.description,
        };
        if (editingItem) {
          setTaxData((prev) =>
            prev.map((item) => (item.id === editingItem.id ? taxItem : item))
          );
        } else {
          setTaxData((prev) => [...prev, taxItem]);
        }
        break;

      case "coupon":
        const couponItem: Coupon = {
          id: newId,
          code: formData.name,
          discount: parseFloat(formData.discount) || 0,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: editingItem ? editingItem.status : "Active",
        };
        if (editingItem) {
          setCouponsData((prev) =>
            prev.map((item) => (item.id === editingItem.id ? couponItem : item))
          );
        } else {
          setCouponsData((prev) => [...prev, couponItem]);
        }
        break;
    }

    toast({
      title: "Success",
      description: `${
        editingItem ? "Updated" : "Created"
      } ${dialogType} successfully`,
    });
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (type: string, id: number) => {
    switch (type) {
      case "course":
        setCoursesData((prev) => prev.filter((item) => item.id !== id));
        break;
      case "syllabus":
        setSyllabiData((prev) => prev.filter((item) => item.id !== id));
        break;
      case "batch":
        setBatchesData((prev) => prev.filter((item) => item.id !== id));
        break;
      case "category":
        setCategoriesData((prev) => prev.filter((item) => item.id !== id));
        break;
      case "tax":
        setTaxData((prev) => prev.filter((item) => item.id !== id));
        break;
      case "coupon":
        setCouponsData((prev) => prev.filter((item) => item.id !== id));
        break;
    }
    toast({
      title: "Success",
      description: `Deleted ${type} successfully`,
    });
  };

  const toggleTaxStatus = (id: number) => {
    setTaxData((prev) =>
      prev.map((tax) =>
        tax.id === id ? { ...tax, enabled: !tax.enabled } : tax
      )
    );
    toast({
      title: "Success",
      description: "Tax status updated",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Inactive":
        return "bg-secondary text-secondary-foreground";
      case "Expired":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const renderFormFields = () => {
    switch (dialogType) {
      case "course":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Course Name
              </Label>
              <Input
                id="name"
                placeholder="Enter course name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Course Code
              </Label>
              <Input
                id="code"
                placeholder="Enter course code"
                className="col-span-3"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input
                id="duration"
                placeholder="e.g., 6 months"
                className="col-span-3"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>
          </>
        );
      case "syllabus":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Syllabus Name
              </Label>
              <Input
                id="name"
                placeholder="Enter syllabus name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Syllabus Code
              </Label>
              <Input
                id="code"
                placeholder="Enter syllabus code"
                className="col-span-3"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>
          </>
        );
      case "batch":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Batch Name
              </Label>
              <Input
                id="name"
                placeholder="Enter batch name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="syllabus" className="text-right">
                Syllabus
              </Label>
              <Input
                id="syllabus"
                placeholder="Enter syllabus name"
                className="col-span-3"
                value={formData.syllabus}
                onChange={(e) =>
                  setFormData({ ...formData, syllabus: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                className="col-span-3"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
          </>
        );
      case "category":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Category Name
              </Label>
              <Input
                id="name"
                placeholder="Enter category name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Leave">Leave</SelectItem>
                  <SelectItem value="Assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                className="col-span-3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </>
        );
      case "tax":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tax Name
              </Label>
              <Input
                id="name"
                placeholder="Enter tax name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rate" className="text-right">
                Rate (%)
              </Label>
              <Input
                id="rate"
                type="number"
                placeholder="Enter tax rate"
                className="col-span-3"
                value={formData.rate}
                onChange={(e) =>
                  setFormData({ ...formData, rate: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                className="col-span-3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </>
        );
      case "coupon":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Coupon Code
              </Label>
              <Input
                id="name"
                placeholder="Enter coupon code"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discount" className="text-right">
                Discount %
              </Label>
              <Input
                id="discount"
                type="number"
                placeholder="Enter discount percentage"
                className="col-span-3"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                className="col-span-3"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                className="col-span-3"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage system configuration and preferences
          </p>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tax">Tax Settings</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Course Management</h2>
            <Button onClick={() => openDialog("course")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </div>

          <div className="grid gap-4">
            {coursesData.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Book className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                        <CardDescription>
                          Code: {course.code} | Duration: {course.duration}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("course", course)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("course", course.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="syllabus" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Syllabus Management</h2>
            <Button onClick={() => openDialog("syllabus")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Syllabus
            </Button>
          </div>

          <div className="grid gap-4">
            {syllabiData.map((syllabus) => (
              <Card key={syllabus.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {syllabus.name}
                        </CardTitle>
                        <CardDescription>
                          Code: {syllabus.code} | Courses:{" "}
                          {syllabus.courses.join(", ")}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("syllabus", syllabus)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("syllabus", syllabus.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Batch Management</h2>
            <Button onClick={() => openDialog("batch")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Batch
            </Button>
          </div>

          <div className="grid gap-4">
            {batchesData.map((batch) => (
              <Card key={batch.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{batch.name}</CardTitle>
                        <CardDescription>
                          Syllabus: {batch.syllabus} | Start: {batch.startDate}{" "}
                          | Students: {batch.students}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("batch", batch)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("batch", batch.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Category Management</h2>
            <Button onClick={() => openDialog("category")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          <div className="grid gap-4">
            {categoriesData.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Tag className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {category.name}
                        </CardTitle>
                        <CardDescription>
                          Type: {category.type} | {category.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("category", category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("category", category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Tax Configuration</h2>
            <Button onClick={() => openDialog("tax")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tax
            </Button>
          </div>

          <div className="grid gap-4">
            {taxData.map((tax) => (
              <Card key={tax.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {tax.name} - {tax.rate}%
                        </CardTitle>
                        <CardDescription>{tax.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={tax.enabled}
                        onCheckedChange={() => toggleTaxStatus(tax.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("tax", tax)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("tax", tax.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coupons" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Coupon Management</h2>
            <Button onClick={() => openDialog("coupon")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Coupon
            </Button>
          </div>

          <div className="grid gap-4">
            {couponsData.map((coupon) => (
              <Card key={coupon.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Percent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {coupon.code} - {coupon.discount}% OFF
                        </CardTitle>
                        <CardDescription>
                          Valid: {coupon.startDate} to {coupon.endDate}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(coupon.status)}>
                        {coupon.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog("coupon", coupon)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete("coupon", coupon.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit" : "Add"} {dialogType}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? "Update" : "Create a new"} {dialogType} entry
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">{renderFormFields()}</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save {dialogType}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
