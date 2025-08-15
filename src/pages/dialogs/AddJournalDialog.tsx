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
import { Textarea } from "@/components/ui/textarea";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { memo, useState } from "react";

// Dummy data for dropdowns
const dummyStudents = [
  { id: 1, name: "John Doe", email: "john.doe@email.com" },
  { id: 2, name: "Jane Smith", email: "jane.smith@email.com" },
  { id: 3, name: "Mike Johnson", email: "mike.johnson@email.com" },
  { id: 4, name: "Sarah Wilson", email: "sarah.wilson@email.com" },
  { id: 5, name: "David Brown", email: "david.brown@email.com" },
];

const dummyEmployees = [
  { id: 1, name: "Alice Cooper", role: "Senior Developer", department: "IT" },
  { id: 2, name: "Bob Martin", role: "Marketing Manager", department: "Marketing" },
  { id: 3, name: "Carol Davis", role: "HR Specialist", department: "HR" },
  { id: 4, name: "Daniel Lee", role: "Finance Analyst", department: "Finance" },
  { id: 5, name: "Emma White", role: "Project Manager", department: "Operations" },
];

const dummyJournalTypes = [
  { id: 1, name: "Student Fee Payment", dashboards: ["Students", "Finance", "Reports"] },
  { id: 2, name: "Employee Salary", dashboards: ["HR", "Finance", "Reports"] },
  { id: 3, name: "Office Expenses", dashboards: ["Finance", "Reports"] },
  { id: 4, name: "Equipment Purchase", dashboards: ["Finance", "Reports"] },
  { id: 5, name: "Marketing Expenses", dashboards: ["Marketing", "Finance", "Reports"] },
];

const AddJournalDialog = memo(() => {
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    description: "",
    student: "",
    employee: "",
    date: null as Date | null,
    journalType: "",
    attachment: null as File | null,
  });

  const handleInputChange = (field: string, value: string | Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      attachment: file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form data:", formData);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add Journal Entry</DialogTitle>
        <DialogDescription>
          Create a new journal entry for fees, salary, or petty cash.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type *
            </Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select entry type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fee">Fee Payment</SelectItem>
                <SelectItem value="Salary">Salary Payment</SelectItem>
                <SelectItem value="Petty Cash">Petty Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount *
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="journalType" className="text-right">
              Journal Type *
            </Label>
            <Select value={formData.journalType} onValueChange={(value) => handleInputChange("journalType", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select journal type" />
              </SelectTrigger>
              <SelectContent>
                {dummyJournalTypes.map((journalType) => (
                  <SelectItem key={journalType.id} value={journalType.name}>
                    <div className="flex flex-col">
                      <span>{journalType.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Appears in: {journalType.dashboards.join(", ")}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.type === "Fee" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student" className="text-right">
                Student *
              </Label>
              <Select value={formData.student} onValueChange={(value) => handleInputChange("student", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {dummyStudents.map((student) => (
                    <SelectItem key={student.id} value={student.name}>
                      {student.name} - {student.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.type === "Salary" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">
                Employee *
              </Label>
              <Select value={formData.employee} onValueChange={(value) => handleInputChange("employee", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {dummyEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.name}>
                      {employee.name} - {employee.role} ({employee.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date *
            </Label>
            <div className="col-span-3">
              <CustomDatePicker
                value={formData.date}
                onChange={(date) => handleInputChange("date", date)}
                placeholder="Select date"
                size="md"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="attachment" className="text-right">
              Attachment
            </Label>
            <Input 
              id="attachment" 
              type="file" 
              onChange={handleFileChange}
              className="col-span-3" 
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            Save Entry
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
});

AddJournalDialog.displayName = "AddJournalDialog";

export default AddJournalDialog; 