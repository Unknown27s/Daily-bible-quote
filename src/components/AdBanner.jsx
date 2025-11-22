import { useEffect } from 'react'

export function AdBanner({ adSlot, format = 'auto', style = {} }) {
    useEffect(() => {
        try {
            if (window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({})
            }
        } catch (e) {
            console.error('AdSense error:', e)
        }
    }, [])

    return (
        <div className="ad-container" style={{ margin: '20px 0', textAlign: 'center', ...style }}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-YOUR_ADSENSE_CLIENT_ID"
                data-ad-slot={adSlot}
                data-ad-format={format}
                data-full-width-responsive="true"
            ></ins>
        </div>
    )
}
