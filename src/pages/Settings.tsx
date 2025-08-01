import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Settings as SettingsIcon, Book, GraduationCap, Users, DollarSign, Tag, Percent } from 'lucide-react';

// Dummy data
const courses = [
  { id: 1, name: 'Web Development', code: 'WD001', duration: '6 months', status: 'Active' },
  { id: 2, name: 'Digital Marketing', code: 'DM001', duration: '4 months', status: 'Active' },
  { id: 3, name: 'Graphic Design', code: 'GD001', duration: '5 months', status: 'Active' }
];

const syllabi = [
  { id: 1, name: 'Full Stack Development', code: 'FSD001', courses: ['Web Development'] },
  { id: 2, name: 'Digital Marketing Mastery', code: 'DMM001', courses: ['Digital Marketing'] },
  { id: 3, name: 'Creative Design', code: 'CD001', courses: ['Graphic Design'] }
];

const batches = [
  { id: 1, name: 'Batch WD-2024-01', syllabus: 'Full Stack Development', startDate: '2024-01-15', students: 25 },
  { id: 2, name: 'Batch DM-2024-01', syllabus: 'Digital Marketing Mastery', startDate: '2024-02-01', students: 20 },
  { id: 3, name: 'Batch GD-2024-01', syllabus: 'Creative Design', startDate: '2024-01-20', students: 18 }
];

const categories = [
  { id: 1, type: 'Salary', name: 'Monthly Salary', description: 'Regular monthly salary payment' },
  { id: 2, type: 'Payment', name: 'Course Fee', description: 'Student course fee payment' },
  { id: 3, type: 'Leave', name: 'Sick Leave', description: 'Medical leave category' },
  { id: 4, type: 'Assignment', name: 'Project Work', description: 'Project-based assignments' }
];

const taxSettings = [
  { id: 1, name: 'GST', rate: 18, enabled: true, description: 'Goods and Services Tax' },
  { id: 2, name: 'TDS', rate: 10, enabled: true, description: 'Tax Deducted at Source' },
  { id: 3, name: 'Service Tax', rate: 15, enabled: false, description: 'Service Tax' }
];

const coupons = [
  { id: 1, code: 'EARLY2024', discount: 20, startDate: '2024-01-01', endDate: '2024-03-31', status: 'Active' },
  { id: 2, code: 'STUDENT50', discount: 50, startDate: '2024-02-01', endDate: '2024-12-31', status: 'Active' },
  { id: 3, code: 'WINTER25', discount: 25, startDate: '2024-01-15', endDate: '2024-02-29', status: 'Expired' }
];

const Settings = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');

  const openDialog = (type: string) => {
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-success text-success-foreground';
      case 'Inactive': return 'bg-secondary text-secondary-foreground';
      case 'Expired': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage system configuration and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
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
            <Button onClick={() => openDialog('course')} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </div>
          
          <div className="grid gap-4">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Book className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                        <CardDescription>Code: {course.code} | Duration: {course.duration}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
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
            <Button onClick={() => openDialog('syllabus')} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Syllabus
            </Button>
          </div>
          
          <div className="grid gap-4">
            {syllabi.map((syllabus) => (
              <Card key={syllabus.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{syllabus.name}</CardTitle>
                        <CardDescription>Code: {syllabus.code} | Courses: {syllabus.courses.join(', ')}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
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
            <Button onClick={() => openDialog('batch')} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Batch
            </Button>
          </div>
          
          <div className="grid gap-4">
            {batches.map((batch) => (
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
                          Syllabus: {batch.syllabus} | Start: {batch.startDate} | Students: {batch.students}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
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
            <Button onClick={() => openDialog('category')} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
          
          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Tag className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription>Type: {category.type} | {category.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
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
            <Button onClick={() => openDialog('tax')} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Tax
            </Button>
          </div>
          
          <div className="grid gap-4">
            {taxSettings.map((tax) => (
              <Card key={tax.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tax.name} - {tax.rate}%</CardTitle>
                        <CardDescription>{tax.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={tax.enabled} />
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
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
            <Button onClick={() => openDialog('coupon')} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Coupon
            </Button>
          </div>
          
          <div className="grid gap-4">
            {coupons.map((coupon) => (
              <Card key={coupon.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Percent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{coupon.code} - {coupon.discount}% OFF</CardTitle>
                        <CardDescription>Valid: {coupon.startDate} to {coupon.endDate}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(coupon.status)}>{coupon.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
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
            <DialogTitle>Add {dialogType}</DialogTitle>
            <DialogDescription>Create a new {dialogType} entry</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {dialogType === 'course' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="courseName" className="text-right">Course Name</Label>
                  <Input id="courseName" placeholder="Enter course name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="courseCode" className="text-right">Course Code</Label>
                  <Input id="courseCode" placeholder="Enter course code" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">Duration</Label>
                  <Input id="duration" placeholder="e.g., 6 months" className="col-span-3" />
                </div>
              </>
            )}
            {dialogType === 'coupon' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="couponCode" className="text-right">Coupon Code</Label>
                  <Input id="couponCode" placeholder="Enter coupon code" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount" className="text-right">Discount %</Label>
                  <Input id="discount" type="number" placeholder="Enter discount percentage" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">Start Date</Label>
                  <Input id="startDate" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">End Date</Label>
                  <Input id="endDate" type="date" className="col-span-3" />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => setIsDialogOpen(false)}>Save {dialogType}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;