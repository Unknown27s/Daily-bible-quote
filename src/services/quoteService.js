import { storageService } from './storageService'
import { API_CONFIG } from '../config/apiConfig'

// External APIs
const QUOTE_API = API_CONFIG.QUOTABLE_API

class QuoteService {
    async getDailyQuote() {
        try {
            // Check cache first
            const todayKey = this.getTodayKey()
            const cached = storageService.get(todayKey)
            if (cached) {
                console.log('✅ Loaded cached quote:', cached)
                return cached
            }

            console.log('📡 Fetching new quote from API...')

            // Determine source preference
            const source = this.getQuoteSource()
            console.log('Quote source:', source)

            const quote = source === 'bible' ? await this.fetchBibleVerse() : await this.fetchGeneralQuote()

            // Cache today's quote and add to history
            storageService.set(todayKey, quote)
            this.addToCachedQuotes(quote)
            console.log('✅ Quote loaded successfully:', quote)
            return quote
        } catch (error) {
            console.error('❌ Error in getDailyQuote:', error)
            // Return fallback quote instead of throwing
            return this.getFallbackQuote()
        }
    }

    getFallbackQuote() {
        console.log('🔄 Using fallback quote')
        return {
            _id: 'fallback_' + Date.now(),
            content: 'The best time to plant a tree was 20 years ago. The second best time is now.',
            author: 'Chinese Proverb',
            tags: ['wisdom', 'motivation'],
            source: 'fallback'
        }
    }

    async fetchGeneralQuote() {
        try {
            const res = await fetch(`${QUOTE_API}/random`)
            if (!res.ok) throw new Error(`General quote fetch failed: ${res.status}`)
            return await res.json()
        } catch (err) {
            console.error('General quote error:', err)
            throw err
        }
    }

    getRandomBibleReference() {
        // List of popular Bible books with their chapter counts
        const books = [
            { name: 'Genesis', chapters: 50 },
            { name: 'Exodus', chapters: 40 },
            { name: 'Psalms', chapters: 150 },
            { name: 'Proverbs', chapters: 31 },
            { name: 'Isaiah', chapters: 66 },
            { name: 'Matthew', chapters: 28 },
            { name: 'Mark', chapters: 16 },
            { name: 'Luke', chapters: 24 },
            { name: 'John', chapters: 21 },
            { name: 'Acts', chapters: 28 },
            { name: 'Romans', chapters: 16 },
            { name: 'Corinthians', chapters: 16 },
            { name: 'Ephesians', chapters: 6 },
            { name: 'Philippians', chapters: 4 },
            { name: 'James', chapters: 5 },
            { name: 'Peter', chapters: 5 },
            { name: 'Revelation', chapters: 22 }
        ]

        // Pick random book
        const book = books[Math.floor(Math.random() * books.length)]
        // Pick random chapter
        const chapter = Math.floor(Math.random() * book.chapters) + 1
        // Pick random verse (1-20 range for simplicity)
        const verse = Math.floor(Math.random() * 20) + 1

        return `${book.name}+${chapter}:${verse}`
    }

    async fetchBibleVerse() {
        try {
            const reference = this.getRandomBibleReference()
            const endpoint = `${API_CONFIG.BIBLE_API_ENDPOINT}/${reference}`

            console.log('📖 Fetching Bible verse from:', endpoint)

            const res = await fetch(endpoint)
            console.log('Bible API response status:', res.status)

            if (!res.ok) {
                throw new Error(`Bible verse fetch failed: ${res.status}`)
            }

            const data = await res.json()
            console.log('Bible verse data:', data)

            if (!data.text) throw new Error('Bible verse payload empty')

            const formatted = {
                _id: `bible_${Date.now()}`,
                content: data.text.trim(),
                author: data.reference || reference.replace(/\+/g, ' '),
                tags: ['bible', 'scripture'],
                source: 'bible'
            }
            console.log('✅ Bible verse formatted:', formatted)
            return formatted
        } catch (err) {
            console.error('❌ Bible verse error:', err.message)
            console.log('🔄 Falling back to general quote...')
            // Fallback to general quote so user still sees something
            return await this.fetchGeneralQuote()
        }
    } async getRandomQuote() {
        const source = this.getQuoteSource()
        const quote = source === 'bible' ? await this.fetchBibleVerse() : await this.fetchGeneralQuote()
        this.addToCachedQuotes(quote)
        return quote
    }

    async getQuotesByTag(tag) {
        const res = await fetch(`${QUOTE_API}/random?tags=${encodeURIComponent(tag)}`)
        if (!res.ok) throw new Error('Failed to fetch tagged quote')
        return await res.json()
    }

    async shareQuote(quote) {
        const text = `"${quote.content}"\n\n— ${quote.author}`
        // Attempt Web Share API
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Daily Quote', text })
                return
            } catch (e) {
                if (e.name === 'AbortError') return
            }
        }
        // Clipboard fallback
        try {
            await navigator.clipboard.writeText(text)
            alert('✅ Quote copied to clipboard!')
        } catch (err) {
            console.error('Clipboard error:', err)
            alert('Unable to copy quote.')
        }
    }

    getTodayKey() {
        const d = new Date()
        return `quote_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`
    }

    addToCachedQuotes(quote) {
        try {
            const list = storageService.get('cachedQuotes') || []
            if (!list.some(q => q._id === quote._id)) {
                list.unshift(quote)
                if (list.length > 50) list.splice(50)
                storageService.set('cachedQuotes', list)
            }
        } catch (err) {
            console.error('Cache store error:', err)
        }
    }

    setQuoteSource(source) {
        storageService.set('quoteSource', source)
    }

    getQuoteSource() {
        return storageService.get('quoteSource') || 'bible'
    }
}

export const quoteService = new QuoteService()

