"use client";

import { useState } from 'react';
import { UserWizard } from '@/components/phase2/user-wizard';
import { AdvancedUserSearch } from '@/components/phase2/advanced-user-search';
import { UserRiskAssessment } from '@/components/phase2/user-risk-assessment';
import { AccessMatrix } from '@/components/phase2/access-matrix';
import { AccessCalendar } from '@/components/phase2/access-calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  Grid3X3, 
  Calendar,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import { User } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdvancedUserManagementPage() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    if (activeTab === 'search') {
      setActiveTab('risk');
    }
  };

  const handleBulkImport = () => {
    // In real app, would handle file upload and CSV parsing
    console.log('Bulk import clicked');
  };

  const handleExportTemplate = () => {
    // In real app, would download CSV template
    const csvContent = "firstName,lastName,email,department,role,cardNumber\nJohn,Doe,john.doe@company.com,Engineering,USER,CARD-000001";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-import-template.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced User Management</h1>
          <p className="text-muted-foreground">
            Comprehensive user lifecycle management with advanced security features
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <Button variant="outline" onClick={handleBulkImport}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button onClick={() => setShowWizard(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              Currently in building
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <Badge variant="destructive" className="mt-1">
              Requires review
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              Credentials expire in 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {showWizard ? (
        <Card>
          <CardContent className="pt-6">
            <UserWizard onComplete={() => setShowWizard(false)} />
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search & Filter
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Risk Assessment
            </TabsTrigger>
            <TabsTrigger value="matrix" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Access Matrix
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <AdvancedUserSearch 
              onResultsChange={setSearchResults}
              onUserSelect={handleUserSelect}
            />
            
            {/* Search Results Table */}
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Risk Score</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.map((user) => (
                          <TableRow 
                            key={user.id}
                            className="cursor-pointer hover:bg-muted"
                            onClick={() => handleUserSelect(user)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.photoUrl} />
                                  <AvatarFallback>
                                    {user.firstName[0]}{user.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.departmentId}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                user.riskScore >= 70 ? 'destructive' :
                                user.riskScore >= 40 ? 'default' :
                                'secondary'
                              }>
                                {user.riskScore}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUserSelect(user);
                                }}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="risk">
            {selectedUser ? (
              <UserRiskAssessment user={selectedUser} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-96 text-center">
                  <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No User Selected</h3>
                  <p className="text-muted-foreground">
                    Search for and select a user to view their risk assessment
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setActiveTab('search')}
                  >
                    Go to Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="matrix">
            <AccessMatrix />
          </TabsContent>

          <TabsContent value="calendar">
            <AccessCalendar />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-3">Default Access Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Default access level for new users</span>
                      <Badge>Basic Access</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Credential expiration period</span>
                      <Badge>365 days</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Password policy</span>
                      <Badge>Strong (8+ chars, mixed case, numbers)</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Risk Assessment Thresholds</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High risk threshold</span>
                      <Badge variant="destructive">≥ 70</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium risk threshold</span>
                      <Badge>≥ 40</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-flag for review</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Import/Export Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CSV delimiter</span>
                      <Badge>Comma (,)</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Date format</span>
                      <Badge>YYYY-MM-DD</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-validate on import</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}