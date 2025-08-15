import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Download,
  Receipt,
  Wallet,
} from "lucide-react";
import { memo } from "react";

interface JournalEntry {
  id: number;
  type: "Fee" | "Salary" | "Petty Cash";
  student?: string;
  employee?: string;
  amount: number;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
  description: string;
  attachments: string[];
}

const JournalDetailsDialog = memo(({ entry }: { entry: JournalEntry }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success text-success-foreground";
      case "Pending":
        return "bg-warning text-warning-foreground";
      case "Rejected":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Fee":
        return <DollarSign className="w-5 h-5 text-primary" />;
      case "Salary":
        return <Wallet className="w-5 h-5 text-primary" />;
      case "Petty Cash":
        return <Receipt className="w-5 h-5 text-primary" />;
      default:
        return <DollarSign className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            {getTypeIcon(entry.type)}
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              {entry.description}
            </h3>
            <p className="text-sm text-muted-foreground">
              Entry #{entry.id} • {entry.type}
            </p>
          </div>
        </DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Entry ID</Label>
              <p className="text-sm font-mono">{entry.id}</p>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Badge variant="outline">{entry.type}</Badge>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <p className="text-lg font-semibold">
                ₹{entry.amount.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Badge className={getStatusColor(entry.status)}>
                {entry.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <p className="text-sm">{entry.date}</p>
            </div>
            {entry.student && (
              <div className="space-y-2">
                <Label>Student</Label>
                <p className="text-sm">{entry.student}</p>
              </div>
            )}
            {entry.employee && (
              <div className="space-y-2">
                <Label>Employee</Label>
                <p className="text-sm">{entry.employee}</p>
              </div>
            )}
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <p className="text-sm">{entry.description}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Transaction Summary</Label>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-lg font-semibold">
                      ₹{entry.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Attachments</p>
                    <p className="text-lg font-semibold">
                      {entry.attachments.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4">
          <div className="space-y-3">
            <Label>Attachments ({entry.attachments.length})</Label>
            {entry.attachments.length > 0 ? (
              <div className="space-y-2">
                {entry.attachments.map((attachment, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Download className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium">{attachment}</p>
                            <p className="text-sm text-muted-foreground">
                              Document
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No attachments available for this entry.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-3">
            <Label>Transaction History</Label>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Entry Created</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.date}
                      </p>
                    </div>
                    <Badge variant="outline">Created</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Status Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.date}
                      </p>
                    </div>
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status}
                    </Badge>
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

JournalDetailsDialog.displayName = "JournalDetailsDialog";

export default JournalDetailsDialog; 