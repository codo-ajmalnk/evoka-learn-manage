import { Button } from "@/components/ui/button";
import {
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { memo, useState, useCallback } from "react";

export const AddManagerDialog = memo(() => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    religion: "",
    address: "",
    pin: "",
    qualification: "",
    experience: "",
    department: "",
    designation: "",
    salary: "",
    teamSize: "",
  });

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  }, [formData]);

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Manager</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name*</Label>
            <Input
              id="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name*</Label>
            <Input
              id="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone*</Label>
            <Input
              id="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={(value) => handleInputChange('gender', value)}>
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
            <Label htmlFor="department">Department*</Label>
            <Select onValueChange={(value) => handleInputChange('department', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Human Resources">Human Resources</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="designation">Designation*</Label>
            <Select onValueChange={(value) => handleInputChange('designation', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                <SelectItem value="HR Manager">HR Manager</SelectItem>
                <SelectItem value="Finance Manager">Finance Manager</SelectItem>
                <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                <SelectItem value="IT Manager">IT Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              placeholder="Enter qualification"
              value={formData.qualification}
              onChange={(e) => handleInputChange('qualification', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Input
              id="experience"
              placeholder="e.g., 5 years"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Monthly Salary</Label>
            <Input
              id="salary"
              type="number"
              placeholder="Enter salary amount"
              value={formData.salary}
              onChange={(e) => handleInputChange('salary', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teamSize">Team Size</Label>
            <Input
              id="teamSize"
              type="number"
              placeholder="Number of team members"
              value={formData.teamSize}
              onChange={(e) => handleInputChange('teamSize', e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Add Manager</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
});

AddManagerDialog.displayName = "AddManagerDialog";

export default AddManagerDialog; 