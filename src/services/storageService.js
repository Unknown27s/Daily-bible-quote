// Simple storage service using localStorage
// For native apps, Capacitor Preferences can be added later
class StorageService {
    get(key) {
        try {
            const value = localStorage.getItem(key)
            return value ? JSON.parse(value) : null
        } catch (error) {
            console.error('Storage get error:', error)
            return null
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error('Storage set error:', error)
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error('Storage remove error:', error)
        }
    }

    clear() {
        try {
            localStorage.clear()
        } catch (error) {
            console.error('Storage clear error:', error)
        }
    }
}

export const storageService = new StorageService()