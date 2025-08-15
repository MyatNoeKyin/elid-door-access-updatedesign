import { 
  User, 
  Door, 
  Zone, 
  AccessEvent, 
  Alert, 
  Incident,
  ComplianceReport,
  AccessMetrics
} from '@/lib/types';
import {
  mockUsers,
  mockDoors,
  mockZones,
  mockIncidents,
  generateMockAccessEvents,
  generateMockAlerts,
  generateAccessMetrics
} from './mock-data';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  // User Management APIs
  async getUsers(): Promise<User[]> {
    await delay(500);
    return mockUsers;
  }

  async getUser(id: string): Promise<User | null> {
    await delay(300);
    return mockUsers.find(user => user.id === id) || null;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    await delay(500);
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      departmentId: userData.departmentId || 'dept-1',
      role: userData.role || 'USER',
      status: userData.status || 'ACTIVE',
      riskScore: 0,
      credentials: [],
      accessGroups: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData
    } as User;
    
    mockUsers.push(newUser);
    return newUser;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    await delay(500);
    const index = mockUsers.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    mockUsers[index] = { ...mockUsers[index], ...userData, updatedAt: new Date() };
    return mockUsers[index];
  }

  async deleteUser(id: string): Promise<boolean> {
    await delay(500);
    const index = mockUsers.findIndex(user => user.id === id);
    if (index === -1) return false;
    
    mockUsers.splice(index, 1);
    return true;
  }

  // Door Management APIs
  async getDoors(): Promise<Door[]> {
    await delay(500);
    return mockDoors;
  }

  async getDoor(id: string): Promise<Door | null> {
    await delay(300);
    return mockDoors.find(door => door.id === id) || null;
  }

  async updateDoorStatus(id: string, status: any): Promise<Door | null> {
    await delay(200);
    const door = mockDoors.find(d => d.id === id);
    if (!door) return null;
    
    door.status = status;
    door.lastHeartbeat = new Date();
    return door;
  }

  async lockAllDoors(zoneIds?: string[]): Promise<Door[]> {
    await delay(500);
    const doorsToLock = zoneIds 
      ? mockDoors.filter(door => zoneIds.includes(door.zoneId))
      : mockDoors;
    
    doorsToLock.forEach(door => {
      door.status = 'LOCKED';
      door.lastHeartbeat = new Date();
    });
    
    return doorsToLock;
  }

  // Zone Management APIs
  async getZones(): Promise<Zone[]> {
    await delay(500);
    return mockZones;
  }

  async getZone(id: string): Promise<Zone | null> {
    await delay(300);
    return mockZones.find(zone => zone.id === id) || null;
  }

  // Access Event APIs
  async getAccessEvents(filters?: {
    userId?: string;
    doorId?: string;
    startDate?: Date;
    endDate?: Date;
    result?: string;
  }): Promise<AccessEvent[]> {
    await delay(500);
    let events = generateMockAccessEvents(100);
    
    if (filters) {
      if (filters.userId) {
        events = events.filter(e => e.userId === filters.userId);
      }
      if (filters.doorId) {
        events = events.filter(e => e.doorId === filters.doorId);
      }
      if (filters.result) {
        events = events.filter(e => e.result === filters.result);
      }
      if (filters.startDate) {
        events = events.filter(e => e.timestamp >= filters.startDate);
      }
      if (filters.endDate) {
        events = events.filter(e => e.timestamp <= filters.endDate);
      }
    }
    
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Alert APIs
  async getAlerts(unacknowledgedOnly?: boolean): Promise<Alert[]> {
    await delay(500);
    let alerts = generateMockAlerts(20);
    
    if (unacknowledgedOnly) {
      alerts = alerts.filter(alert => !alert.acknowledged);
    }
    
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async acknowledgeAlert(id: string, userId: string): Promise<Alert | null> {
    await delay(300);
    // In real implementation, this would update the database
    return {
      id,
      type: 'SECURITY',
      severity: 'HIGH',
      title: 'Alert acknowledged',
      message: 'Alert has been acknowledged',
      timestamp: new Date(),
      acknowledged: true,
      acknowledgedBy: userId,
      acknowledgedAt: new Date(),
    } as Alert;
  }

  // Incident APIs
  async getIncidents(): Promise<Incident[]> {
    await delay(500);
    return mockIncidents;
  }

  async getIncident(id: string): Promise<Incident | null> {
    await delay(300);
    return mockIncidents.find(incident => incident.id === id) || null;
  }

  async createIncident(incidentData: Partial<Incident>): Promise<Incident> {
    await delay(500);
    const newIncident: Incident = {
      id: `incident-${Date.now()}`,
      title: incidentData.title || '',
      description: incidentData.description || '',
      type: incidentData.type || 'OTHER',
      severity: incidentData.severity || 'MEDIUM',
      status: incidentData.status || 'OPEN',
      reportedBy: incidentData.reportedBy || 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      events: [],
      evidence: [],
      ...incidentData
    } as Incident;
    
    mockIncidents.push(newIncident);
    return newIncident;
  }

  async updateIncident(id: string, incidentData: Partial<Incident>): Promise<Incident | null> {
    await delay(500);
    const index = mockIncidents.findIndex(incident => incident.id === id);
    if (index === -1) return null;
    
    mockIncidents[index] = { 
      ...mockIncidents[index], 
      ...incidentData, 
      updatedAt: new Date() 
    };
    return mockIncidents[index];
  }

  // Analytics APIs
  async getAccessMetrics(period?: { start: Date; end: Date }): Promise<AccessMetrics> {
    await delay(500);
    return generateAccessMetrics();
  }

  async getComplianceReport(period: { start: Date; end: Date }): Promise<ComplianceReport> {
    await delay(1000);
    return {
      id: `report-${Date.now()}`,
      title: 'Monthly Compliance Report',
      period,
      score: 92,
      violations: [
        {
          id: 'violation-1',
          type: 'ACCESS_POLICY',
          description: 'User accessed restricted area outside allowed hours',
          severity: 'MEDIUM',
          timestamp: new Date(Date.now() - 86400000),
          userId: 'user-5',
          resolved: false,
        },
        {
          id: 'violation-2',
          type: 'CREDENTIAL_EXPIRY',
          description: 'Multiple users with expired credentials',
          severity: 'LOW',
          timestamp: new Date(Date.now() - 172800000),
          resolved: true,
        },
      ],
      generatedAt: new Date(),
      generatedBy: 'system',
    };
  }

  // Search APIs
  async searchUsers(query: string): Promise<User[]> {
    await delay(300);
    const lowercaseQuery = query.toLowerCase();
    return mockUsers.filter(user => 
      user.firstName.toLowerCase().includes(lowercaseQuery) ||
      user.lastName.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery)
    );
  }

  async searchDoors(query: string): Promise<Door[]> {
    await delay(300);
    const lowercaseQuery = query.toLowerCase();
    return mockDoors.filter(door => 
      door.name.toLowerCase().includes(lowercaseQuery) ||
      door.location.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    await delay(500);
    const user = mockUsers.find(u => u.email === email);
    if (!user) return null;
    
    // Mock authentication
    return {
      user,
      token: `mock-jwt-token-${Date.now()}`,
    };
  }

  async logout(): Promise<void> {
    await delay(200);
    // Clear any session data
  }

  // System APIs
  async getSystemHealth(): Promise<{
    status: string;
    uptime: number;
    activeConnections: number;
    cpuUsage: number;
    memoryUsage: number;
  }> {
    await delay(300);
    return {
      status: 'healthy',
      uptime: 99.98,
      activeConnections: Math.floor(Math.random() * 100) + 50,
      cpuUsage: Math.floor(Math.random() * 50) + 20,
      memoryUsage: Math.floor(Math.random() * 60) + 30,
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();