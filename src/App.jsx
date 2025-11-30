import { useState, useEffect, useCallback } from 'react'
import { QuoteFeed } from './components/QuoteFeed'
import { Settings } from './components/Settings'
import { QuoteHistory } from './components/QuoteHistory'
import { AdBanner } from './components/AdBanner'
import { quoteService } from './services/quoteService'
import { notificationService } from './services/notificationService'
import { storageService } from './services/storageService'
import { adSenseService } from './services/adSenseService'
import './App.css'

function App() {
    const [quote, setQuote] = useState(null)
    const [loading, setLoading] = useState(true)
    const [theme, setTheme] = useState('light')
    const [view, setView] = useState('home') // home, history, settings
    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        initializeApp()
    }, [])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    const initializeApp = async () => {
        try {
            // Load theme preference
            const savedTheme = storageService.get('theme')
            if (savedTheme) setTheme(savedTheme)

            // Load favorites
            const savedFavorites = storageService.get('favorites')
            if (savedFavorites) setFavorites(savedFavorites)

            // Initialize services
            notificationService.initialize()

            // Initialize AdSense (will only work if properly configured)
            await adSenseService.initialize()

            // Load today's quote
            await loadTodaysQuote()
        } catch (error) {
            console.error('Initialization error:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadTodaysQuote = async () => {
        setLoading(true)
        try {
            const newQuote = await quoteService.getDailyQuote()
            setQuote(newQuote)
        } catch (error) {
            console.error('Error loading quote:', error)
            // Try to load from cache
            const cachedQuotes = storageService.get('cachedQuotes')
            if (cachedQuotes && cachedQuotes.length > 0) {
                setQuote(cachedQuotes[0])
            }
        } finally {
            setLoading(false)
        }
    }

    const toggleFavorite = (quoteToToggle) => {
        const isFavorited = favorites.some(fav => fav._id === quoteToToggle._id)
        let newFavorites

        if (isFavorited) {
            newFavorites = favorites.filter(fav => fav._id !== quoteToToggle._id)
        } else {
            newFavorites = [...favorites, quoteToToggle]
        }

        setFavorites(newFavorites)
        storageService.set('favorites', newFavorites)
    }

    const handleThemeToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        storageService.set('theme', newTheme)
    }

    const handleShare = async (quoteToShare) => {
        await quoteService.shareQuote(quoteToShare)
    }

    const isQuoteFavorited = useCallback((quote) => {
        return favorites.some(fav => fav._id === quote._id)
    }, [favorites])

    const loadMoreQuotes = useCallback(async (count = 3) => {
        const newQuotes = []
        for (let i = 0; i < count; i++) {
            try {
                const newQuote = await quoteService.getRandomQuote()
                newQuotes.push(newQuote)
            } catch (error) {
                console.error('Error loading quote:', error)
            }
        }
        return newQuotes
    }, [])

    if (loading) {
        return (
            <div className="app">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading inspiration...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="app">
            <header className="header">
                <h1>📖 Daily Bible Verse</h1>
                <div className="header-actions">
                    <button
                        className="icon-button"
                        onClick={handleThemeToggle}
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </header>

            <nav className="nav">
                <button
                    className={view === 'home' ? 'active' : ''}
                    onClick={() => setView('home')}
                >
                    🏠 Home
                </button>
                <button
                    className={view === 'history' ? 'active' : ''}
                    onClick={() => setView('history')}
                >
                    ❤️ Favorites
                </button>
                <button
                    className={view === 'settings' ? 'active' : ''}
                    onClick={() => setView('settings')}
                >
                    ⚙️ Settings
                </button>
            </nav>

            <main className="main">
                {view === 'home' && quote && (
                    <>
                        <QuoteFeed
                            initialQuote={quote}
                            onFavorite={toggleFavorite}
                            isFavorited={isQuoteFavorited}
                            onShare={handleShare}
                            loadMoreQuotes={loadMoreQuotes}
                        />
                        {/* Primary Ad Banner - appears after quote feed */}
                        <AdBanner
                            adSlot="auto"
                            format="rectangle"
                            style={{ maxWidth: '400px', margin: '20px auto' }}
                            className="primary-ad"
                        />
                    </>
                )}

                {view === 'home' && !quote && !loading && (
                    <div className="quote-card">
                        <p>Unable to load quote. Please check your internet connection.</p>
                    </div>
                )}

                {view === 'history' && (
                    <>
                        <QuoteHistory
                            favorites={favorites}
                            onFavorite={toggleFavorite}
                            onShare={handleShare}
                        />
                        {/* Ad in favorites section */}
                        {favorites.length > 0 && (
                            <AdBanner
                                adSlot="auto"
                                format="horizontal"
                                style={{ marginTop: '30px' }}
                                className="favorites-ad"
                            />
                        )}
                    </>
                )}

                {view === 'settings' && (
                    <Settings />
                )}
            </main>

            <footer className="footer">
                <p>Made with ❤️ for daily inspiration</p>
            </footer>
        </div>
    )
}

export default App
