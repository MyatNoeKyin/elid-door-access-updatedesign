"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Download, Save, History, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, UserRole, UserStatus, CredentialType } from '@/lib/types';
import { apiService } from '@/lib/api/api-service';
import { useDebounce } from '@/hooks/use-debounce';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface SearchFilters {
  query: string;
  departments: string[];
  roles: UserRole[];
  status: UserStatus[];
  credentialTypes: CredentialType[];
  accessGroups: string[];
  riskScore: { min: number; max: number };
  lastActivityRange: DateRange | undefined;
  createdDateRange: DateRange | undefined;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
}

interface AdvancedUserSearchProps {
  onResultsChange: (users: User[]) => void;
  onUserSelect?: (user: User) => void;
}

export function AdvancedUserSearch({ onResultsChange, onUserSelect }: AdvancedUserSearchProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    departments: [],
    roles: [],
    status: [],
    credentialTypes: [],
    accessGroups: [],
    riskScore: { min: 0, max: 100 },
    lastActivityRange: undefined,
    createdDateRange: undefined,
  });
  
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: '1',
      name: 'High Risk Users',
      filters: {
        query: '',
        departments: [],
        roles: [],
        status: [UserStatus.ACTIVE],
        credentialTypes: [],
        accessGroups: [],
        riskScore: { min: 70, max: 100 },
        lastActivityRange: undefined,
        createdDateRange: undefined,
      },
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Inactive Users',
      filters: {
        query: '',
        departments: [],
        roles: [],
        status: [UserStatus.INACTIVE],
        credentialTypes: [],
        accessGroups: [],
        riskScore: { min: 0, max: 100 },
        lastActivityRange: undefined,
        createdDateRange: undefined,
      },
      createdAt: new Date(),
    },
  ]);
  
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'John Doe',
    'Engineering Department',
    'Card: 000123',
  ]);
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');

  const debouncedQuery = useDebounce(filters.query, 300);

  // Departments and access groups (in real app, fetch from API)
  const departments = [
    { id: 'dept-1', name: 'Engineering' },
    { id: 'dept-2', name: 'Sales' },
    { id: 'dept-3', name: 'HR' },
    { id: 'dept-4', name: 'Finance' },
    { id: 'dept-5', name: 'Operations' },
  ];

  const accessGroups = [
    'Main Building',
    'Office Area',
    'Server Room',
    'Laboratory',
    'Storage',
  ];

  const performSearch = useCallback(async () => {
    setIsSearching(true);
    
    try {
      // Get all users and filter client-side (in real app, server would handle filtering)
      let users = await apiService.getUsers();
      
      // Apply filters
      if (filters.query) {
        const query = filters.query.toLowerCase();
        users = users.filter(user => 
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.credentials.some(cred => cred.value.toLowerCase().includes(query))
        );
      }
      
      if (filters.departments.length > 0) {
        users = users.filter(user => filters.departments.includes(user.departmentId));
      }
      
      if (filters.roles.length > 0) {
        users = users.filter(user => filters.roles.includes(user.role));
      }
      
      if (filters.status.length > 0) {
        users = users.filter(user => filters.status.includes(user.status));
      }
      
      if (filters.credentialTypes.length > 0) {
        users = users.filter(user => 
          user.credentials.some(cred => filters.credentialTypes.includes(cred.type))
        );
      }
      
      if (filters.accessGroups.length > 0) {
        users = users.filter(user => 
          user.accessGroups.some(group => filters.accessGroups.includes(group))
        );
      }
      
      if (filters.riskScore.min > 0 || filters.riskScore.max < 100) {
        users = users.filter(user => 
          user.riskScore >= filters.riskScore.min && 
          user.riskScore <= filters.riskScore.max
        );
      }
      
      setSearchResults(users);
      onResultsChange(users);
      
      // Add to recent searches
      if (filters.query && !recentSearches.includes(filters.query)) {
        setRecentSearches([filters.query, ...recentSearches.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, [filters, onResultsChange, recentSearches]);

  useEffect(() => {
    performSearch();
  }, [debouncedQuery, filters.departments, filters.roles, filters.status, 
      filters.credentialTypes, filters.accessGroups, filters.riskScore]);

  const clearFilters = () => {
    setFilters({
      query: '',
      departments: [],
      roles: [],
      status: [],
      credentialTypes: [],
      accessGroups: [],
      riskScore: { min: 0, max: 100 },
      lastActivityRange: undefined,
      createdDateRange: undefined,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.departments.length > 0) count++;
    if (filters.roles.length > 0) count++;
    if (filters.status.length > 0) count++;
    if (filters.credentialTypes.length > 0) count++;
    if (filters.accessGroups.length > 0) count++;
    if (filters.riskScore.min > 0 || filters.riskScore.max < 100) count++;
    if (filters.lastActivityRange) count++;
    if (filters.createdDateRange) count++;
    return count;
  };

  const handleSaveSearch = () => {
    if (!searchName) return;
    
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      filters: { ...filters },
      createdAt: new Date(),
    };
    
    setSavedSearches([newSearch, ...savedSearches]);
    setShowSaveDialog(false);
    setSearchName('');
  };

  const handleLoadSearch = (search: SavedSearch) => {
    setFilters(search.filters);
    setIsFilterOpen(false);
  };

  const handleExport = () => {
    // In real app, would export filtered results
    const csv = searchResults.map(user => 
      `${user.firstName},${user.lastName},${user.email},${user.role},${user.status}`
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, card number..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            className="pl-9"
          />
        </div>
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Advanced Filters</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  disabled={activeFilterCount === 0}
                >
                  Clear All
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-[500px]">
              <div className="p-4">
                <Accordion type="multiple" className="w-full">
                  {/* Department Filter */}
                  <AccordionItem value="department">
                    <AccordionTrigger>
                      Department
                      {filters.departments.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {filters.departments.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {departments.map((dept) => (
                          <div key={dept.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={dept.id}
                              checked={filters.departments.includes(dept.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters({
                                    ...filters,
                                    departments: [...filters.departments, dept.id],
                                  });
                                } else {
                                  setFilters({
                                    ...filters,
                                    departments: filters.departments.filter(d => d !== dept.id),
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={dept.id} className="cursor-pointer">
                              {dept.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Role Filter */}
                  <AccordionItem value="role">
                    <AccordionTrigger>
                      Role
                      {filters.roles.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {filters.roles.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {Object.values(UserRole).map((role) => (
                          <div key={role} className="flex items-center space-x-2">
                            <Checkbox
                              id={role}
                              checked={filters.roles.includes(role)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters({
                                    ...filters,
                                    roles: [...filters.roles, role],
                                  });
                                } else {
                                  setFilters({
                                    ...filters,
                                    roles: filters.roles.filter(r => r !== role),
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={role} className="cursor-pointer">
                              {role.replace('_', ' ')}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Status Filter */}
                  <AccordionItem value="status">
                    <AccordionTrigger>
                      Status
                      {filters.status.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {filters.status.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {Object.values(UserStatus).map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                              id={status}
                              checked={filters.status.includes(status)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters({
                                    ...filters,
                                    status: [...filters.status, status],
                                  });
                                } else {
                                  setFilters({
                                    ...filters,
                                    status: filters.status.filter(s => s !== status),
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={status} className="cursor-pointer">
                              {status}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Credential Type Filter */}
                  <AccordionItem value="credential">
                    <AccordionTrigger>
                      Credential Type
                      {filters.credentialTypes.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {filters.credentialTypes.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {Object.values(CredentialType).map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={type}
                              checked={filters.credentialTypes.includes(type)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters({
                                    ...filters,
                                    credentialTypes: [...filters.credentialTypes, type],
                                  });
                                } else {
                                  setFilters({
                                    ...filters,
                                    credentialTypes: filters.credentialTypes.filter(t => t !== type),
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={type} className="cursor-pointer">
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Access Groups Filter */}
                  <AccordionItem value="access">
                    <AccordionTrigger>
                      Access Groups
                      {filters.accessGroups.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {filters.accessGroups.length}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {accessGroups.map((group) => (
                          <div key={group} className="flex items-center space-x-2">
                            <Checkbox
                              id={group}
                              checked={filters.accessGroups.includes(group)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters({
                                    ...filters,
                                    accessGroups: [...filters.accessGroups, group],
                                  });
                                } else {
                                  setFilters({
                                    ...filters,
                                    accessGroups: filters.accessGroups.filter(g => g !== group),
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={group} className="cursor-pointer">
                              {group}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Risk Score Filter */}
                  <AccordionItem value="risk">
                    <AccordionTrigger>
                      Risk Score
                      {(filters.riskScore.min > 0 || filters.riskScore.max < 100) && (
                        <Badge variant="secondary" className="ml-2">
                          {filters.riskScore.min}-{filters.riskScore.max}
                        </Badge>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Label htmlFor="risk-min">Min</Label>
                            <Input
                              id="risk-min"
                              type="number"
                              min="0"
                              max="100"
                              value={filters.riskScore.min}
                              onChange={(e) => setFilters({
                                ...filters,
                                riskScore: {
                                  ...filters.riskScore,
                                  min: parseInt(e.target.value) || 0,
                                },
                              })}
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor="risk-max">Max</Label>
                            <Input
                              id="risk-max"
                              type="number"
                              min="0"
                              max="100"
                              value={filters.riskScore.max}
                              onChange={(e) => setFilters({
                                ...filters,
                                riskScore: {
                                  ...filters.riskScore,
                                  max: parseInt(e.target.value) || 100,
                                },
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </ScrollArea>
            
            <div className="border-t p-4">
              <Button
                className="w-full"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSaveDialog(true)}
          disabled={activeFilterCount === 0}
        >
          <Save className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleExport}
          disabled={searchResults.length === 0}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.departments.length > 0 && (
            <Badge variant="secondary">
              Departments: {filters.departments.length}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => setFilters({ ...filters, departments: [] })}
              />
            </Badge>
          )}
          {filters.roles.length > 0 && (
            <Badge variant="secondary">
              Roles: {filters.roles.length}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => setFilters({ ...filters, roles: [] })}
              />
            </Badge>
          )}
          {filters.status.length > 0 && (
            <Badge variant="secondary">
              Status: {filters.status.length}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => setFilters({ ...filters, status: [] })}
              />
            </Badge>
          )}
          {filters.credentialTypes.length > 0 && (
            <Badge variant="secondary">
              Credentials: {filters.credentialTypes.length}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => setFilters({ ...filters, credentialTypes: [] })}
              />
            </Badge>
          )}
          {(filters.riskScore.min > 0 || filters.riskScore.max < 100) && (
            <Badge variant="secondary">
              Risk: {filters.riskScore.min}-{filters.riskScore.max}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => setFilters({ ...filters, riskScore: { min: 0, max: 100 } })}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Search Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isSearching ? (
            'Searching...'
          ) : (
            <>
              Found <span className="font-medium">{searchResults.length}</span> users
              {filters.query && ` matching "${filters.query}"`}
            </>
          )}
        </p>
      </div>

      {/* Recent Searches */}
      {filters.query === '' && recentSearches.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="h-4 w-4" />
              Recent Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setFilters({ ...filters, query: search })}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Saved Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between rounded-lg border p-2 hover:bg-muted cursor-pointer"
                  onClick={() => handleLoadSearch(search)}
                >
                  <div>
                    <p className="font-medium text-sm">{search.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {format(search.createdAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSavedSearches(savedSearches.filter(s => s.id !== search.id));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <Card className="absolute top-20 right-0 z-50 w-80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Save Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search-name">Search Name</Label>
                <Input
                  id="search-name"
                  placeholder="e.g., High Risk Users"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowSaveDialog(false);
                    setSearchName('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSaveSearch}
                  disabled={!searchName}
                >
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}