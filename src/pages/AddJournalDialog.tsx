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
import { memo, useState } from "react";

const AddJournalDialog = memo(() => {
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    description: "",
    student: "",
    employee: "",
    date: "",
    attachment: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
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

          {formData.type === "Fee" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="student" className="text-right">
                Student *
              </Label>
              <Input
                id="student"
                placeholder="Enter student name"
                value={formData.student}
                onChange={(e) => handleInputChange("student", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          )}

          {formData.type === "Salary" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">
                Employee *
              </Label>
              <Input
                id="employee"
                placeholder="Enter employee name"
                value={formData.employee}
                onChange={(e) => handleInputChange("employee", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="col-span-3"
              required
            />
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