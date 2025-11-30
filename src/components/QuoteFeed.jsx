import { useState, useEffect, useRef } from 'react'
import './QuoteFeed.css'

export function QuoteFeed({ initialQuote, onFavorite, isFavorited, onShare, loadMoreQuotes }) {
    const [quotes, setQuotes] = useState(initialQuote ? [initialQuote] : [])
    const [loading, setLoading] = useState(false)
    const [expandedExplanations, setExpandedExplanations] = useState({})
    const feedRef = useRef(null)
    const loadingRef = useRef(false)

    // Load initial quotes
    useEffect(() => {
        if (initialQuote && quotes.length === 0) {
            setQuotes([initialQuote])
        }
    }, [initialQuote])

    // Update quotes when initialQuote changes
    useEffect(() => {
        if (initialQuote) {
            setQuotes(prevQuotes => {
                // Check if the quote already exists
                if (prevQuotes.some(q => q._id === initialQuote._id)) {
                    return prevQuotes
                }
                // Add to the beginning if it's a new quote
                return [initialQuote, ...prevQuotes]
            })
        }
    }, [initialQuote])

    // Pre-load more quotes when component mounts
    useEffect(() => {
        const preloadQuotes = async () => {
            if (quotes.length < 5 && loadMoreQuotes && !loadingRef.current) {
                loadingRef.current = true
                setLoading(true)
                try {
                    const newQuotes = await loadMoreQuotes(4)
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
        }
        preloadQuotes()
    }, [loadMoreQuotes])

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = async () => {
            if (!feedRef.current || loadingRef.current) return

            const { scrollTop, scrollHeight, clientHeight } = feedRef.current
            // Load more when user is near bottom (within 200px)
            if (scrollHeight - scrollTop - clientHeight < 200) {
                loadingRef.current = true
                setLoading(true)
                try {
                    const newQuotes = await loadMoreQuotes(3)
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
        }

        const feed = feedRef.current
        if (feed) {
            feed.addEventListener('scroll', handleScroll)
            return () => feed.removeEventListener('scroll', handleScroll)
        }
    }, [loadMoreQuotes])

    const toggleExplanation = (quoteId) => {
        setExpandedExplanations(prev => ({
            ...prev,
            [quoteId]: !prev[quoteId]
        }))
    }

    const getExplanation = (quote) => {
        // Generate a simple explanation based on the quote content
        if (quote.source === 'bible' || quote.tags?.includes('bible')) {
            return `This verse from ${quote.author} encourages us to reflect on its deeper meaning. Bible verses often contain wisdom that applies to our daily lives, offering guidance, comfort, and inspiration.`
        }
        return `This quote by ${quote.author} invites us to consider its wisdom. Great quotes often contain insights that can help us navigate life's challenges and find meaning in our experiences.`
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
