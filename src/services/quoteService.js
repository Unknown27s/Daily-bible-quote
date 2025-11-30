import { storageService } from './storageService'
import { API_CONFIG } from '../config/apiConfig'

// External APIs
const QUOTE_API = API_CONFIG.QUOTABLE_API

// Bible verse meanings based on book themes
const BOOK_MEANINGS = {
    'Genesis': 'This verse from Genesis reminds us of God\'s creative power and the foundations of faith. It speaks to new beginnings and God\'s sovereign plan for creation.',
    'Exodus': 'From Exodus, this passage reflects on God\'s deliverance and faithfulness. It reminds us that God leads His people out of bondage into freedom.',
    'Psalms': 'This Psalm expresses heartfelt worship and trust in God. It teaches us to bring our joys, sorrows, and prayers before the Lord.',
    'Proverbs': 'This proverb offers practical wisdom for daily living. It encourages us to seek understanding and walk in righteousness.',
    'Isaiah': 'Isaiah\'s prophetic words point us to God\'s holiness and His plan of redemption. This verse calls us to trust in the Lord\'s perfect timing.',
    'Matthew': 'From Matthew\'s Gospel, this verse teaches us about the Kingdom of Heaven and Jesus\'s teachings. It invites us to follow Christ more closely.',
    'Mark': 'Mark presents Jesus as the suffering Servant. This passage reminds us of Christ\'s mission and calls us to faithful discipleship.',
    'Luke': 'Luke emphasizes God\'s compassion for all people. This verse highlights the inclusive nature of God\'s love and salvation.',
    'John': 'John reveals the divine nature of Christ. This verse deepens our understanding of eternal life and our relationship with God.',
    'Acts': 'From Acts, this passage shows the power of the Holy Spirit in the early church. It inspires us to be bold witnesses for Christ.',
    'Romans': 'Paul\'s letter to the Romans explains salvation by grace through faith. This verse clarifies the Gospel and our response to it.',
    'Corinthians': 'This verse addresses Christian living and spiritual gifts. It guides us in building up the body of Christ with love.',
    'Ephesians': 'Ephesians reveals our identity in Christ. This passage reminds us of the spiritual blessings we have as believers.',
    'Philippians': 'Paul\'s letter of joy teaches us contentment. This verse encourages us to find our strength and satisfaction in Christ.',
    'James': 'James emphasizes faith in action. This practical teaching calls us to demonstrate our faith through good works.',
    'Peter': 'Peter writes about hope and perseverance. This verse strengthens us to stand firm in our faith during trials.',
    'Revelation': 'Revelation unveils the ultimate victory of Christ. This passage reminds us of the glorious future that awaits believers.'
}

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

            const verseRef = data.reference || reference.replace(/\+/g, ' ')
            const meaning = this.getMeaningForVerse(verseRef)

            const formatted = {
                _id: `bible_${Date.now()}`,
                content: data.text.trim(),
                author: verseRef,
                tags: ['bible', 'scripture'],
                source: 'bible',
                meaning: meaning
            }
            console.log('✅ Bible verse formatted:', formatted)
            return formatted
        } catch (err) {
            console.error('❌ Bible verse error:', err.message)
            console.log('🔄 Falling back to general quote...')
            // Fallback to general quote so user still sees something
            return await this.fetchGeneralQuote()
        }
    }

    getMeaningForVerse(reference) {
        // Extract book name from reference (handles "John 3:16", "1 Corinthians 13:4", "2 Peter 1:3")
        // First try to match numbered books like "1 Corinthians" or "2 Peter"
        let bookMatch = reference.match(/^\d?\s*([A-Za-z]+)/)
        if (bookMatch) {
            const bookName = bookMatch[1]
            return BOOK_MEANINGS[bookName] || 'Reflect on this verse and consider how it applies to your life. May it bring you wisdom, comfort, and inspiration for your daily walk.'
        }
        return 'Reflect on this verse and consider how it applies to your life. May it bring you wisdom, comfort, and inspiration for your daily walk.'
    }

    async getRandomQuote() {
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

