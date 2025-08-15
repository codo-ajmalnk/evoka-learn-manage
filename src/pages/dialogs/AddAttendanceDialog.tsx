import { Button } from "@/components/ui/button";
import {
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
import { memo, useState } from "react";

const AddAttendanceDialog = memo(() => {
  const [formData, setFormData] = useState({
    person: "",
    status: "",
    timeIn: "",
    timeOut: "",
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Mark Attendance</DialogTitle>
        <DialogDescription>
          Record attendance for students or staff
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="person" className="text-right">
              Person
            </Label>
            <Select value={formData.person} onValueChange={(value) => handleInputChange("person", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john">John Doe (Student)</SelectItem>
                <SelectItem value="jane">Jane Smith (Tutor)</SelectItem>
                <SelectItem value="mike">Mike Johnson (Student)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeIn" className="text-right">
              Time In
            </Label>
            <Input 
              id="timeIn" 
              type="time" 
              className="col-span-3"
              value={formData.timeIn}
              onChange={(e) => handleInputChange("timeIn", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeOut" className="text-right">
              Time Out
            </Label>
            <Input 
              id="timeOut" 
              type="time" 
              className="col-span-3"
              value={formData.timeOut}
              onChange={(e) => handleInputChange("timeOut", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">
            Save Attendance
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
});

AddAttendanceDialog.displayName = "AddAttendanceDialog";

export default AddAttendanceDialog; 