#!/usr/bin/env node

/**
 * AdSense Configuration Helper
 * Run this script to easily configure AdSense for your app
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const ADBANNER_PATH = path.join(__dirname, 'src', 'components', 'AdBanner.jsx')

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve)
    })
}

function updateAdBannerConfig(publisherId) {
    try {
        let content = fs.readFileSync(ADBANNER_PATH, 'utf8')

        // Replace Publisher ID
        content = content.replace(
            'ca-pub-YOUR_ADSENSE_CLIENT_ID',
            publisherId
        )

        // Enable ads
        content = content.replace(
            'enabled: false',
            'enabled: true'
        )

        fs.writeFileSync(ADBANNER_PATH, content)
        return true
    } catch (error) {
        console.error('Error updating config:', error.message)
        return false
    }
}

function validatePublisherId(id) {
    const pattern = /^ca-pub-\d{16}$/
    return pattern.test(id)
}

async function main() {
    console.log('\n🎯 AdSense Configuration Helper for Daily Bible Quote App\n')
    console.log('This will help you configure Google AdSense in your app.\n')

    const publisherId = await question('Enter your AdSense Publisher ID (ca-pub-1234567890123456): ')

    if (!publisherId) {
        console.log('\n❌ No Publisher ID provided. Exiting...')
        rl.close()
        return
    }

    if (!validatePublisherId(publisherId)) {
        console.log('\n❌ Invalid Publisher ID format!')
        console.log('   Expected format: ca-pub-1234567890123456')
        console.log('   You entered:', publisherId)
        rl.close()
        return
    }

    console.log('\n🔧 Configuring AdSense...')

    if (updateAdBannerConfig(publisherId)) {
        console.log('✅ AdSense configured successfully!')
        console.log('\n📋 Next Steps:')
        console.log('   1. Build your app: npm run build')
        console.log('   2. Deploy to Netlify: netlify deploy --prod')
        console.log('   3. Wait 24-48 hours for ads to appear')
        console.log('\n💡 Tips:')
        console.log('   • Ads won\'t show in development mode')
        console.log('   • Check browser console for any errors')
        console.log('   • Make sure your site is approved by AdSense')
        console.log('\n📊 Monitor your earnings at: https://www.google.com/adsense')
    } else {
        console.log('❌ Failed to configure AdSense. Please check the file path.')
    }

    rl.close()
}

if (require.main === module) {
    main().catch(console.error)
}