import { useEffect, useState } from 'react'

// AdSense Configuration - Replace with your actual Publisher ID
const ADSENSE_CONFIG = {
    publisherId: 'ca-pub-YOUR_ADSENSE_CLIENT_ID', // Replace this with your actual AdSense Publisher ID
    enabled: false // Set to true after adding your Publisher ID
}

export function AdBanner({
    adSlot = 'auto',
    format = 'auto',
    style = {},
    className = '',
    responsive = true
}) {
    const [adLoaded, setAdLoaded] = useState(false)
    const [adError, setAdError] = useState(null)

    useEffect(() => {
        // Don't load ads if not configured or disabled
        if (!ADSENSE_CONFIG.enabled || ADSENSE_CONFIG.publisherId.includes('YOUR_ADSENSE')) {
            console.log('AdSense not configured. Add your Publisher ID to enable ads.')
            return
        }

        const loadAd = async () => {
            try {
                // Ensure AdSense script is loaded
                if (typeof window !== 'undefined' && window.adsbygoogle) {
                    // Push ad configuration
                    (window.adsbygoogle = window.adsbygoogle || []).push({})
                    setAdLoaded(true)
                } else {
                    console.warn('AdSense script not loaded yet')
                }
            } catch (error) {
                console.error('AdSense loading error:', error)
                setAdError(error.message)
            }
        }

        // Small delay to ensure DOM is ready
        const timer = setTimeout(loadAd, 100)
        return () => clearTimeout(timer)
    }, [adSlot])

    // Don't render if AdSense is not configured
    if (!ADSENSE_CONFIG.enabled || ADSENSE_CONFIG.publisherId.includes('YOUR_ADSENSE')) {
        return (
            <div className={`ad-placeholder ${className}`} style={{
                margin: '20px 0',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f5f5f5',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                color: '#666',
                fontSize: '14px',
                ...style
            }}>
                <p>📢 Ad Space</p>
                <p>Configure AdSense in AdBanner.jsx to show ads</p>
            </div>
        )
    }

    // Show error state
    if (adError) {
        return (
            <div className={`ad-error ${className}`} style={{
                margin: '20px 0',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '4px',
                color: '#856404',
                fontSize: '12px',
                ...style
            }}>
                Ad loading failed: {adError}
            </div>
        )
    }

    return (
        <div className={`ad-container ${className}`} style={{
            margin: '20px 0',
            textAlign: 'center',
            ...style
        }}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={ADSENSE_CONFIG.publisherId}
                data-ad-slot={adSlot !== 'auto' ? adSlot : undefined}
                data-ad-format={format}
                data-full-width-responsive={responsive.toString()}
            ></ins>
            {!adLoaded && (
                <div style={{
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '4px',
                    color: '#6c757d',
                    fontSize: '12px'
                }}>
                    Loading ad...
                </div>
            )}
        </div>
    )
}
