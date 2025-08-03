import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  Edit,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { CardGridSkeleton } from "@/components/ui/skeletons/card-grid-skeleton";

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

const dummyAssignments: Assignment[] = [
  {
    id: "ASG001",
    title: "Brand Identity Design Project",
    description:
      "Create a complete brand identity package including logo, color palette, typography, and brand guidelines for a fictional startup.",
    category: "Design",
    status: "graded",
    dateCreated: "2025-11-01",
    dueDate: "2025-11-15",
    submissionDate: "2025-11-14",
    grade: 85,
    maxGrade: 100,
    stars: 4,
    maxStars: 5,
    studentId: "STU001",
    studentName: "Rahul Sharma",
    batchId: "ADV001",
    batchName: "Advanced Advertising",
    tutorId: "TUT001",
    tutorName: "Rajesh Kumar",
    attachments: ["assignment_brief.pdf", "reference_materials.zip"],
    submissions: [
      {
        id: "SUB001",
        fileName: "brand_identity_final.zip",
        submittedAt: "2025-11-14T10:30:00Z",
        size: "15.2 MB",
      },
    ],
    feedback:
      "Excellent work on the brand identity. The color palette is well thought out and the logo design is creative. Consider improving the typography hierarchy in the guidelines.",
  },
  {
    id: "ASG002",
    title: "Social Media Campaign Strategy",
    description:
      "Develop a comprehensive social media marketing strategy for a product launch including platform selection, content calendar, and engagement tactics.",
    category: "Marketing",
    status: "submitted",
    dateCreated: "2025-11-05",
    dueDate: "2025-11-20",
    submissionDate: "2025-11-18",
    grade: 0,
    maxGrade: 100,
    stars: 0,
    maxStars: 5,
    studentId: "STU002",
    studentName: "Priya Patel",
    batchId: "MKT001",
    batchName: "Digital Marketing",
    tutorId: "TUT002",
    tutorName: "Priya Sharma",
    attachments: ["campaign_template.xlsx", "platform_guidelines.pdf"],
    submissions: [
      {
        id: "SUB002",
        fileName: "social_media_strategy.pptx",
        submittedAt: "2025-11-18T14:15:00Z",
        size: "8.7 MB",
      },
    ],
  },
  {
    id: "ASG003",
    title: "Print Advertisement Layout",
    description:
      "Design a print advertisement for a magazine spread including headline, body copy, images, and call-to-action.",
    category: "Design",
    status: "pending",
    dateCreated: "2025-11-10",
    dueDate: "2025-11-25",
    grade: 0,
    maxGrade: 100,
    stars: 0,
    maxStars: 5,
    studentId: "STU003",
    studentName: "Arun Reddy",
    batchId: "ADV001",
    batchName: "Advanced Advertising",
    tutorId: "TUT001",
    tutorName: "Rajesh Kumar",
    attachments: ["ad_specifications.pdf", "brand_assets.zip"],
    submissions: [],
  },
  {
    id: "ASG004",
    title: "Consumer Behavior Analysis",
    description:
      "Conduct research and analysis on consumer behavior patterns for a specific demographic and present findings with recommendations.",
    category: "Research",
    status: "overdue",
    dateCreated: "2025-10-20",
    dueDate: "2025-11-05",
    grade: 0,
    maxGrade: 100,
    stars: 0,
    maxStars: 5,
    studentId: "STU004",
    studentName: "Sneha Joshi",
    batchId: "MKT001",
    batchName: "Digital Marketing",
    tutorId: "TUT002",
    tutorName: "Priya Sharma",
    attachments: ["research_methodology.pdf", "survey_template.docx"],
    submissions: [],
  },
];

