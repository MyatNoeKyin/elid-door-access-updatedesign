"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye,
  Ear,
  Hand,
  Keyboard,
  Monitor,
  Palette,
  Type,
  Volume2,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Globe,
  Languages,
  MousePointer,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Contrast
} from 'lucide-react';

interface AccessibilityFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  wcagLevel: 'A' | 'AA' | 'AAA';
  category: 'visual' | 'auditory' | 'motor' | 'cognitive';
}

interface WCAGCriterion {
  id: string;
  name: string;
  level: 'A' | 'AA' | 'AAA';
  status: 'pass' | 'fail' | 'partial';
  description: string;
  impact: string;
}

interface ColorContrastTest {
  foreground: string;
  background: string;
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
}

const accessibilityFeatures: AccessibilityFeature[] = [
  {
    id: 'screen-reader',
    name: 'Screen Reader Support',
    description: 'Optimized for NVDA, JAWS, and VoiceOver',
    icon: <Volume2 />,
    enabled: true,
    wcagLevel: 'A',
    category: 'visual'
  },
  {
    id: 'keyboard-nav',
    name: 'Keyboard Navigation',
    description: 'Full keyboard accessibility with visible focus indicators',
    icon: <Keyboard />,
    enabled: true,
    wcagLevel: 'A',
    category: 'motor'
  },
  {
    id: 'high-contrast',
    name: 'High Contrast Mode',
    description: 'Enhanced contrast for better visibility',
    icon: <Contrast />,
    enabled: false,
    wcagLevel: 'AA',
    category: 'visual'
  },
  {
    id: 'focus-indicators',
    name: 'Enhanced Focus Indicators',
    description: 'Clear visual indicators for keyboard navigation',
    icon: <MousePointer />,
    enabled: true,
    wcagLevel: 'AA',
    category: 'visual'
  },
  {
    id: 'reduced-motion',
    name: 'Reduced Motion',
    description: 'Minimize animations and transitions',
    icon: <Zap />,
    enabled: false,
    wcagLevel: 'AA',
    category: 'cognitive'
  },
  {
    id: 'text-spacing',
    name: 'Adjustable Text Spacing',
    description: 'Customize line height and letter spacing',
    icon: <Type />,
    enabled: false,
    wcagLevel: 'AA',
    category: 'visual'
  }
];

const wcagCriteria: WCAGCriterion[] = [
  {
    id: '1.1.1',
    name: 'Non-text Content',
    level: 'A',
    status: 'pass',
    description: 'All images have appropriate alt text',
    impact: 'Critical for screen reader users'
  },
  {
    id: '1.4.3',
    name: 'Contrast (Minimum)',
    level: 'AA',
    status: 'pass',
    description: 'Text has contrast ratio of at least 4.5:1',
    impact: 'Essential for users with low vision'
  },
  {
    id: '2.1.1',
    name: 'Keyboard',
    level: 'A',
    status: 'pass',
    description: 'All functionality available via keyboard',
    impact: 'Critical for users who cannot use a mouse'
  },
  {
    id: '2.4.3',
    name: 'Focus Order',
    level: 'A',
    status: 'partial',
    description: 'Navigation sequence is logical',
    impact: 'Important for keyboard and screen reader users'
  },
  {
    id: '3.3.2',
    name: 'Labels or Instructions',
    level: 'A',
    status: 'pass',
    description: 'Clear labels for all form inputs',
    impact: 'Helps all users, especially those with cognitive disabilities'
  }
];

const colorContrastTests: ColorContrastTest[] = [
  { foreground: '#000000', background: '#FFFFFF', ratio: 21, wcagAA: true, wcagAAA: true },
  { foreground: '#333333', background: '#F5F5F5', ratio: 12.6, wcagAA: true, wcagAAA: true },
  { foreground: '#666666', background: '#FFFFFF', ratio: 5.7, wcagAA: true, wcagAAA: false },
  { foreground: '#0066CC', background: '#FFFFFF', ratio: 4.5, wcagAA: true, wcagAAA: false }
];

