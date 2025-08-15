import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  FileText,
  GraduationCap,
  Star,
} from "lucide-react";
import { memo } from "react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  dateCreated: string;
  dueDate: string;
  submissionDate?: string;
  grade?: number;
  maxGrade: number;
  stars?: number;
  maxStars: number;
  studentId: string;
  studentName: string;
  batchId: string;
  batchName: string;
  tutorId: string;
  tutorName: string;
  attachments: string[];
  submissions: {
    id: string;
    fileName: string;
    submittedAt: string;
    size: string;
  }[];
  feedback?: string;
}

const AssignmentDetailsDialog = memo(({ assignment }: { assignment: Assignment }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "submitted":
        return "info";
      case "graded":
        return "success";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getProgressValue = (assignment: Assignment) => {
    if (assignment.status === "pending") return 25;
    if (assignment.status === "submitted") return 75;
    if (assignment.status === "graded") return 100;
    if (assignment.status === "overdue") return 10;
    return 0;
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{assignment.title}</h3>
            <p className="text-sm text-muted-foreground">
              {assignment.id} • {assignment.category}
            </p>
          </div>
        </DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="submission">Submission</TabsTrigger>
          <TabsTrigger value="grading">Grading</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {assignment.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {assignment.studentName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {assignment.studentId}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tutor</Label>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {assignment.tutorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{assignment.tutorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {assignment.tutorId}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Batch</Label>
              <Badge variant="outline">
                {assignment.batchName} ({assignment.batchId})
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Badge variant="secondary">{assignment.category}</Badge>
            </div>
            <div className="space-y-2">
              <Label>Created Date</Label>
              <p className="text-sm">{assignment.dateCreated}</p>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <p className="text-sm">{assignment.dueDate}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <p className="text-sm bg-muted p-3 rounded">
              {assignment.description}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="flex flex-wrap gap-2">
              {assignment.attachments.map((file, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                >
                  {file}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="submission" className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Badge variant={getStatusColor(assignment.status)}>
              {assignment.status.toUpperCase()}
            </Badge>
          </div>

          {assignment.submissionDate && (
            <div className="space-y-2">
              <Label>Submission Date</Label>
              <p className="text-sm">{assignment.submissionDate}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Submitted Files</Label>
            {assignment.submissions.length > 0 ? (
              <div className="space-y-2">
                {assignment.submissions.map((submission) => (
                  <Card key={submission.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{submission.fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            Submitted:{" "}
                            {new Date(submission.submittedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{submission.size}</p>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No submissions yet
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="grading" className="space-y-4">
          {assignment.status === "graded" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {assignment.grade}
                    </span>
                    <span className="text-muted-foreground">
                      / {assignment.maxGrade}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Stars</Label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: assignment.maxStars }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < (assignment.stars || 0)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {assignment.feedback && (
                <div className="space-y-2">
                  <Label>Feedback</Label>
                  <p className="text-sm bg-muted p-3 rounded">
                    {assignment.feedback}
                  </p>
                </div>
              )}
            </div>
          ) : assignment.status === "submitted" ? (
            <div className="space-y-4">
              <h4 className="font-medium">Grade Assignment</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade (out of {assignment.maxGrade})</Label>
                  <Input
                    type="number"
                    min="0"
                    max={assignment.maxGrade}
                    placeholder="Enter grade"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stars (out of {assignment.maxStars})</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stars" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: assignment.maxStars }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1} Star{i + 1 > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Feedback</Label>
                <Textarea
                  placeholder="Enter feedback for the student..."
                  rows={4}
                />
              </div>
              <Button className="w-full">
                Submit Grade
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Assignment not yet submitted for grading
            </p>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="space-y-2">
            <Label>Assignment Progress</Label>
            <Progress value={getProgressValue(assignment)} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {assignment.status === "pending" && "Waiting for submission"}
              {assignment.status === "submitted" &&
                "Submitted, waiting for grading"}
              {assignment.status === "graded" &&
                "Assignment completed and graded"}
              {assignment.status === "overdue" && "Assignment is overdue"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time Remaining</p>
                    <p className="text-xs text-muted-foreground">
                      {assignment.status === "overdue"
                        ? "Overdue"
                        : new Date(assignment.dueDate) > new Date()
                        ? `${Math.ceil(
                            (new Date(assignment.dueDate).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )} days`
                        : "Due today"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Completion</p>
                    <p className="text-xs text-muted-foreground">
                      {getProgressValue(assignment)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
});

AssignmentDetailsDialog.displayName = "AssignmentDetailsDialog";

export default AssignmentDetailsDialog; 