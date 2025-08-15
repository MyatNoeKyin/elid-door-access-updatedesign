"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe,
  Languages,
  Download,
  Upload,
  Check,
  X,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  Clock,
  DollarSign,
  Percent,
  Hash,
  Type,
  FileText,
  Edit,
  Save,
  RefreshCw,
  GitBranch,
  Users,
  ChevronRight,
  Settings,
  Plus
} from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  status: 'active' | 'draft' | 'review';
  coverage: number;
  lastUpdated: Date;
  translator?: string;
}

interface TranslationKey {
  key: string;
  category: string;
  defaultText: string;
  translations: Record<string, string>;
  context?: string;
  maxLength?: number;
  status: Record<string, 'translated' | 'needs-review' | 'missing'>;
}

interface LocaleSettings {
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
  currency: string;
  firstDayOfWeek: number;
}

const supportedLanguages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    status: 'active',
    coverage: 100,
    lastUpdated: new Date()
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    status: 'active',
    coverage: 95,
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    translator: 'Maria Garcia'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    status: 'active',
    coverage: 92,
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    translator: 'Pierre Dupont'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    status: 'review',
    coverage: 88,
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    translator: 'Hans Schmidt'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr',
    status: 'draft',
    coverage: 75,
    lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    translator: 'Wei Chen'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    status: 'draft',
    coverage: 60,
    lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    translator: 'Ahmed Hassan'
  }
];

const sampleTranslations: TranslationKey[] = [
  {
    key: 'dashboard.title',
    category: 'Navigation',
    defaultText: 'Dashboard',
    translations: {
      es: 'Panel de Control',
      fr: 'Tableau de Bord',
      de: 'Armaturenbrett',
      zh: '仪表板',
      ar: 'لوحة القيادة'
    },
    status: {
      es: 'translated',
      fr: 'translated',
      de: 'translated',
      zh: 'translated',
      ar: 'needs-review'
    }
  },
  {
    key: 'user.add_new',
    category: 'Users',
    defaultText: 'Add New User',
    translations: {
      es: 'Añadir Nuevo Usuario',
      fr: 'Ajouter un Nouvel Utilisateur',
      de: 'Neuen Benutzer Hinzufügen',
      zh: '添加新用户',
      ar: 'إضافة مستخدم جديد'
    },
    context: 'Button text for creating a new user account',
    maxLength: 30,
    status: {
      es: 'translated',
      fr: 'translated',
      de: 'needs-review',
      zh: 'translated',
      ar: 'missing'
    }
  },
  {
    key: 'alert.emergency_lockdown',
    category: 'Security',
    defaultText: 'Emergency Lockdown Activated',
    translations: {
      es: 'Bloqueo de Emergencia Activado',
      fr: 'Verrouillage d\'Urgence Activé',
      de: 'Notverriegelung Aktiviert',
      zh: '紧急锁定已激活',
      ar: 'تم تفعيل الإغلاق الطارئ'
    },
    context: 'Alert message shown during emergency lockdown',
    status: {
      es: 'translated',
      fr: 'translated',
      de: 'translated',
      zh: 'needs-review',
      ar: 'translated'
    }
  }
];

const localeSettings: Record<string, LocaleSettings> = {
  en: {
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    numberFormat: '1,234.56',
    currency: 'USD',
    firstDayOfWeek: 0
  },
  es: {
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: '1.234,56',
    currency: 'EUR',
    firstDayOfWeek: 1
  },
  fr: {
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: '1 234,56',
    currency: 'EUR',
    firstDayOfWeek: 1
  },
  de: {
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    numberFormat: '1.234,56',
    currency: 'EUR',
    firstDayOfWeek: 1
  },
  zh: {
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    numberFormat: '1,234.56',
    currency: 'CNY',
    firstDayOfWeek: 1
  },
  ar: {
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: '١٬٢٣٤٫٥٦',
    currency: 'SAR',
    firstDayOfWeek: 6
  }
};

