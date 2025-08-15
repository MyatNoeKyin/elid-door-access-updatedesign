import { WebSocketMessage, WebSocketMessageType } from '@/lib/types';

type MessageHandler = (message: WebSocketMessage) => void;

// Disabled WebSocket service for demo - simulates connection without actual WebSocket
export class DisabledWebSocketService {
  private messageHandlers: Map<WebSocketMessageType, Set<MessageHandler>> = new Map();
  private connected: boolean = false;
  private simulationInterval: NodeJS.Timeout | null = null;

  connect(): Promise<void> {
    return new Promise((resolve) => {
      // Simulate connection delay
      setTimeout(() => {
        this.connected = true;
        console.log('Demo mode: Simulated WebSocket connected');
        this.startSimulation();
        resolve();
      }, 500);
    });
  }

  disconnect(): void {
    this.connected = false;
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.messageHandlers.clear();
    console.log('Demo mode: Simulated WebSocket disconnected');
  }

  send(message: WebSocketMessage): void {
    console.log('Demo mode: Would send message:', message);
  }

  subscribe(type: WebSocketMessageType, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }

    this.messageHandlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.messageHandlers.delete(type);
        }
      }
    };
  }

  isConnected(): boolean {
    return this.connected;
  }

  getConnectionState(): string {
    return this.connected ? 'CONNECTED' : 'DISCONNECTED';
  }

  private startSimulation(): void {
    // Simulate periodic messages
    this.simulationInterval = setInterval(() => {
      if (!this.connected) return;

      // Randomly send different types of messages
      const random = Math.random();
      
      if (random < 0.3) {
        // Door status update
        this.simulateMessage({
          type: WebSocketMessageType.DOOR_STATUS_UPDATE,
          payload: {
            doorId: `DOOR-${Math.floor(Math.random() * 10) + 1}`,
            status: ['open', 'closed', 'locked'][Math.floor(Math.random() * 3)],
            timestamp: new Date().toISOString()
          }
        });
      } else if (random < 0.6) {
        // Access event
        this.simulateMessage({
          type: WebSocketMessageType.ACCESS_EVENT,
          payload: {
            userId: `USR-${Math.floor(Math.random() * 1000)}`,
            userName: ['John Doe', 'Jane Smith', 'Bob Johnson'][Math.floor(Math.random() * 3)],
            doorName: ['Main Entrance', 'Server Room', 'Lab'][Math.floor(Math.random() * 3)],
            result: Math.random() > 0.2 ? 'granted' : 'denied',
            timestamp: new Date().toISOString()
          }
        });
      } else if (random < 0.7) {
        // Alert
        this.simulateMessage({
          type: WebSocketMessageType.ALERT,
          payload: {
            id: `ALERT-${Date.now()}`,
            type: 'security_alert',
            severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            message: 'Demo security alert',
            timestamp: new Date().toISOString()
          }
        });
      }
    }, 3000);
  }

  private simulateMessage(message: WebSocketMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    }
  }
}

// Singleton instance
let wsInstance: DisabledWebSocketService | null = null;

export function getWebSocketService(): DisabledWebSocketService {
  if (!wsInstance) {
    wsInstance = new DisabledWebSocketService();
  }
  return wsInstance;
}