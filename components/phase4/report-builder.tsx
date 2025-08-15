"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Plus,
  Trash2,
  Download,
  Send,
  Calendar,
  Clock,
  Users,
  BarChart3,
  PieChart,
  Table,
  Image,
  Mail,
  Save,
  Play,
  Eye,
  Settings,
  Layers,
  ChevronUp,
  ChevronDown,
  GripVertical
} from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface ReportSection {
  id: string;
  type: 'text' | 'chart' | 'table' | 'image' | 'metric';
  title: string;
  content?: any;
  order: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  category: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'daily-security',
    name: 'Daily Security Report',
    description: 'Comprehensive daily security overview',
    sections: ['executive-summary', 'incidents', 'access-logs', 'metrics'],
    category: 'Security'
  },
  {
    id: 'compliance-audit',
    name: 'Compliance Audit Report',
    description: 'Monthly compliance and audit trail',
    sections: ['compliance-score', 'audit-trail', 'violations', 'recommendations'],
    category: 'Compliance'
  },
  {
    id: 'incident-analysis',
    name: 'Incident Analysis Report',
    description: 'Detailed incident investigation report',
    sections: ['incident-details', 'timeline', 'evidence', 'actions'],
    category: 'Incident'
  },
  {
    id: 'performance-metrics',
    name: 'Performance Metrics Report',
    description: 'System and operational performance',
    sections: ['kpi-dashboard', 'trends', 'efficiency', 'costs'],
    category: 'Performance'
  }
];

const availableSections = [
  { id: 'executive-summary', name: 'Executive Summary', type: 'text' },
  { id: 'incidents', name: 'Security Incidents', type: 'table' },
  { id: 'access-logs', name: 'Access Logs', type: 'table' },
  { id: 'metrics', name: 'Key Metrics', type: 'metric' },
  { id: 'compliance-score', name: 'Compliance Score', type: 'chart' },
  { id: 'audit-trail', name: 'Audit Trail', type: 'table' },
  { id: 'violations', name: 'Violations', type: 'table' },
  { id: 'recommendations', name: 'Recommendations', type: 'text' },
  { id: 'kpi-dashboard', name: 'KPI Dashboard', type: 'chart' },
  { id: 'trends', name: 'Trend Analysis', type: 'chart' },
  { id: 'efficiency', name: 'Efficiency Metrics', type: 'metric' },
  { id: 'costs', name: 'Cost Analysis', type: 'chart' }
];

