"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User as UserIcon, 
  Mail, 
  Building, 
  CreditCard, 
  Shield, 
  Camera,
  Upload,
  Check,
  ChevronRight,
  ChevronLeft,
  Save,
  FileUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api/api-service';
import { UserRole, UserStatus, CredentialType } from '@/lib/types';

const userFormSchema = z.object({
  // Step 1: Basic Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  employeeId: z.string().optional(),
  
  // Step 2: Department & Role
  departmentId: z.string().min(1, 'Department is required'),
  role: z.nativeEnum(UserRole),
  jobTitle: z.string().optional(),
  
  // Step 3: Credentials
  credentialType: z.nativeEnum(CredentialType),
  cardNumber: z.string().optional(),
  pin: z.string().min(4).max(8).optional(),
  enableFingerprint: z.boolean().default(false),
  temporaryAccess: z.boolean().default(false),
  validUntil: z.string().optional(),
  
  // Step 4: Access Rights
  accessGroups: z.array(z.string()).min(1, 'At least one access group is required'),
  accessSchedule: z.string().default('standard'),
  customSchedule: z.object({
    monday: z.object({ start: z.string(), end: z.string() }).optional(),
    tuesday: z.object({ start: z.string(), end: z.string() }).optional(),
    wednesday: z.object({ start: z.string(), end: z.string() }).optional(),
    thursday: z.object({ start: z.string(), end: z.string() }).optional(),
    friday: z.object({ start: z.string(), end: z.string() }).optional(),
    saturday: z.object({ start: z.string(), end: z.string() }).optional(),
    sunday: z.object({ start: z.string(), end: z.string() }).optional(),
  }).optional(),
  
  // Step 5: Photo & Review
  photoUrl: z.string().optional(),
  notes: z.string().optional(),
  sendWelcomeEmail: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userFormSchema>;

const steps = [
  { id: 1, title: 'Basic Information', icon: UserIcon },
  { id: 2, title: 'Department & Role', icon: Building },
  { id: 3, title: 'Credentials', icon: CreditCard },
  { id: 4, title: 'Access Rights', icon: Shield },
  { id: 5, title: 'Photo & Review', icon: Camera },
];

interface UserWizardProps {
  onComplete?: (user: any) => void;
  initialData?: Partial<UserFormData>;
  mode?: 'create' | 'edit';
}

export function UserWizard({ onComplete, initialData, mode = 'create' }: UserWizardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      employeeId: '',
      departmentId: '',
      role: UserRole.USER,
      jobTitle: '',
      credentialType: CredentialType.CARD,
      cardNumber: '',
      pin: '',
      enableFingerprint: false,
      temporaryAccess: false,
      validUntil: '',
      accessGroups: [],
      accessSchedule: 'standard',
      photoUrl: '',
      notes: '',
      sendWelcomeEmail: true,
      ...initialData,
    },
  });

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create user via API
      const newUser = await apiService.createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        departmentId: data.departmentId,
        role: data.role,
        status: UserStatus.ACTIVE,
        photoUrl: data.photoUrl,
      });

      // Add credentials
      if (data.credentialType === CredentialType.CARD && data.cardNumber) {
        // In real app, would add credential via API
      }

      toast({
        title: "User created successfully",
        description: `${data.firstName} ${data.lastName} has been added to the system.`,
      });

      if (onComplete) {
        onComplete(newUser);
      } else {
        router.push('/dashboard/users');
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      toast({
        title: "Error creating user",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldsForStep = (step: number): (keyof UserFormData)[] => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email'];
      case 2:
        return ['departmentId', 'role'];
      case 3:
        return ['credentialType'];
      case 4:
        return ['accessGroups'];
      default:
        return [];
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        form.setValue('photoUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {mode === 'create' ? 'Create New User' : 'Edit User'}
          </h2>
          <Badge variant="secondary">
            Step {currentStep} of {steps.length}
          </Badge>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          
          return (
            <div
              key={step.id}
              className="flex items-center"
            >
              <div
                className={`flex items-center justify-center rounded-full p-3 ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isCompleted
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="mx-4 h-4 w-4 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card>
            <CardContent className="pt-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@company.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will be used for login and notifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <Input placeholder="EMP-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Department & Role */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="departmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="dept-1">Engineering</SelectItem>
                            <SelectItem value="dept-2">Sales</SelectItem>
                            <SelectItem value="dept-3">HR</SelectItem>
                            <SelectItem value="dept-4">Finance</SelectItem>
                            <SelectItem value="dept-5">Operations</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={UserRole.USER}>Regular User</SelectItem>
                            <SelectItem value={UserRole.OPERATOR}>Operator</SelectItem>
                            <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                            <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This determines system access permissions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Senior Engineer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Credentials */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="credentialType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Credential Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={CredentialType.CARD} id="card" />
                              <Label htmlFor="card" className="cursor-pointer">
                                Access Card
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={CredentialType.PIN} id="pin" />
                              <Label htmlFor="pin" className="cursor-pointer">
                                PIN Code
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={CredentialType.FINGERPRINT} id="fingerprint" />
                              <Label htmlFor="fingerprint" className="cursor-pointer">
                                Fingerprint
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={CredentialType.TEMPORARY} id="temporary" />
                              <Label htmlFor="temporary" className="cursor-pointer">
                                Temporary Pass
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('credentialType') === CredentialType.CARD && (
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="CARD-000001" {...field} />
                          </FormControl>
                          <FormDescription>
                            Scan the card or enter the number manually
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {form.watch('credentialType') === CredentialType.PIN && (
                    <FormField
                      control={form.control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PIN Code</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="4-8 digits"
                              maxLength={8}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Must be between 4 and 8 digits
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="enableFingerprint"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Enable Fingerprint Authentication</FormLabel>
                            <FormDescription>
                              User can also use fingerprint for access
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="temporaryAccess"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Temporary Access</FormLabel>
                            <FormDescription>
                              Set an expiration date for this credential
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('temporaryAccess') && (
                      <FormField
                        control={form.control}
                        name="validUntil"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valid Until</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Access Rights */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="accessGroups"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Groups</FormLabel>
                        <FormDescription>
                          Select which areas this user can access
                        </FormDescription>
                        <div className="space-y-2">
                          {['Main Building', 'Office Area', 'Server Room', 'Laboratory', 'Storage'].map((group) => (
                            <div key={group} className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.value?.includes(group)}
                                onCheckedChange={(checked) => {
                                  const updated = checked
                                    ? [...(field.value || []), group]
                                    : field.value?.filter((val) => val !== group) || [];
                                  field.onChange(updated);
                                }}
                              />
                              <Label className="cursor-pointer">{group}</Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accessSchedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Schedule</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select schedule" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard Hours (Mon-Fri, 8AM-6PM)</SelectItem>
                            <SelectItem value="extended">Extended Hours (Mon-Fri, 6AM-10PM)</SelectItem>
                            <SelectItem value="24/7">24/7 Access</SelectItem>
                            <SelectItem value="custom">Custom Schedule</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 5: Photo & Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <Avatar className="h-32 w-32 mx-auto mb-4">
                        <AvatarImage src={photoPreview || ''} />
                        <AvatarFallback>
                          {form.watch('firstName')?.[0]}{form.watch('lastName')?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Label htmlFor="photo-upload" className="cursor-pointer">
                          <div className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                            <Upload className="h-4 w-4" />
                            Upload Photo
                          </div>
                        </Label>
                        <Input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                        <p className="text-xs text-muted-foreground">
                          Recommended: 500x500px, max 2MB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-3 font-semibold">Review Information</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Name:</dt>
                        <dd className="font-medium">
                          {form.watch('firstName')} {form.watch('lastName')}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Email:</dt>
                        <dd className="font-medium">{form.watch('email')}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Department:</dt>
                        <dd className="font-medium">
                          {form.watch('departmentId') && 'Engineering'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Role:</dt>
                        <dd className="font-medium">{form.watch('role')}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Credential:</dt>
                        <dd className="font-medium">{form.watch('credentialType')}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Access Groups:</dt>
                        <dd className="font-medium">
                          {form.watch('accessGroups')?.length || 0} selected
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Any special instructions or notes..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sendWelcomeEmail"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Send Welcome Email</FormLabel>
                          <FormDescription>
                            Send credentials and access instructions to the user
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
            
            <CardContent className="border-t pt-6">
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                {currentStep < steps.length ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Save className="mr-2 h-4 w-4 animate-spin" />
                        Creating User...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {mode === 'create' ? 'Create User' : 'Update User'}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}