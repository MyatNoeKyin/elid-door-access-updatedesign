"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  Monitor, 
  BarChart3, 
  Accessibility,
  Sparkles,
  ChevronRight,
  Play
} from 'lucide-react';

// Phase 1 Components
import { SecurityQuickControls } from '@/components/security-quick-controls';

// Phase 3 Components
import { MultiViewMonitoring } from '@/components/phase3/multi-view-monitoring';
import { IntelligentEventFeed } from '@/components/phase3/intelligent-event-feed';
import { IncidentResponseWorkflow } from '@/components/phase3/incident-response-workflow';
import { InvestigationTools } from '@/components/phase3/investigation-tools';

// Phase 4 Components
import { ExecutiveOverview } from '@/components/phase4/executive-overview';
import { OperationalAnalytics } from '@/components/phase4/operational-analytics';
import { ReportBuilder } from '@/components/phase4/report-builder';
import { ComplianceReporting } from '@/components/phase4/compliance-reporting';

// Phase 5 Components
import { PersonalizationFeatures } from '@/components/phase5/personalization-features';
import { ProductivityTools } from '@/components/phase5/productivity-tools';
import { AccessibilityCompliance } from '@/components/phase5/accessibility-compliance';
import { MultiLanguageSupport } from '@/components/phase5/multi-language-support';

export default function ShowcasePage() {
  const [activePhase, setActivePhase] = useState('overview');

  const phases = [
    {
      id: 'phase1',
      name: 'Phase 1: Security Foundation',
      icon: <Shield className="h-5 w-5" />,
      description: 'Real-time monitoring, emergency response, and enhanced visualization',
      color: 'text-red-600',
      implemented: true
    },
    {
      id: 'phase3',
      name: 'Phase 3: Monitoring & Incidents',
      icon: <Monitor className="h-5 w-5" />,
      description: 'Advanced monitoring, intelligent alerts, and investigation tools',
      color: 'text-blue-600',
      implemented: true
    },
    {
      id: 'phase4',
      name: 'Phase 4: Analytics & Reporting',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Business intelligence, operational analytics, and compliance',
      color: 'text-purple-600',
      implemented: true
    },
    {
      id: 'phase5',
      name: 'Phase 5: UX & Accessibility',
      icon: <Accessibility className="h-5 w-5" />,
      description: 'Personalization, productivity tools, and multi-language support',
      color: 'text-green-600',
      implemented: true
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <Badge variant="outline" className="mb-4">
          <Sparkles className="h-3 w-3 mr-1" />
          Modernization Complete
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">
          ELID Access Control Dashboard System
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Enterprise-grade security interface serving 10,000+ users with real-time monitoring, 
          advanced analytics, and comprehensive accessibility features
        </p>
      </div>

      {/* Phase Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {phases.map((phase) => (
          <Card 
            key={phase.id}
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setActivePhase(phase.id)}
          >
            <CardHeader>
              <div className={`inline-flex p-3 rounded-lg bg-muted ${phase.color}`}>
                {phase.icon}
              </div>
              <CardTitle className="text-lg">{phase.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{phase.description}</p>
              <Button variant="ghost" size="sm" className="w-full">
                View Components
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Component Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Component Showcase</CardTitle>
          <CardDescription>
            Explore the modernized components from each implementation phase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activePhase} onValueChange={setActivePhase}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="phase1">Phase 1</TabsTrigger>
              <TabsTrigger value="phase3">Phase 3</TabsTrigger>
              <TabsTrigger value="phase4">Phase 4</TabsTrigger>
              <TabsTrigger value="phase5">Phase 5</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold mb-4">
                  Welcome to the Modernized ELID System
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                  This showcase demonstrates all implemented components across the 5 phases of modernization. 
                  Click on any phase tab above or the phase cards to explore specific components.
                </p>
                <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                  <div className="text-left space-y-2">
                    <h4 className="font-semibold">Key Features:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Real-time WebSocket connections</li>
                      <li>• Emergency response systems</li>
                      <li>• AI-powered threat detection</li>
                      <li>• Multi-language support (6 languages)</li>
                      <li>• WCAG 2.1 AA compliance</li>
                      <li>• Customizable dashboards</li>
                    </ul>
                  </div>
                  <div className="text-left space-y-2">
                    <h4 className="font-semibold">Technical Highlights:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Next.js 15 with React 19</li>
                      <li>• TypeScript for type safety</li>
                      <li>• Tailwind CSS with dark mode</li>
                      <li>• shadcn/ui components</li>
                      <li>• Responsive design</li>
                      <li>• Performance optimized</li>
                    </ul>
                  </div>
                </div>
                <Button className="mt-8" onClick={() => setActivePhase('phase1')}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Exploring
                </Button>
              </div>
            </TabsContent>

            {/* Phase 1 Tab */}
            <TabsContent value="phase1" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Security Quick Controls</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Emergency response panel with one-click security actions
                  </p>
                </div>
                <SecurityQuickControls />
              </div>
            </TabsContent>

            {/* Phase 3 Tab */}
            <TabsContent value="phase3" className="space-y-6 mt-6">
              <Tabs defaultValue="monitoring" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                  <TabsTrigger value="events">Event Feed</TabsTrigger>
                  <TabsTrigger value="incidents">Incidents</TabsTrigger>
                  <TabsTrigger value="investigation">Investigation</TabsTrigger>
                </TabsList>

                <TabsContent value="monitoring" className="mt-4">
                  <MultiViewMonitoring />
                </TabsContent>
                <TabsContent value="events" className="mt-4">
                  <IntelligentEventFeed />
                </TabsContent>
                <TabsContent value="incidents" className="mt-4">
                  <IncidentResponseWorkflow />
                </TabsContent>
                <TabsContent value="investigation" className="mt-4">
                  <InvestigationTools />
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Phase 4 Tab */}
            <TabsContent value="phase4" className="space-y-6 mt-6">
              <Tabs defaultValue="executive" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="executive">Executive</TabsTrigger>
                  <TabsTrigger value="operational">Operational</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                </TabsList>

                <TabsContent value="executive" className="mt-4">
                  <ExecutiveOverview />
                </TabsContent>
                <TabsContent value="operational" className="mt-4">
                  <OperationalAnalytics />
                </TabsContent>
                <TabsContent value="reports" className="mt-4">
                  <ReportBuilder />
                </TabsContent>
                <TabsContent value="compliance" className="mt-4">
                  <ComplianceReporting />
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Phase 5 Tab */}
            <TabsContent value="phase5" className="space-y-6 mt-6">
              <Tabs defaultValue="personalization" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personalization">Personalization</TabsTrigger>
                  <TabsTrigger value="productivity">Productivity</TabsTrigger>
                  <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                  <TabsTrigger value="languages">Languages</TabsTrigger>
                </TabsList>

                <TabsContent value="personalization" className="mt-4">
                  <PersonalizationFeatures />
                </TabsContent>
                <TabsContent value="productivity" className="mt-4">
                  <ProductivityTools />
                </TabsContent>
                <TabsContent value="accessibility" className="mt-4">
                  <AccessibilityCompliance />
                </TabsContent>
                <TabsContent value="languages" className="mt-4">
                  <MultiLanguageSupport />
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
          <CardDescription>Direct links to key system areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3">
            <Button variant="outline" className="justify-start" asChild>
              <a href="/dashboard">Main Dashboard</a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/dashboard/security-dashboard">Security Center</a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/dashboard/monitoring/real-time">Real-Time Monitoring</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}