export function ReportBuilder() {
  const [reportName, setReportName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  });
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState('');
  const [schedule, setSchedule] = useState<string>('manual');
  const [exportFormat, setExportFormat] = useState<string>('pdf');

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      const newSections = template.sections.map((sectionId, index) => {
        const sectionInfo = availableSections.find(s => s.id === sectionId);
        return {
          id: sectionId,
          type: sectionInfo?.type || 'text',
          title: sectionInfo?.name || '',
          order: index
        } as ReportSection;
      });
      setSections(newSections);
      setReportName(template.name);
    }
  };

  const addSection = (sectionId: string) => {
    const sectionInfo = availableSections.find(s => s.id === sectionId);
    if (sectionInfo) {
      setSections([...sections, {
        id: sectionId,
        type: sectionInfo.type as ReportSection['type'],
        title: sectionInfo.name,
        order: sections.length
      }]);
    }
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === 'down' && index < sections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    setSections(newSections);
  };

  const addRecipient = () => {
    if (newRecipient && !recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient('');
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'chart': return <BarChart3 className="h-4 w-4" />;
      case 'table': return <Table className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'metric': return <PieChart className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="design" className="space-y-4">
        <TabsList>
          <TabsTrigger value="design">Design Report</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Distribution</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="templates">Report Library</TabsTrigger>
        </TabsList>

        {/* Design Tab */}
        <TabsContent value="design" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Design your custom report layout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Report Name</Label>
                  <Input
                    placeholder="Enter report name..."
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>
              </div>

              {/* Template Selection */}
              <div className="space-y-2">
                <Label>Start from Template</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-xs text-muted-foreground">{template.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Report Sections */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Report Sections</Label>
                  <Select onValueChange={addSection}>
                    <SelectTrigger className="w-48">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </SelectTrigger>
                    <SelectContent>
                      {availableSections
                        .filter(s => !sections.find(sec => sec.id === s.id))
                        .map(section => (
                          <SelectItem key={section.id} value={section.id}>
                            <div className="flex items-center gap-2">
                              {getSectionIcon(section.type)}
                              {section.name}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  {sections.length === 0 ? (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                      <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No sections added yet</p>
                      <p className="text-sm text-muted-foreground">Add sections or select a template to get started</p>
                    </div>
                  ) : (
                    sections.map((section, index) => (
                      <div key={section.id} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <div className="flex items-center gap-2 flex-1">
                          {getSectionIcon(section.type)}
                          <span className="font-medium">{section.title}</span>
                          <Badge variant="secondary" className="text-xs">{section.type}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveSection(index, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveSection(index, 'down')}
                            disabled={index === sections.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSection(section.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Export Options */}
              <div className="space-y-2">
                <Label>Export Format</Label>
                <div className="flex gap-2">
                  {['pdf', 'excel', 'csv', 'json'].map(format => (
                    <Button
                      key={format}
                      variant={exportFormat === format ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setExportFormat(format)}
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Distribution</CardTitle>
              <CardDescription>Configure automated report generation and delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Schedule Type */}
              <div className="space-y-2">
                <Label>Report Schedule</Label>
                <Select value={schedule} onValueChange={setSchedule}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual (On-Demand)</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {schedule !== 'manual' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Select defaultValue="09:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="18:00">6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {schedule === 'weekly' && (
                    <div className="space-y-2">
                      <Label>Day of Week</Label>
                      <Select defaultValue="monday">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Email Distribution */}
              <div className="space-y-4">
                <Label>Email Distribution List</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email address..."
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                  />
                  <Button onClick={addRecipient}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {recipients.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recipients added yet</p>
                  ) : (
                    recipients.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{email}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setRecipients(recipients.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <Label>Additional Options</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <Checkbox defaultChecked />
                    <span className="text-sm">Include executive summary</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox defaultChecked />
                    <span className="text-sm">Compress large attachments</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox />
                    <span className="text-sm">Send test report before scheduling</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
                <Button variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report Preview</CardTitle>
                  <CardDescription>Preview how your report will look</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Full Screen
                  </Button>
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Generate Preview
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 min-h-[600px] bg-white dark:bg-gray-950">
                {/* Report Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">{reportName || 'Untitled Report'}</h1>
                  <p className="text-muted-foreground">
                    Generated on {new Date().toLocaleDateString()} • 
                    Period: {dateRange?.from?.toLocaleDateString()} - {dateRange?.to?.toLocaleDateString()}
                  </p>
                </div>

                {/* Report Sections Preview */}
                <div className="space-y-8">
                  {sections.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4" />
                      <p>Add sections to see preview</p>
                    </div>
                  ) : (
                    sections.map((section) => (
                      <div key={section.id} className="space-y-2">
                        <h2 className="text-xl font-semibold">{section.title}</h2>
                        <div className="p-4 bg-muted rounded-lg min-h-[100px] flex items-center justify-center text-muted-foreground">
                          {getSectionIcon(section.type)}
                          <span className="ml-2">{section.type} content placeholder</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Template Library</CardTitle>
              <CardDescription>Pre-configured report templates for common use cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {reportTemplates.map(template => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                        <Badge>{template.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Included Sections:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.sections.map(sectionId => {
                            const section = availableSections.find(s => s.id === sectionId);
                            return (
                              <Badge key={sectionId} variant="secondary" className="text-xs">
                                {section?.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4" 
                        variant="outline"
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}