const Assignments = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] =
    useState<Assignment[]>(dummyAssignments);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <CardGridSkeleton cards={8} showHeader={true} />;
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role || "admin";

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      `${assignment.title} ${assignment.studentName} ${assignment.category} ${assignment.id}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending")
      return matchesSearch && assignment.status === "pending";
    if (activeTab === "submitted")
      return matchesSearch && assignment.status === "submitted";
    if (activeTab === "graded")
      return matchesSearch && assignment.status === "graded";
    if (activeTab === "overdue")
      return matchesSearch && assignment.status === "overdue";

    return matchesSearch;
  });

  const handleEdit = (assignment: Assignment) => {
    toast({
      title: "Edit Assignment",
      description: `Editing assignment: ${assignment.title}`,
    });
  };

  const handleDelete = (id: string) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
    toast({
      title: "Assignment Deleted",
      description: "Assignment has been successfully deleted.",
    });
  };

  const handleGradeSubmission = (
    assignmentId: string,
    grade: number,
    stars: number,
    feedback: string
  ) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, grade, stars, feedback, status: "graded" as const }
          : assignment
      )
    );
    toast({
      title: "Assignment Graded",
      description: "Grade and feedback have been submitted successfully.",
    });
  };

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

  const AssignmentDetailsDialog = ({
    assignment,
  }: {
    assignment: Assignment;
  }) => (
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
              <Button
                onClick={() =>
                  handleGradeSubmission(
                    assignment.id,
                    85,
                    4,
                    "Good work! Keep it up."
                  )
                }
                className="w-full"
              >
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Assignments Management</h1>
          <p className="text-muted-foreground">
            Track and manage student assignments
          </p>
        </div>
        {(userRole === "admin" || userRole === "tutor") && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Assignment
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Assignments
                </p>
                <p className="text-xl font-semibold">{assignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-semibold">
                  {assignments.filter((a) => a.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <GraduationCap className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-xl font-semibold">
                  {assignments.filter((a) => a.status === "submitted").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Star className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Graded</p>
                <p className="text-xl font-semibold">
                  {assignments.filter((a) => a.status === "graded").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Assignments List</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assignments..."
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
          <div className="flex gap-2 mb-4 overflow-x-auto">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("all")}
            >
              All ({assignments.length})
            </Button>
            <Button
              variant={activeTab === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("pending")}
            >
              Pending (
              {assignments.filter((a) => a.status === "pending").length})
            </Button>
            <Button
              variant={activeTab === "submitted" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("submitted")}
            >
              Submitted (
              {assignments.filter((a) => a.status === "submitted").length})
            </Button>
            <Button
              variant={activeTab === "graded" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("graded")}
            >
              Graded ({assignments.filter((a) => a.status === "graded").length})
            </Button>
            <Button
              variant={activeTab === "overdue" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("overdue")}
            >
              Overdue (
              {assignments.filter((a) => a.status === "overdue").length})
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Assignment</th>
                  <th className="text-left p-2">Student</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Due Date</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Grade</th>
                  <th className="text-left p-2">Progress</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="border-b hover:bg-muted/50"
                  >
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {assignment.id}
                        </p>
                      </div>
                    </td>
                    <td className="p-2">
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
                            {assignment.batchName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant="secondary">{assignment.category}</Badge>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="text-sm">{assignment.dueDate}</p>
                        {assignment.status === "overdue" && (
                          <p className="text-xs text-destructive">Overdue</p>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      {assignment.grade !== undefined ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {assignment.grade}/{assignment.maxGrade}
                          </span>
                          <div className="flex">
                            {Array.from(
                              { length: assignment.maxStars },
                              (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < (assignment.stars || 0)
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              )
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-2">
                      <div className="w-20">
                        <Progress
                          value={getProgressValue(assignment)}
                          className="h-2"
                        />
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedAssignment(assignment)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {selectedAssignment && (
                            <AssignmentDetailsDialog
                              assignment={selectedAssignment}
                            />
                          )}
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(assignment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {(userRole === "admin" || userRole === "tutor") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(assignment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No assignments found matching your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Assignments;
