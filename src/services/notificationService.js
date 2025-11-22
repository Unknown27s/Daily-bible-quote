import { storageService } from './storageService'

class NotificationService {
    async initialize() {
        // Notifications are only available in native mobile apps
        // Browser version doesn't support scheduled notifications
        console.log('Notification service initialized (browser mode)')
    }

    async scheduleDailyNotification() {
        console.log('Notifications not available in browser mode')
    }

    async updateNotificationTime(hour, minute) {
        storageService.set('notificationTime', { hour, minute })
        console.log(`Notification time set to ${hour}:${minute} (will work when built as mobile app)`)
    }

    async checkPermissions() {
        return false
    }

    async requestPermissions() {
        return false
    }
}

export const notificationService = new NotificationService()
