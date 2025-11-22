import './QuoteCard.css'

export function QuoteCard({ quote, isFavorited, onFavorite, onShare, onRefresh }) {
    if (!quote) return null

    return (
        <div className="quote-card">
            <div className="quote-content">
                <p className="quote-text">"{quote.content}"</p>
                <p className="quote-author">— {quote.author}</p>
                {quote.tags && quote.tags.length > 0 && (
                    <div className="quote-tags">
                        {quote.tags.map((tag, index) => (
                            <span key={index} className="tag">#{tag}</span>
                        ))}
                    </div>
                )}
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