export function MultiLanguageSupport() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const currentLang = supportedLanguages.find(l => l.code === selectedLanguage);
  
  const filteredTranslations = sampleTranslations.filter(t => {
    const matchesSearch = 
      t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.defaultText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.translations[selectedLanguage] || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || t.status[selectedLanguage] === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'translated':
        return <Badge variant="outline" className="text-green-600 border-green-600">Translated</Badge>;
      case 'needs-review':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Needs Review</Badge>;
      case 'missing':
        return <Badge variant="outline" className="text-red-600 border-red-600">Missing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'review':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'draft':
        return <Edit className="h-4 w-4 text-blue-600" />;
      default:
        return <X className="h-4 w-4 text-gray-600" />;
    }
  };

  const saveTranslation = (key: string, value: string) => {
    // In a real app, this would save to the backend
    console.log(`Saving translation for ${key} in ${selectedLanguage}: ${value}`);
    setEditingKey(null);
    setEditingValue('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Multi-Language Support</h2>
          <p className="text-muted-foreground">
            Manage translations and regional settings for global accessibility
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="translations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="translations">Translations</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        {/* Translations Tab */}
        <TabsContent value="translations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Translation Editor</CardTitle>
                  <CardDescription>Edit and manage translations for each language</CardDescription>
                </div>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.filter(l => l.code !== 'en').map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(lang.status)}
                          {lang.name} ({lang.coverage}%)
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search translations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Navigation">Navigation</SelectItem>
                    <SelectItem value="Users">Users</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="translated">Translated</SelectItem>
                    <SelectItem value="needs-review">Needs Review</SelectItem>
                    <SelectItem value="missing">Missing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Translation List */}
              <div className="space-y-2">
                {filteredTranslations.map((translation) => (
                  <div
                    key={translation.key}
                    className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                              {translation.key}
                            </code>
                            <Badge variant="secondary">{translation.category}</Badge>
                            {getStatusBadge(translation.status[selectedLanguage] || 'missing')}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Default: {translation.defaultText}
                          </p>
                          {translation.context && (
                            <p className="text-xs text-muted-foreground">
                              Context: {translation.context}
                            </p>
                          )}
                        </div>
                        {translation.maxLength && (
                          <Badge variant="outline">Max: {translation.maxLength} chars</Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        {editingKey === translation.key ? (
                          <div className="flex items-center gap-2">
                            <Textarea
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              placeholder="Enter translation..."
                              className="flex-1"
                              rows={2}
                            />
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                onClick={() => saveTranslation(translation.key, editingValue)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingKey(null);
                                  setEditingValue('');
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-muted rounded">
                            <p className={translation.translations[selectedLanguage] ? '' : 'text-muted-foreground italic'}>
                              {translation.translations[selectedLanguage] || 'No translation available'}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingKey(translation.key);
                                setEditingValue(translation.translations[selectedLanguage] || '');
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Supported Languages</CardTitle>
                  <CardDescription>Manage available languages and their status</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportedLanguages.map((lang) => (
                  <div
                    key={lang.code}
                    className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Globe className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{lang.name}</h4>
                            <span className="text-sm text-muted-foreground">({lang.nativeName})</span>
                            <Badge variant="secondary">{lang.code}</Badge>
                            {lang.direction === 'rtl' && (
                              <Badge variant="outline">RTL</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>Coverage: {lang.coverage}%</span>
                            <span>•</span>
                            <span>Last updated: {lang.lastUpdated.toLocaleDateString()}</span>
                            {lang.translator && (
                              <>
                                <span>•</span>
                                <span>Translator: {lang.translator}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(lang.status)}
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={lang.coverage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Localization Tab */}
        <TabsContent value="localization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure locale-specific formats and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(localeSettings).map(([langCode, settings]) => {
                  const lang = supportedLanguages.find(l => l.code === langCode);
                  if (!lang) return null;

                  return (
                    <div key={langCode} className="space-y-4">
                      <h4 className="font-semibold">{lang.name} Locale Settings</h4>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Date Format
                          </Label>
                          <div className="p-3 rounded-lg border bg-muted/50">
                            <p className="font-mono">{settings.dateFormat}</p>
                            <p className="text-xs text-muted-foreground">
                              Example: {new Date().toLocaleDateString(langCode)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Time Format
                          </Label>
                          <div className="p-3 rounded-lg border bg-muted/50">
                            <p className="font-mono">{settings.timeFormat}</p>
                            <p className="text-xs text-muted-foreground">
                              Example: {new Date().toLocaleTimeString(langCode)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Number Format
                          </Label>
                          <div className="p-3 rounded-lg border bg-muted/50">
                            <p className="font-mono">{settings.numberFormat}</p>
                            <p className="text-xs text-muted-foreground">
                              Example: {(1234.56).toLocaleString(langCode)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Currency
                          </Label>
                          <div className="p-3 rounded-lg border bg-muted/50">
                            <p className="font-mono">{settings.currency}</p>
                            <p className="text-xs text-muted-foreground">
                              Example: {new Intl.NumberFormat(langCode, {
                                style: 'currency',
                                currency: settings.currency
                              }).format(1234.56)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            First Day of Week
                          </Label>
                          <div className="p-3 rounded-lg border bg-muted/50">
                            <p className="font-mono">
                              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][settings.firstDayOfWeek]}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Management Tab */}
        <TabsContent value="management" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Translation Workflow</CardTitle>
                <CardDescription>Manage the translation process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <GitBranch className="h-4 w-4 mr-2" />
                    Create Translation Branch
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Assign to Translator
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync with Source
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Translation Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Translation Statistics</CardTitle>
                <CardDescription>Overview of translation progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Keys</span>
                    <span className="font-semibold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Translated</span>
                    <span className="font-semibold text-green-600">1,145</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Needs Review</span>
                    <span className="font-semibold text-orange-600">67</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Missing</span>
                    <span className="font-semibold text-red-600">22</span>
                  </div>
                  <Progress value={93} className="h-3 mt-4" />
                  <p className="text-xs text-muted-foreground text-center">
                    93% Complete
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common translation management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  22 missing translations detected in Spanish. Would you like to use machine translation as a starting point?
                </AlertDescription>
              </Alert>
              <div className="mt-4 flex items-center gap-2">
                <Button>
                  Auto-Translate Missing
                </Button>
                <Button variant="outline">
                  View Missing Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}