// Push notification utilities
class NotificationManager {
  private registration: ServiceWorkerRegistration | null = null;
  private permission: NotificationPermission = 'default';

  async initialize() {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registered');

      // Request notification permission
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      return false;
    }
  }

  async showNotification(title: string, options: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
    actions?: Array<{
      action: string;
      title: string;
      icon?: string;
    }>;
  } = {}) {
    if (this.permission !== 'granted' || !this.registration) {
      return;
    }

    const defaultOptions = {
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200],
      ...options
    };

    try {
      await this.registration.showNotification(title, defaultOptions);
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  async showChatNotification(senderName: string, message: string, roomId: string, itemTitle?: string) {
    await this.showNotification(`${senderName} sent a message`, {
      body: itemTitle ? `About "${itemTitle}": ${message}` : message,
      tag: `chat_${roomId}`,
      data: { type: 'chat', roomId, senderName },
      actions: [
        { action: 'reply', title: 'Reply' },
        { action: 'view', title: 'View Chat' }
      ]
    });
  }

  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'Notification' in window;
  }

  getPermission(): NotificationPermission {
    return this.permission;
  }
}

export const notificationManager = new NotificationManager();