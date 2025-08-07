import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { memo, useState } from "react";

const AddHRDialog = memo(() => {
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
    specialization: "",
    designation: "",
    salary: "",
    joiningDate: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form data:", formData);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New HR Personnel</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange("whatsapp", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange("dob", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
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
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange("bloodGroup", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="religion">Religion</Label>
              <Input
                id="religion"
                value={formData.religion}
                onChange={(e) => handleInputChange("religion", e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin">PIN Code *</Label>
              <Input
                id="pin"
                value={formData.pin}
                onChange={(e) => handleInputChange("pin", e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Professional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification *</Label>
              <Select value={formData.qualification} onValueChange={(value) => handleInputChange("qualification", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select qualification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MBA HR">MBA HR</SelectItem>
                  <SelectItem value="M.A. Psychology">M.A. Psychology</SelectItem>
                  <SelectItem value="BBA HR">BBA HR</SelectItem>
                  <SelectItem value="MHRM">MHRM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience *</Label>
              <Input
                id="experience"
                placeholder="e.g., 5 years"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization *</Label>
              <Select value={formData.specialization} onValueChange={(value) => handleInputChange("specialization", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Talent Acquisition">Talent Acquisition</SelectItem>
                  <SelectItem value="Employee Relations">Employee Relations</SelectItem>
                  <SelectItem value="Compensation & Benefits">Compensation & Benefits</SelectItem>
                  <SelectItem value="Training & Development">Training & Development</SelectItem>
                  <SelectItem value="HR Analytics">HR Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Select value={formData.designation} onValueChange={(value) => handleInputChange("designation", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Senior HR Executive">Senior HR Executive</SelectItem>
                  <SelectItem value="HR Executive">HR Executive</SelectItem>
                  <SelectItem value="HR Manager">HR Manager</SelectItem>
                  <SelectItem value="HR Specialist">HR Specialist</SelectItem>
                  <SelectItem value="HR Coordinator">HR Coordinator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (Monthly) *</Label>
              <Input
                id="salary"
                type="number"
                placeholder="e.g., 50000"
                value={formData.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="joiningDate">Joining Date *</Label>
              <Input
                id="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Select value={formData.bankName} onValueChange={(value) => handleInputChange("bankName", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                  <SelectItem value="SBI">SBI</SelectItem>
                  <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
                  <SelectItem value="Axis Bank">Axis Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ifsc">IFSC Code *</Label>
              <Input
                id="ifsc"
                value={formData.ifsc}
                onChange={(e) => handleInputChange("ifsc", e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            Add HR Personnel
          </Button>
        </div>
      </form>
    </DialogContent>
  );
});

AddHRDialog.displayName = "AddHRDialog";

export default AddHRDialog; 