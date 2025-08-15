import { 
  User, 
  Door, 
  Zone, 
  AccessEvent, 
  Alert,
  Incident,
  UserRole,
  UserStatus,
  DoorStatus,
  AccessResult,
  AlertType,
  AlertSeverity,
  SecurityLevel,
  IncidentType,
  IncidentStatus,
  IncidentSeverity,
  CredentialType,
  CredentialStatus
} from '@/lib/types';

// Generate mock users
export const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  email: `user${i + 1}@company.com`,
  firstName: ['John', 'Jane', 'Michael', 'Sarah', 'David'][i % 5],
  lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i % 5],
  departmentId: `dept-${(i % 5) + 1}`,
  role: [UserRole.USER, UserRole.OPERATOR, UserRole.ADMIN][i % 3],
  status: [UserStatus.ACTIVE, UserStatus.ACTIVE, UserStatus.INACTIVE][i % 3],
  riskScore: Math.floor(Math.random() * 100),
  credentials: [
    {
      id: `cred-${i + 1}-1`,
      userId: `user-${i + 1}`,
      type: CredentialType.CARD,
      value: `CARD-${String(i + 1).padStart(6, '0')}`,
      status: CredentialStatus.ACTIVE,
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2025-12-31'),
      lastUsed: new Date(Date.now() - Math.random() * 86400000),
    }
  ],
  accessGroups: [`group-${(i % 3) + 1}`],
  photoUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${i}`,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  lastActivity: new Date(Date.now() - Math.random() * 3600000),
}));

// Generate mock doors
export const mockDoors: Door[] = Array.from({ length: 30 }, (_, i) => ({
  id: `door-${i + 1}`,
  name: `Door ${String(i + 1).padStart(2, '0')}`,
  location: ['Main Entrance', 'Server Room', 'Office Area', 'Lab', 'Storage'][i % 5],
  floorId: `floor-${Math.floor(i / 10) + 1}`,
  zoneId: `zone-${(i % 5) + 1}`,
  status: [DoorStatus.LOCKED, DoorStatus.UNLOCKED, DoorStatus.OFFLINE][i % 3],
  controllerId: `controller-${Math.floor(i / 5) + 1}`,
  isOnline: i % 3 !== 2,
  lastHeartbeat: new Date(Date.now() - Math.random() * 60000),
  coordinates: {
    x: (i % 5) * 150 + 100,
    y: Math.floor(i / 5) * 100 + 100,
  },
}));

// Generate mock zones
export const mockZones: Zone[] = [
  {
    id: 'zone-1',
    name: 'Main Lobby',
    floorId: 'floor-1',
    securityLevel: SecurityLevel.LOW,
    doors: ['door-1', 'door-2', 'door-3'],
    activeAlerts: 0,
    occupancy: 45,
    maxOccupancy: 100,
  },
  {
    id: 'zone-2',
    name: 'Office Area',
    floorId: 'floor-1',
    securityLevel: SecurityLevel.MEDIUM,
    doors: ['door-4', 'door-5', 'door-6'],
    activeAlerts: 1,
    occupancy: 120,
    maxOccupancy: 150,
  },
  {
    id: 'zone-3',
    name: 'Server Room',
    floorId: 'floor-2',
    securityLevel: SecurityLevel.CRITICAL,
    doors: ['door-7', 'door-8'],
    activeAlerts: 0,
    occupancy: 2,
    maxOccupancy: 10,
  },
  {
    id: 'zone-4',
    name: 'Laboratory',
    floorId: 'floor-2',
    securityLevel: SecurityLevel.HIGH,
    doors: ['door-9', 'door-10', 'door-11'],
    activeAlerts: 2,
    occupancy: 15,
    maxOccupancy: 30,
  },
  {
    id: 'zone-5',
    name: 'Storage Area',
    floorId: 'floor-3',
    securityLevel: SecurityLevel.LOW,
    doors: ['door-12', 'door-13'],
    activeAlerts: 0,
    occupancy: 5,
    maxOccupancy: 20,
  },
];

// Generate mock access events
export const generateMockAccessEvents = (count: number = 100): AccessEvent[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `event-${i + 1}`,
    userId: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
    doorId: mockDoors[Math.floor(Math.random() * mockDoors.length)].id,
    timestamp: new Date(Date.now() - Math.random() * 86400000),
    result: Math.random() > 0.9 ? AccessResult.DENIED : AccessResult.GRANTED,
    credentialType: CredentialType.CARD,
    denialReason: Math.random() > 0.9 ? 'Invalid credential' : undefined,
    anomalyScore: Math.random() * 100,
  }));
};

// Generate mock alerts
export const generateMockAlerts = (count: number = 20): Alert[] => {
  const alertTypes = [AlertType.SECURITY, AlertType.SYSTEM, AlertType.ACCESS, AlertType.EMERGENCY];
  const severities = [AlertSeverity.CRITICAL, AlertSeverity.HIGH, AlertSeverity.MEDIUM, AlertSeverity.LOW];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `alert-${i + 1}`,
    type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    title: [
      'Unauthorized access attempt',
      'Door forced open',
      'System offline',
      'Multiple failed attempts',
      'Tailgating detected'
    ][i % 5],
    message: 'Security alert requiring immediate attention',
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    acknowledged: Math.random() > 0.5,
    acknowledgedBy: Math.random() > 0.5 ? 'admin-1' : undefined,
    acknowledgedAt: Math.random() > 0.5 ? new Date() : undefined,
    relatedEntityId: Math.random() > 0.5 ? `door-${Math.floor(Math.random() * 30) + 1}` : undefined,
    relatedEntityType: 'door',
  }));
};

// Generate mock incidents
export const mockIncidents: Incident[] = [
  {
    id: 'incident-1',
    title: 'Unauthorized Server Room Access Attempt',
    description: 'Multiple failed access attempts detected at Server Room door',
    type: IncidentType.UNAUTHORIZED_ACCESS,
    severity: IncidentSeverity.HIGH,
    status: IncidentStatus.INVESTIGATING,
    reportedBy: 'system',
    assignedTo: 'admin-1',
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 1800000),
    events: ['event-1', 'event-2', 'event-3'],
    evidence: [
      {
        id: 'evidence-1',
        incidentId: 'incident-1',
        type: 'SCREENSHOT',
        description: 'Access log screenshot',
        url: '/evidence/screenshot-1.png',
        uploadedBy: 'admin-1',
        uploadedAt: new Date(Date.now() - 1800000),
      }
    ],
  },
  {
    id: 'incident-2',
    title: 'Tailgating in Main Lobby',
    description: 'Person followed authorized user through main entrance',
    type: IncidentType.TAILGATING,
    severity: IncidentSeverity.MEDIUM,
    status: IncidentStatus.RESOLVED,
    reportedBy: 'operator-1',
    assignedTo: 'admin-2',
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 3600000),
    resolvedAt: new Date(Date.now() - 3600000),
    events: ['event-4', 'event-5'],
    evidence: [],
  },
];

// Generate analytics data
export const generateAccessMetrics = () => {
  const now = new Date();
  const trends = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(now.getTime() - (23 - i) * 3600000),
    value: Math.floor(Math.random() * 100) + 50,
    label: `${i}:00`,
  }));

  return {
    totalAccess: 1250,
    granted: 1180,
    denied: 70,
    anomalies: 15,
    peakHour: '09:00',
    trends,
  };
};

// Generate department data
export const mockDepartments = [
  { id: 'dept-1', name: 'Engineering', userCount: 120 },
  { id: 'dept-2', name: 'Sales', userCount: 80 },
  { id: 'dept-3', name: 'HR', userCount: 30 },
  { id: 'dept-4', name: 'Finance', userCount: 45 },
  { id: 'dept-5', name: 'Operations', userCount: 60 },
];