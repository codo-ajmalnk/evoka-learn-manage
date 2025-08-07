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

const AddAssignmentDialog = memo(() => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    studentId: "",
    studentName: "",
    batchId: "",
    batchName: "",
    tutorId: "",
    tutorName: "",
    dueDate: "",
    maxGrade: "100",
    maxStars: "5",
    attachments: [] as File[],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: files
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
        <DialogTitle>Add New Assignment</DialogTitle>
        <DialogDescription>
          Add a new assignment for students with detailed requirements and specifications.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter assignment title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Research">Research</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Content">Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter detailed assignment description"
                rows={4}
                required
              />
            </div>
          </div>
        </div>

        {/* Student and Batch Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Student & Batch Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID *</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => handleInputChange("studentId", e.target.value)}
                placeholder="Enter student ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name *</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) => handleInputChange("studentName", e.target.value)}
                placeholder="Enter student name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchId">Batch ID *</Label>
              <Input
                id="batchId"
                value={formData.batchId}
                onChange={(e) => handleInputChange("batchId", e.target.value)}
                placeholder="Enter batch ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batchName">Batch Name *</Label>
              <Input
                id="batchName"
                value={formData.batchName}
                onChange={(e) => handleInputChange("batchName", e.target.value)}
                placeholder="Enter batch name"
                required
              />
            </div>
          </div>
        </div>

        {/* Tutor Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tutor Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tutorId">Tutor ID *</Label>
              <Input
                id="tutorId"
                value={formData.tutorId}
                onChange={(e) => handleInputChange("tutorId", e.target.value)}
                placeholder="Enter tutor ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tutorName">Tutor Name *</Label>
              <Input
                id="tutorName"
                value={formData.tutorName}
                onChange={(e) => handleInputChange("tutorName", e.target.value)}
                placeholder="Enter tutor name"
                required
              />
            </div>
          </div>
        </div>

        {/* Assignment Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Assignment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxGrade">Maximum Grade *</Label>
              <Input
                id="maxGrade"
                type="number"
                value={formData.maxGrade}
                onChange={(e) => handleInputChange("maxGrade", e.target.value)}
                placeholder="100"
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStars">Maximum Stars *</Label>
              <Input
                id="maxStars"
                type="number"
                value={formData.maxStars}
                onChange={(e) => handleInputChange("maxStars", e.target.value)}
                placeholder="5"
                min="1"
                max="10"
                required
              />
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Attachments</h3>
          <div className="space-y-2">
            <Label htmlFor="attachments">Assignment Files</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
            />
            <p className="text-sm text-muted-foreground">
              Upload assignment brief, reference materials, or templates (PDF, DOC, PPT, ZIP)
            </p>
            {formData.attachments.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Selected files:</p>
                <ul className="text-sm text-muted-foreground">
                  {formData.attachments.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <DialogFooter>
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            Add Assignment
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
});

AddAssignmentDialog.displayName = "AddAssignmentDialog";

export default AddAssignmentDialog; 