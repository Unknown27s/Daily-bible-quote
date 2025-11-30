import { useState, useEffect, useRef, useCallback } from 'react'
import './QuoteFeed.css'

export function QuoteFeed({ initialQuote, onFavorite, isFavorited, onShare, loadMoreQuotes }) {
    const [quotes, setQuotes] = useState(initialQuote ? [initialQuote] : [])
    const [loading, setLoading] = useState(false)
    const [expandedExplanations, setExpandedExplanations] = useState({})
    const feedRef = useRef(null)
    const loadingRef = useRef(false)
    const loadMoreQuotesRef = useRef(loadMoreQuotes)
    const hasPreloaded = useRef(false)

    // Keep ref up to date
    useEffect(() => {
        loadMoreQuotesRef.current = loadMoreQuotes
    }, [loadMoreQuotes])

    // Handle initialQuote changes - single consolidated effect
    useEffect(() => {
        if (initialQuote) {
            setQuotes(prevQuotes => {
                // If quotes is empty, just set it
                if (prevQuotes.length === 0) {
                    return [initialQuote]
                }
                // Check if the quote already exists
                if (prevQuotes.some(q => q._id === initialQuote._id)) {
                    return prevQuotes
                }
                // Add to the beginning if it's a new quote
                return [initialQuote, ...prevQuotes]
            })
        }
    }, [initialQuote])

    // Pre-load more quotes when component mounts (runs only once)
    useEffect(() => {
        const preloadQuotes = async () => {
            if (hasPreloaded.current || loadingRef.current) return
            hasPreloaded.current = true
            loadingRef.current = true
            setLoading(true)
            try {
                const newQuotes = await loadMoreQuotesRef.current(4)
                setQuotes(prevQuotes => {
                    const uniqueQuotes = newQuotes.filter(
                        newQ => !prevQuotes.some(existingQ => existingQ._id === newQ._id)
                    )
                    return [...prevQuotes, ...uniqueQuotes]
                })
            } catch (error) {
                console.error('Error preloading quotes:', error)
            } finally {
                setLoading(false)
                loadingRef.current = false
            }
        }
        preloadQuotes()
    }, [])

    // Memoized scroll handler to prevent re-creation
    const handleScroll = useCallback(async () => {
        if (!feedRef.current || loadingRef.current) return

        const { scrollTop, scrollHeight, clientHeight } = feedRef.current
        // Load more when user is near bottom (within 200px)
        if (scrollHeight - scrollTop - clientHeight < 200) {
            loadingRef.current = true
            setLoading(true)
            try {
                const newQuotes = await loadMoreQuotesRef.current(3)
                setQuotes(prevQuotes => {
                    const uniqueQuotes = newQuotes.filter(
                        newQ => !prevQuotes.some(existingQ => existingQ._id === newQ._id)
                    )
                    return [...prevQuotes, ...uniqueQuotes]
                })
            } catch (error) {
                console.error('Error loading more quotes:', error)
            } finally {
                setLoading(false)
                loadingRef.current = false
            }
        }
    }, [])

    // Infinite scroll handler - attach scroll listener once
    useEffect(() => {
        const feed = feedRef.current
        if (feed) {
            feed.addEventListener('scroll', handleScroll)
            return () => feed.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    const toggleExplanation = (quoteId) => {
        setExpandedExplanations(prev => ({
            ...prev,
            [quoteId]: !prev[quoteId]
        }))
    }

    const getExplanation = (quote) => {
        // Generate a more dynamic explanation based on the quote content and tags
        const author = quote.author || 'Unknown'
        const isBible = quote.source === 'bible' || quote.tags?.includes('bible') || quote.tags?.includes('scripture')
        
        // Extract key themes from tags if available
        const themes = quote.tags?.filter(tag => !['bible', 'scripture'].includes(tag)) || []
        const themeText = themes.length > 0 
            ? `It touches on themes of ${themes.join(' and ')}.` 
            : ''
        
        if (isBible) {
            return `This verse from ${author} offers timeless wisdom from scripture. ${themeText} Bible verses like this one invite us to pause and reflect on how its message applies to our daily lives, providing guidance, comfort, and spiritual growth.`
        }
        
        // For wisdom/motivation quotes
        if (themes.includes('wisdom') || themes.includes('motivation')) {
            return `${author} shares profound wisdom in this quote. ${themeText} This insight encourages us to reflect on our choices and find the strength to take meaningful action in our lives.`
        }
        
        // Default explanation with dynamic content
        return `This quote by ${author} invites deep reflection. ${themeText} Great quotes like this often contain insights that can help us navigate life's challenges and find meaning in our daily experiences.`
    }

    return (
        <div className="quote-feed" ref={feedRef}>
            <div className="feed-header">
                <p className="feed-hint">👇 Scroll down for more quotes</p>
            </div>
            
            <div className="quotes-container">
                {quotes.map((quote, index) => (
                    <div key={quote._id || index} className="feed-quote-card">
                        <div className="quote-content">
                            <p className="quote-text">"{quote.content}"</p>
                            <p className="quote-author">— {quote.author}</p>
                            {quote.tags && quote.tags.length > 0 && (
                                <div className="quote-tags">
                                    {quote.tags.map((tag, tagIndex) => (
                                        <span key={tagIndex} className="tag">#{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button 
                            className={`explanation-toggle ${expandedExplanations[quote._id] ? 'expanded' : ''}`}
                            onClick={() => toggleExplanation(quote._id)}
                            aria-expanded={expandedExplanations[quote._id]}
                        >
                            <span className="explanation-icon">💡</span>
                            <span>Explanation</span>
                            <span className="toggle-arrow">{expandedExplanations[quote._id] ? '▲' : '▼'}</span>
                        </button>

                        {expandedExplanations[quote._id] && (
                            <div className="explanation-content">
                                <p>{getExplanation(quote)}</p>
                            </div>
                        )}

                        <div className="quote-actions">
                            <button
                                className="action-button"
                                onClick={() => onFavorite(quote)}
                                aria-label={isFavorited(quote) ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                {isFavorited(quote) ? '❤️' : '🤍'} {isFavorited(quote) ? 'Saved' : 'Save'}
                            </button>

                            <button
                                className="action-button"
                                onClick={() => onShare(quote)}
                                aria-label="Share quote"
                            >
                                📤 Share
                            </button>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="feed-loading">
                        <div className="spinner-small"></div>
                        <p>Loading more quotes...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
