import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Filter, Upload, Download, Eye, Edit, Trash2, DollarSign, Receipt, Wallet } from 'lucide-react';

// Dummy data
const journalEntries = [
  {
    id: 1,
    type: 'Fee',
    student: 'John Doe',
    amount: 5000,
    status: 'Approved',
    date: '2024-01-15',
    description: 'Course Fee Payment',
    attachments: ['receipt1.pdf']
  },
  {
    id: 2,
    type: 'Salary',
    employee: 'Jane Smith',
    amount: 45000,
    status: 'Pending',
    date: '2024-01-14',
    description: 'Monthly Salary',
    attachments: []
  },
  {
    id: 3,
    type: 'Petty Cash',
    description: 'Office Supplies',
    amount: 1200,
    status: 'Approved',
    date: '2024-01-13',
    attachments: ['receipt3.jpg']
  }
];

const Journals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredEntries = journalEntries.filter(entry =>
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.student && entry.student.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (entry.employee && entry.employee.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-success text-success-foreground';
      case 'Pending': return 'bg-warning text-warning-foreground';
      case 'Rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Journals</h1>
          <p className="text-muted-foreground">Manage fees, salaries, and petty cash transactions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Journal Entry</DialogTitle>
              <DialogDescription>Create a new journal entry for fees, salary, or petty cash.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select entry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fee">Fee Payment</SelectItem>
                    <SelectItem value="salary">Salary Payment</SelectItem>
                    <SelectItem value="petty">Petty Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">Amount</Label>
                <Input id="amount" type="number" placeholder="Enter amount" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" placeholder="Enter description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="attachment" className="text-right">Attachment</Label>
                <Input id="attachment" type="file" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setIsAddDialogOpen(false)}>Save Entry</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Entries</TabsTrigger>
            <TabsTrigger value="fees">Fees</TabsTrigger>
            <TabsTrigger value="salaries">Salaries</TabsTrigger>
            <TabsTrigger value="petty">Petty Cash</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredEntries.map((entry) => (
              <Card key={entry.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {entry.type === 'Fee' && <DollarSign className="w-5 h-5 text-primary" />}
                        {entry.type === 'Salary' && <Wallet className="w-5 h-5 text-primary" />}
                        {entry.type === 'Petty Cash' && <Receipt className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{entry.description}</CardTitle>
                        <CardDescription>
                          {entry.student && `Student: ${entry.student}`}
                          {entry.employee && `Employee: ${entry.employee}`}
                          {!entry.student && !entry.employee && `${entry.type} Entry`}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(entry.status)}>{entry.status}</Badge>
                      <span className="text-lg font-semibold">₹{entry.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Date: {entry.date}</span>
                      <span>Type: {entry.type}</span>
                      {entry.attachments.length > 0 && (
                        <span>{entry.attachments.length} attachment(s)</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fees">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Fee entries will be shown here</p>
          </div>
        </TabsContent>

        <TabsContent value="salaries">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Salary entries will be shown here</p>
          </div>
        </TabsContent>

        <TabsContent value="petty">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Petty cash entries will be shown here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Journals;