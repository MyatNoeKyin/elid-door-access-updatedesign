import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  User, 
  Alert, 
  Door, 
  AccessEvent, 
  Zone,
  Incident,
  UserPreferences,
  Theme
} from '@/lib/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

interface AlertState {
  alerts: Alert[];
  unacknowledgedCount: number;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string, userId: string) => void;
  clearAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
}

interface DoorState {
  doors: Door[];
  doorStatus: Record<string, Door>;
  updateDoor: (door: Door) => void;
  updateMultipleDoors: (doors: Door[]) => void;
  setDoors: (doors: Door[]) => void;
}

interface AccessEventState {
  recentEvents: AccessEvent[];
  addEvent: (event: AccessEvent) => void;
  setEvents: (events: AccessEvent[]) => void;
  clearOldEvents: (keepLast: number) => void;
}

interface ZoneState {
  zones: Zone[];
  activeZone: Zone | null;
  setZones: (zones: Zone[]) => void;
  updateZone: (zone: Zone) => void;
  setActiveZone: (zone: Zone | null) => void;
}

interface IncidentState {
  incidents: Incident[];
  activeIncident: Incident | null;
  addIncident: (incident: Incident) => void;
  updateIncident: (incident: Incident) => void;
  setActiveIncident: (incident: Incident | null) => void;
  setIncidents: (incidents: Incident[]) => void;
}

interface PreferencesState {
  preferences: UserPreferences;
  theme: Theme;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setTheme: (theme: Theme) => void;
}

interface EmergencyState {
  isEmergencyMode: boolean;
  emergencyZones: string[];
  activateEmergency: (zones?: string[]) => void;
  deactivateEmergency: () => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        login: (user) => set({ user, isAuthenticated: true }),
        logout: () => set({ user: null, isAuthenticated: false }),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);

// Alert Store
export const useAlertStore = create<AlertState>()(
  devtools(
    (set, get) => ({
      alerts: [],
      unacknowledgedCount: 0,
      addAlert: (alert) => 
        set((state) => ({
          alerts: [alert, ...state.alerts].slice(0, 100), // Keep last 100 alerts
          unacknowledgedCount: state.unacknowledgedCount + (alert.acknowledged ? 0 : 1),
        })),
      acknowledgeAlert: (alertId, userId) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === alertId
              ? { ...alert, acknowledged: true, acknowledgedBy: userId, acknowledgedAt: new Date() }
              : alert
          ),
          unacknowledgedCount: Math.max(0, state.unacknowledgedCount - 1),
        })),
      clearAlert: (alertId) =>
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== alertId),
          unacknowledgedCount: state.unacknowledgedCount - 
            (state.alerts.find(a => a.id === alertId && !a.acknowledged) ? 1 : 0),
        })),
      clearAllAlerts: () => set({ alerts: [], unacknowledgedCount: 0 }),
    }),
    {
      name: 'alert-store',
    }
  )
);

// Door Store
export const useDoorStore = create<DoorState>()(
  devtools(
    (set) => ({
      doors: [],
      doorStatus: {},
      updateDoor: (door) =>
        set((state) => ({
          doors: state.doors.map((d) => (d.id === door.id ? door : d)),
          doorStatus: { ...state.doorStatus, [door.id]: door },
        })),
      updateMultipleDoors: (doors) =>
        set((state) => {
          const updatedDoors = [...state.doors];
          const updatedStatus = { ...state.doorStatus };
          
          doors.forEach((door) => {
            const index = updatedDoors.findIndex((d) => d.id === door.id);
            if (index !== -1) {
              updatedDoors[index] = door;
            } else {
              updatedDoors.push(door);
            }
            updatedStatus[door.id] = door;
          });
          
          return { doors: updatedDoors, doorStatus: updatedStatus };
        }),
      setDoors: (doors) => {
        const doorStatus = doors.reduce((acc, door) => {
          acc[door.id] = door;
          return acc;
        }, {} as Record<string, Door>);
        set({ doors, doorStatus });
      },
    }),
    {
      name: 'door-store',
    }
  )
);

// Access Event Store
export const useAccessEventStore = create<AccessEventState>()(
  devtools(
    (set) => ({
      recentEvents: [],
      addEvent: (event) =>
        set((state) => ({
          recentEvents: [event, ...state.recentEvents].slice(0, 1000), // Keep last 1000 events
        })),
      setEvents: (events) => set({ recentEvents: events }),
      clearOldEvents: (keepLast) =>
        set((state) => ({
          recentEvents: state.recentEvents.slice(0, keepLast),
        })),
    }),
    {
      name: 'access-event-store',
    }
  )
);

// Zone Store
export const useZoneStore = create<ZoneState>()(
  devtools(
    (set) => ({
      zones: [],
      activeZone: null,
      setZones: (zones) => set({ zones }),
      updateZone: (zone) =>
        set((state) => ({
          zones: state.zones.map((z) => (z.id === zone.id ? zone : z)),
          activeZone: state.activeZone?.id === zone.id ? zone : state.activeZone,
        })),
      setActiveZone: (zone) => set({ activeZone: zone }),
    }),
    {
      name: 'zone-store',
    }
  )
);

// Incident Store
export const useIncidentStore = create<IncidentState>()(
  devtools(
    (set) => ({
      incidents: [],
      activeIncident: null,
      addIncident: (incident) =>
        set((state) => ({
          incidents: [incident, ...state.incidents],
        })),
      updateIncident: (incident) =>
        set((state) => ({
          incidents: state.incidents.map((i) => (i.id === incident.id ? incident : i)),
          activeIncident: state.activeIncident?.id === incident.id ? incident : state.activeIncident,
        })),
      setActiveIncident: (incident) => set({ activeIncident: incident }),
      setIncidents: (incidents) => set({ incidents }),
    }),
    {
      name: 'incident-store',
    }
  )
);

// Preferences Store
export const usePreferencesStore = create<PreferencesState>()(
  devtools(
    persist(
      (set) => ({
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: {
            email: true,
            push: true,
            sound: true,
            alertTypes: ['SECURITY', 'EMERGENCY'],
          },
          dashboard: {
            layout: 'default',
            widgets: [],
            refreshInterval: 30000,
          },
        },
        theme: {
          name: 'dark',
          mode: 'dark',
          colors: {
            primary: '#3B82F6',
            secondary: '#8B5CF6',
            background: '#0F172A',
            surface: '#1E293B',
            error: '#DC2626',
            warning: '#F59E0B',
            success: '#10B981',
            info: '#3B82F6',
            text: {
              primary: '#F8FAFC',
              secondary: '#CBD5E1',
              disabled: '#64748B',
            },
            border: '#334155',
          },
        },
        updatePreferences: (preferences) =>
          set((state) => ({
            preferences: { ...state.preferences, ...preferences },
          })),
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'preferences-storage',
      }
    )
  )
);

// Emergency Store
export const useEmergencyStore = create<EmergencyState>()(
  devtools(
    (set) => ({
      isEmergencyMode: false,
      emergencyZones: [],
      activateEmergency: (zones = []) =>
        set({
          isEmergencyMode: true,
          emergencyZones: zones,
        }),
      deactivateEmergency: () =>
        set({
          isEmergencyMode: false,
          emergencyZones: [],
        }),
    }),
    {
      name: 'emergency-store',
    }
  )
);