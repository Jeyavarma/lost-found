import { io, Socket } from 'socket.io-client';
import { getAuthToken } from './auth';
import { BACKEND_URL } from './config';
import { messageQueue, type QueuedMessage } from './messageQueue';
import { chatHealth } from './chatConnection';

class SocketManager {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageCallbacks: Map<string, (status: 'sent' | 'failed') => void> = new Map();
  private processingQueue = false;

  connect(): Socket | null {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = getAuthToken();
    if (!token) {
      console.warn('No auth token found, cannot connect to chat');
      return null;
    }

    try {
      const socketOptions = {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
        withCredentials: true,
        upgrade: true,
        rememberUpgrade: true
      };

      // Add production-specific options
      if (process.env.NODE_ENV === 'production') {
        socketOptions.secure = true;
        socketOptions.rejectUnauthorized = false;
      }

      this.socket = io(BACKEND_URL, socketOptions);

      this.socket.on('connect', () => {
        console.log('Connected to chat server at:', BACKEND_URL);
        this.reconnectAttempts = 0;
        this.processQueuedMessages();
        chatHealth.startHealthCheck(this.socket);
      });

      // Handle pong responses
      this.socket.on('pong', (timestamp) => {
        const latency = Date.now() - timestamp;
        console.log(`Chat server latency: ${latency}ms`);
      });

      // Listen for message delivery confirmations
      this.socket.on('message_delivered', (data: { messageId: string, serverMessageId: string }) => {
        const callback = this.messageCallbacks.get(data.messageId);
        if (callback) {
          callback('sent');
          this.messageCallbacks.delete(data.messageId);
        }
        messageQueue.markAsSent(data.messageId);
      });

      this.socket.on('message_failed', (data: { messageId: string, error: string }) => {
        const callback = this.messageCallbacks.get(data.messageId);
        if (callback) {
          callback('failed');
          this.messageCallbacks.delete(data.messageId);
        }
        messageQueue.markAsFailed(data.messageId);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from chat server:', reason);
        chatHealth.stopHealthCheck();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Chat connection error:', error);
        this.handleReconnect();
      });

      return this.socket;
    } catch (error) {
      console.error('Failed to create socket connection:', error);
      return null;
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.socket) {
      chatHealth.stopHealthCheck();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Get connection health status
  getHealthStatus() {
    return chatHealth.getConnectionStatus();
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Send message with offline queue support
  sendMessage(
    roomId: string, 
    content: string, 
    type: 'text' | 'image' = 'text',
    callback?: (status: 'sent' | 'failed') => void
  ): string {
    const messageId = messageQueue.addMessage(roomId, content, type);
    
    if (callback) {
      this.messageCallbacks.set(messageId, callback);
    }

    if (this.isConnected()) {
      this.sendQueuedMessage({ id: messageId, roomId, content, type, timestamp: Date.now(), status: 'pending', retryCount: 0 });
    }

    return messageId;
  }

  // Process all queued messages when connection is restored
  private async processQueuedMessages() {
    if (this.processingQueue || !this.isConnected()) return;
    
    this.processingQueue = true;
    const pendingMessages = messageQueue.getAllPending();
    
    for (const message of pendingMessages) {
      await this.sendQueuedMessage(message);
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.processingQueue = false;
  }

  // Send individual queued message
  private sendQueuedMessage(message: QueuedMessage) {
    if (!this.socket || !this.isConnected()) {
      return;
    }

    messageQueue.updateStatus(message.id, 'sending');
    
    this.socket.emit('send_message', {
      messageId: message.id,
      roomId: message.roomId,
      content: message.content,
      type: message.type
    });
  }

  // Get pending messages for a room (for UI display)
  getPendingMessages(roomId: string): QueuedMessage[] {
    return messageQueue.getPendingMessages(roomId);
  }

  // Clear message queue for a room
  clearMessageQueue(roomId: string) {
    messageQueue.clearRoom(roomId);
  }
}

export const socketManager = new SocketManager();
export default socketManager;
export type { QueuedMessage };