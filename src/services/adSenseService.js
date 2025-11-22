/**
 * Google AdSense Service
 * Handles AdSense script loading and configuration
 */

class AdSenseService {
    constructor() {
        this.config = {
            publisherId: 'ca-pub-7627314206553844', // Your actual AdSense Publisher ID
            enabled: true, // Enabled with your Publisher ID
            autoAds: true, // Enable automatic ad placement
            testMode: process.env.NODE_ENV === 'development'
        }
        this.scriptLoaded = false
        this.adBlockDetected = false
    }

    /**
     * Initialize AdSense service
     * Call this once in your app initialization
     */
    async initialize() {
        if (!this.config.enabled || this.config.publisherId.includes('YOUR_ADSENSE')) {
            console.log('🟡 AdSense not configured. Add your Publisher ID to enable ads.')
            return false
        }

        try {
            await this.loadAdSenseScript()
            this.detectAdBlock()

            if (this.config.autoAds) {
                this.enableAutoAds()
            }

            console.log('✅ AdSense initialized successfully')
            return true
        } catch (error) {
            console.error('❌ AdSense initialization failed:', error)
            return false
        }
    }

    /**
     * Load the AdSense script dynamically
     */
    loadAdSenseScript() {
        return new Promise((resolve, reject) => {
            if (this.scriptLoaded) {
                resolve()
                return
            }

            const script = document.createElement('script')
            script.async = true
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.config.publisherId}`
            script.crossOrigin = 'anonymous'

            script.onload = () => {
                this.scriptLoaded = true
                window.adsbygoogle = window.adsbygoogle || []
                resolve()
            }

            script.onerror = () => {
                reject(new Error('Failed to load AdSense script'))
            }

            document.head.appendChild(script)
        })
    }

    /**
     * Enable Google Auto Ads
     */
    enableAutoAds() {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({
                    google_ad_client: this.config.publisherId,
                    enable_page_level_ads: true
                })
                console.log('🤖 AdSense Auto Ads enabled')
            } catch (error) {
                console.error('Failed to enable Auto Ads:', error)
            }
        }
    }

    /**
     * Detect if ad blocker is active
     */
    detectAdBlock() {
        const testAd = document.createElement('div')
        testAd.innerHTML = '&nbsp;'
        testAd.className = 'adsbox'
        testAd.style.cssText = 'position:absolute;left:-9999px;'

        document.body.appendChild(testAd)

        setTimeout(() => {
            if (testAd.offsetHeight === 0) {
                this.adBlockDetected = true
                console.log('🚫 Ad blocker detected')
            }
            document.body.removeChild(testAd)
        }, 100)
    }

    /**
     * Push an ad unit to be rendered
     */
    pushAd() {
        if (!this.scriptLoaded || this.adBlockDetected) {
            return false
        }

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
            return true
        } catch (error) {
            console.error('Failed to push ad:', error)
            return false
        }
    }

    /**
     * Configure AdSense (call this with your actual Publisher ID)
     */
    configure(publisherId, options = {}) {
        this.config.publisherId = publisherId
        this.config.enabled = true
        this.config = { ...this.config, ...options }

        console.log('✅ AdSense configured with Publisher ID:', publisherId)
    }

    /**
     * Check if AdSense is properly configured
     */
    isConfigured() {
        return this.config.enabled && !this.config.publisherId.includes('YOUR_ADSENSE')
    }

    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config }
    }

    /**
     * Check if ad blocker is detected
     */
    isAdBlockDetected() {
        return this.adBlockDetected
    }
}

// Export singleton instance
export const adSenseService = new AdSenseService()