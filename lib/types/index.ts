// Core type definitions for ELID Access Control System

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  role: UserRole;
  status: UserStatus;
  riskScore: number;
  credentials: Credential[];
  accessGroups: string[];
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastActivity?: Date;
}

export interface Credential {
  id: string;
  userId: string;
  type: CredentialType;
  value: string;
  status: CredentialStatus;
  validFrom: Date;
  validUntil?: Date;
  lastUsed?: Date;
}

export interface Door {
  id: string;
  name: string;
  location: string;
  floorId: string;
  zoneId: string;
  status: DoorStatus;
  controllerId: string;
  isOnline: boolean;
  lastHeartbeat?: Date;
  coordinates?: { x: number; y: number };
}

export interface AccessEvent {
  id: string;
  userId: string;
  doorId: string;
  timestamp: Date;
  result: AccessResult;
  credentialType: CredentialType;
  denialReason?: string;
  anomalyScore?: number;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface Zone {
  id: string;
  name: string;
  floorId: string;
  securityLevel: SecurityLevel;
  doors: string[];
  activeAlerts: number;
  occupancy: number;
  maxOccupancy: number;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  events: string[];
  evidence: Evidence[];
}

export interface Evidence {
  id: string;
  incidentId: string;
  type: EvidenceType;
  description: string;
  url?: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// Enums
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER',
  USER = 'USER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING'
}

export enum CredentialType {
  CARD = 'CARD',
  PIN = 'PIN',
  FINGERPRINT = 'FINGERPRINT',
  TEMPORARY = 'TEMPORARY'
}

export enum CredentialStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOST = 'LOST',
  EXPIRED = 'EXPIRED'
}

export enum DoorStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  FORCED_OPEN = 'FORCED_OPEN',
  HELD_OPEN = 'HELD_OPEN',
  OFFLINE = 'OFFLINE'
}

export enum AccessResult {
  GRANTED = 'GRANTED',
  DENIED = 'DENIED'
}

export enum AlertType {
  SECURITY = 'SECURITY',
  SYSTEM = 'SYSTEM',
  ACCESS = 'ACCESS',
  EMERGENCY = 'EMERGENCY'
}

export enum AlertSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO'
}

export enum SecurityLevel {
  PUBLIC = 'PUBLIC',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum IncidentType {
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  FORCED_ENTRY = 'FORCED_ENTRY',
  TAILGATING = 'TAILGATING',
  CREDENTIAL_MISUSE = 'CREDENTIAL_MISUSE',
  SYSTEM_BREACH = 'SYSTEM_BREACH',
  OTHER = 'OTHER'
}

export enum IncidentSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum EvidenceType {
  SCREENSHOT = 'SCREENSHOT',
  LOG_FILE = 'LOG_FILE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER'
}

// WebSocket message types
export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
  timestamp: Date;
}

export enum WebSocketMessageType {
  DOOR_STATUS_UPDATE = 'DOOR_STATUS_UPDATE',
  ACCESS_EVENT = 'ACCESS_EVENT',
  NEW_ALERT = 'NEW_ALERT',
  ALERT_UPDATE = 'ALERT_UPDATE',
  SYSTEM_STATUS = 'SYSTEM_STATUS',
  EMERGENCY_LOCKDOWN = 'EMERGENCY_LOCKDOWN',
  USER_ACTIVITY = 'USER_ACTIVITY'
}

// Analytics types
export interface AccessMetrics {
  totalAccess: number;
  granted: number;
  denied: number;
  anomalies: number;
  peakHour: string;
  trends: TrendData[];
}

export interface TrendData {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface ComplianceReport {
  id: string;
  title: string;
  period: { start: Date; end: Date };
  score: number;
  violations: ComplianceViolation[];
  generatedAt: Date;
  generatedBy: string;
}

export interface ComplianceViolation {
  id: string;
  type: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: Date;
  userId?: string;
  resolved: boolean;
}

// Theme types
export interface Theme {
  name: string;
  mode: 'light' | 'dark' | 'high-contrast';
  colors: ThemeColors;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
}

// Settings types
export interface UserPreferences {
  theme: string;
  language: string;
  notifications: NotificationPreferences;
  dashboard: DashboardPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sound: boolean;
  alertTypes: AlertType[];
}

export interface DashboardPreferences {
  layout: string;
  widgets: DashboardWidget[];
  refreshInterval: number;
}

export interface DashboardWidget {
  id: string;
  type: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
}