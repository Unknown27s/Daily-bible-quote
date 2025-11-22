import { useState, useEffect } from 'react'
import { notificationService } from '../services/notificationService'
import { storageService } from '../services/storageService'
import { quoteService } from '../services/quoteService'
import './Settings.css'

export function Settings() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false)
    const [notificationTime, setNotificationTime] = useState({ hour: 9, minute: 0 })
    const [quoteSource, setQuoteSource] = useState('bible')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            const hasPermission = await notificationService.checkPermissions()
            setNotificationsEnabled(hasPermission)

            const savedTime = storageService.get('notificationTime')
            if (savedTime) {
                setNotificationTime(savedTime)
            }

            const savedSource = storageService.get('quoteSource')
            if (savedSource) {
                setQuoteSource(savedSource)
            }
        } catch (error) {
            console.error('Error loading settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleNotificationToggle = async () => {
        if (!notificationsEnabled) {
            const granted = await notificationService.requestPermissions()
            if (granted) {
                setNotificationsEnabled(true)
                await notificationService.scheduleDailyNotification()
            } else {
                alert('Please enable notifications in your device settings')
            }
        } else {
            setNotificationsEnabled(false)
            // Note: We keep the schedule but user can re-enable
        }
    }

    const handleQuoteSourceChange = (source) => {
        setQuoteSource(source)
        quoteService.setQuoteSource(source)
        storageService.set('quoteSource', source)

        // Clear today's cached quote so new source takes effect immediately
        const todayKey = `quote_${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDate()}`
        storageService.remove(todayKey)
    }

    const handleTimeChange = async (hour, minute) => {
        const newTime = { hour: parseInt(hour), minute: parseInt(minute) }
        setNotificationTime(newTime)
        await notificationService.updateNotificationTime(newTime.hour, newTime.minute)
    }

    const formatTime = (hour, minute) => {
        const h = hour.toString().padStart(2, '0')
        const m = minute.toString().padStart(2, '0')
        return `${h}:${m}`
    }

    if (loading) {
        return <div className="settings">Loading settings...</div>
    }

    return (
        <div className="settings">
            <h2>⚙️ Settings</h2>

            <div className="settings-section">
                <h3>Notifications</h3>                <div className="setting-item">
                    <div className="setting-info">
                        <label>Daily Quote Notifications</label>
                        <p className="setting-description">
                            Get a new inspiring quote delivered to you every day
                        </p>
                    </div>
                    <label className="toggle">
                        <input
                            type="checkbox"
                            checked={notificationsEnabled}
                            onChange={handleNotificationToggle}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                {notificationsEnabled && (
                    <div className="setting-item">
                        <div className="setting-info">
                            <label>Notification Time</label>
                            <p className="setting-description">
                                Choose when you'd like to receive your daily quote
                            </p>
                        </div>
                        <div className="time-picker">
                            <input
                                type="time"
                                value={formatTime(notificationTime.hour, notificationTime.minute)}
                                onChange={(e) => {
                                    const [hour, minute] = e.target.value.split(':')
                                    handleTimeChange(hour, minute)
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="settings-section">
                <h3>About</h3>
                <div className="about-info">
                    <p><strong>Daily Bible Verse</strong> v1.0.0</p>
                    <p>A simple PWA to brighten your day with daily Bible verses.</p>
                    <p className="api-credit">
                        Bible verses by <a href="https://bible-api.com" target="_blank" rel="noopener noreferrer">Bible API</a>
                    </p>
                </div>
            </div>

            <div className="settings-section">
                <h3>Data</h3>
                <button
                    className="danger-button"
                    onClick={async () => {
                        if (confirm('Are you sure? This will clear all your favorites and settings.')) {
                            await storageService.clear()
                            window.location.reload()
                        }
                    }}
                >
                    Clear All Data
                </button>
            </div>
        </div>
    )
}
