import './QuoteHistory.css'

export function QuoteHistory({ favorites, onFavorite, onShare }) {
    if (favorites.length === 0) {
        return (
            <div className="quote-history empty">
                <p className="empty-state">
                    <span className="empty-icon">💫</span>
                    <span>No favorite quotes yet</span>
                    <span className="empty-hint">Save quotes you love to see them here</span>
                </p>
            </div>
        )
    }

    return (
        <div className="quote-history">
            <h2>Your Favorite Quotes ({favorites.length})</h2>

            <div className="favorites-grid">
                {favorites.map((quote) => (
                    <div key={quote._id || quote.id} className="favorite-card">
                        <div className="favorite-content">
                            <p className="favorite-text">"{quote.content}"</p>
                            <p className="favorite-author">— {quote.author}</p>
                        </div>

                        <div className="favorite-actions">
                            <button
                                className="favorite-action"
                                onClick={() => onFavorite(quote)}
                                aria-label="Remove from favorites"
                            >
                                ❤️
                            </button>
                            <button
                                className="favorite-action"
                                onClick={() => onShare(quote)}
                                aria-label="Share quote"
                            >
                                📤
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
