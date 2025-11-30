import { useState } from 'react'
import './QuoteCard.css'

export function QuoteCard({ quote, isFavorited, onFavorite, onShare, onRefresh }) {
    const [isScrolling, setIsScrolling] = useState(true)

    if (!quote) return null

    const toggleScrolling = () => {
        setIsScrolling(!isScrolling)
    }

    // Default meaning for quotes that don't have one
    const getDefaultMeaning = () => {
        if (quote.meaning) return quote.meaning
        if (quote.source === 'bible') {
            return 'Reflect on this scripture and consider how its message applies to your daily life. Let it guide and inspire your walk of faith.'
        }
        return 'Take a moment to reflect on this wisdom. Consider how it might apply to your life and inspire positive change in your daily actions.'
    }

    return (
        <div className="quote-card">
            <div className="quote-content">
                <div className="quote-scroll-container">
                    <p 
                        className={`quote-text ${isScrolling ? 'scrolling' : ''}`}
                        onClick={toggleScrolling}
                        title={isScrolling ? 'Click to pause scrolling' : 'Click to resume scrolling'}
                    >
                        "{quote.content}"
                    </p>
                </div>
                <p className="scroll-hint">
                    {isScrolling ? '👆 Click quote to pause' : '👆 Click quote to scroll'}
                </p>
                <p className="quote-author">— {quote.author}</p>
                {quote.tags && quote.tags.length > 0 && (
                    <div className="quote-tags">
                        {quote.tags.map((tag, index) => (
                            <span key={index} className="tag">#{tag}</span>
                        ))}
                    </div>
                )}
            </div>

            <div className="quote-meaning">
                <h4 className="meaning-title">📖 Meaning & Reflection</h4>
                <p className="meaning-text">{getDefaultMeaning()}</p>
            </div>

            <div className="quote-actions">
                <button
                    className="action-button"
                    onClick={onFavorite}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                    {isFavorited ? '❤️' : '🤍'} {isFavorited ? 'Saved' : 'Save'}
                </button>

                <button
                    className="action-button"
                    onClick={onShare}
                    aria-label="Share quote"
                >
                    📤 Share
                </button>

                <button
                    className="action-button primary"
                    onClick={onRefresh}
                    aria-label="Get new quote"
                >
                    🔄 New Quote
                </button>
            </div>
        </div>
    )
}