export function AccessibilityCompliance() {
  const [features, setFeatures] = useState(accessibilityFeatures);
  const [fontSize, setFontSize] = useState([16]);
  const [lineHeight, setLineHeight] = useState([1.5]);
  const [letterSpacing, setLetterSpacing] = useState([0]);
  const [contrastMode, setContrastMode] = useState<'normal' | 'high' | 'dark'>('normal');
  const [language, setLanguage] = useState('en');
  const [readingDirection, setReadingDirection] = useState<'ltr' | 'rtl'>('ltr');

  const toggleFeature = (featureId: string) => {
    setFeatures(features.map(f =>
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const overallCompliance = Math.round(
    (wcagCriteria.filter(c => c.status === 'pass').length / wcagCriteria.length) * 100
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'A':
        return <Badge variant="secondary">Level A</Badge>;
      case 'AA':
        return <Badge>Level AA</Badge>;
      case 'AAA':
        return <Badge variant="outline">Level AAA</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Accessibility & Internationalization</h2>
          <p className="text-muted-foreground">
            WCAG 2.1 compliance and multi-language support
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            {overallCompliance}% Compliant
          </Badge>
          <Button>
            Run Accessibility Audit
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>WCAG 2.1 Compliance Status</CardTitle>
          <CardDescription>Overall accessibility compliance across all levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={overallCompliance} className="h-3" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {wcagCriteria.filter(c => c.level === 'A' && c.status === 'pass').length}
                </div>
                <p className="text-sm text-muted-foreground">Level A Passed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {wcagCriteria.filter(c => c.level === 'AA' && c.status === 'pass').length}
                </div>
                <p className="text-sm text-muted-foreground">Level AA Passed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {wcagCriteria.filter(c => c.level === 'AAA' && c.status === 'pass').length}
                </div>
                <p className="text-sm text-muted-foreground">Level AAA Passed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="features" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="i18n">Languages</TabsTrigger>
        </TabsList>

        {/* Accessibility Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Features</CardTitle>
              <CardDescription>Enable and configure accessibility options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['visual', 'auditory', 'motor', 'cognitive'].map(category => {
                  const categoryFeatures = features.filter(f => f.category === category);
                  if (categoryFeatures.length === 0) return null;

                  return (
                    <div key={category} className="space-y-3">
                      <h4 className="font-semibold capitalize">{category} Accessibility</h4>
                      <div className="space-y-2">
                        {categoryFeatures.map(feature => (
                          <div
                            key={feature.id}
                            className="flex items-center justify-between p-4 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-muted">
                                {feature.icon}
                              </div>
                              <div>
                                <p className="font-medium">{feature.name}</p>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {getLevelBadge(feature.wcagLevel)}
                              <Switch
                                checked={feature.enabled}
                                onCheckedChange={() => toggleFeature(feature.id)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visual Settings Tab */}
        <TabsContent value="visual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visual Accessibility Settings</CardTitle>
              <CardDescription>Customize visual elements for better readability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contrast Mode */}
              <div className="space-y-3">
                <Label>Contrast Mode</Label>
                <div className="flex gap-2">
                  <Button
                    variant={contrastMode === 'normal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setContrastMode('normal')}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Normal
                  </Button>
                  <Button
                    variant={contrastMode === 'high' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setContrastMode('high')}
                  >
                    <Contrast className="h-4 w-4 mr-2" />
                    High Contrast
                  </Button>
                  <Button
                    variant={contrastMode === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setContrastMode('dark')}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                </div>
              </div>

              {/* Text Size */}
              <div className="space-y-3">
                <Label>Font Size: {fontSize}px</Label>
                <Slider
                  value={fontSize}
                  onValueChange={setFontSize}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Adjust the base font size across the application
                </p>
              </div>

              {/* Line Height */}
              <div className="space-y-3">
                <Label>Line Height: {lineHeight}</Label>
                <Slider
                  value={lineHeight}
                  onValueChange={setLineHeight}
                  min={1}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Increase line spacing for better readability
                </p>
              </div>

              {/* Letter Spacing */}
              <div className="space-y-3">
                <Label>Letter Spacing: {letterSpacing}px</Label>
                <Slider
                  value={letterSpacing}
                  onValueChange={setLetterSpacing}
                  min={0}
                  max={5}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Adjust spacing between characters
                </p>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-lg border bg-muted/20">
                <p
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: lineHeight[0],
                    letterSpacing: `${letterSpacing}px`
                  }}
                >
                  This is a preview of your text settings. The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WCAG Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>WCAG 2.1 Criteria Compliance</CardTitle>
              <CardDescription>Detailed compliance status for each criterion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {wcagCriteria.map(criterion => (
                  <div
                    key={criterion.id}
                    className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(criterion.status)}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{criterion.id}</span>
                            <span className="font-medium">{criterion.name}</span>
                            {getLevelBadge(criterion.level)}
                          </div>
                          <p className="text-sm text-muted-foreground">{criterion.description}</p>
                          <p className="text-xs text-muted-foreground">Impact: {criterion.impact}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testing Tools Tab */}
        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Testing Tools</CardTitle>
              <CardDescription>Built-in tools to test and validate accessibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Contrast Checker */}
              <div className="space-y-3">
                <h4 className="font-semibold">Color Contrast Checker</h4>
                <div className="space-y-2">
                  {colorContrastTests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: test.foreground }}
                          />
                          <span className="text-sm">on</span>
                          <div
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: test.background }}
                          />
                        </div>
                        <div>
                          <p className="font-mono text-sm">
                            {test.foreground} / {test.background}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Contrast Ratio: {test.ratio}:1
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {test.wcagAA && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            WCAG AA
                          </Badge>
                        )}
                        {test.wcagAAA && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            WCAG AAA
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screen Reader Preview */}
              <div className="space-y-3">
                <h4 className="font-semibold">Screen Reader Preview</h4>
                <Alert>
                  <Volume2 className="h-4 w-4" />
                  <AlertDescription>
                    This tool shows how content will be read by screen readers. 
                    Ensure all important information is conveyed through text.
                  </AlertDescription>
                </Alert>
                <Button variant="outline" className="w-full">
                  Test Current Page
                </Button>
              </div>

              {/* Keyboard Navigation Test */}
              <div className="space-y-3">
                <h4 className="font-semibold">Keyboard Navigation Test</h4>
                <p className="text-sm text-muted-foreground">
                  Press Tab to navigate through all interactive elements and verify focus order
                </p>
                <Button variant="outline" className="w-full">
                  Start Keyboard Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Internationalization Tab */}
        <TabsContent value="i18n" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Language Support</CardTitle>
              <CardDescription>Configure language and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-3">
                <Label>Display Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="ko">한국어</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reading Direction */}
              <div className="space-y-3">
                <Label>Reading Direction</Label>
                <div className="flex gap-2">
                  <Button
                    variant={readingDirection === 'ltr' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReadingDirection('ltr')}
                  >
                    Left to Right
                  </Button>
                  <Button
                    variant={readingDirection === 'rtl' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReadingDirection('rtl')}
                  >
                    Right to Left
                  </Button>
                </div>
              </div>

              {/* Regional Adaptations */}
              <div className="space-y-3">
                <h4 className="font-semibold">Regional Compliance Adaptations</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">EU GDPR Compliance</p>
                      <p className="text-sm text-muted-foreground">Additional privacy controls for EU users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">California CCPA</p>
                      <p className="text-sm text-muted-foreground">California Consumer Privacy Act features</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Localized Date/Time</p>
                      <p className="text-sm text-muted-foreground">Use regional date and time formats</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              {/* Translation Status */}
              <div className="space-y-3">
                <h4 className="font-semibold">Translation Coverage</h4>
                <div className="space-y-2">
                  {[
                    { lang: 'English', coverage: 100 },
                    { lang: 'Español', coverage: 95 },
                    { lang: 'Français', coverage: 90 },
                    { lang: 'Deutsch', coverage: 85 },
                    { lang: '中文', coverage: 80 }
                  ].map(item => (
                    <div key={item.lang} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.lang}</span>
                        <span>{item.coverage}%</span>
                      </div>
                      <Progress value={item.coverage} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}