import { WebSocketMessage, WebSocketMessageType } from '@/lib/types';

// Mock WebSocket implementation for demo purposes
export class MockWebSocket {
  public readyState: number = WebSocket.CONNECTING;
  public onopen: ((event: Event) => void) | null = null;
  public onclose: ((event: CloseEvent) => void) | null = null;
  public onerror: ((event: Event) => void) | null = null;
  public onmessage: ((event: MessageEvent) => void) | null = null;
  
  public static CONNECTING = 0;
  public static OPEN = 1;
  public static CLOSING = 2;
  public static CLOSED = 3;

  constructor(url: string) {
    console.log('MockWebSocket: Simulating connection to', url);
    
    // Simulate connection after a short delay
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
      
      // Start sending mock messages
      this.startMockMessages();
    }, 100);
  }

  close(): void {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
  }

  send(data: string): void {
    console.log('MockWebSocket: Sending', data);
  }

  private startMockMessages(): void {
    // Send mock door status updates
    setInterval(() => {
      if (this.readyState === MockWebSocket.OPEN && this.onmessage) {
        const doorStatuses = ['open', 'closed', 'locked', 'alarm'];
        const randomDoorId = `DOOR-${Math.floor(Math.random() * 10) + 1}`;
        const randomStatus = doorStatuses[Math.floor(Math.random() * doorStatuses.length)];
        
        const message: WebSocketMessage = {
          type: WebSocketMessageType.DOOR_STATUS_UPDATE,
          payload: {
            doorId: randomDoorId,
            status: randomStatus,
            timestamp: new Date().toISOString()
          }
        };
        
        this.onmessage(new MessageEvent('message', { data: JSON.stringify(message) }));
      }
    }, 5000);

    // Send mock access events
    setInterval(() => {
      if (this.readyState === MockWebSocket.OPEN && this.onmessage) {
        const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'];
        const doors = ['Main Entrance', 'Server Room', 'Lab Access', 'Executive Floor'];
        const results = ['granted', 'denied'];
        
        const message: WebSocketMessage = {
          type: WebSocketMessageType.ACCESS_EVENT,
          payload: {
            userId: `USR-${Math.floor(Math.random() * 1000)}`,
            userName: names[Math.floor(Math.random() * names.length)],
            doorName: doors[Math.floor(Math.random() * doors.length)],
            result: results[Math.floor(Math.random() * results.length)],
            timestamp: new Date().toISOString()
          }
        };
        
        this.onmessage(new MessageEvent('message', { data: JSON.stringify(message) }));
      }
    }, 3000);

    // Send mock alerts
    setInterval(() => {
      if (this.readyState === MockWebSocket.OPEN && this.onmessage) {
        const alertTypes = ['door_held_open', 'unauthorized_access', 'system_fault'];
        const severities = ['low', 'medium', 'high', 'critical'];
        
        if (Math.random() > 0.8) { // 20% chance of alert
          const message: WebSocketMessage = {
            type: WebSocketMessageType.ALERT,
            payload: {
              id: `ALERT-${Date.now()}`,
              type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
              severity: severities[Math.floor(Math.random() * severities.length)],
              message: 'Mock security alert for testing',
              timestamp: new Date().toISOString()
            }
          };
          
          this.onmessage(new MessageEvent('message', { data: JSON.stringify(message) }));
        }
      }
    }, 10000);
  }
}

// Export for use in WebSocketInit component