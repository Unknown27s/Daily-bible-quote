# Bible API Setup Guide

## How to Get Your Bible API Key

To enable Bible verses in the Daily Quote app, you'll need a free API key from API.Bible.

### Step 1: Sign Up for API.Bible

1. Go to [https://scripture.api.bible](https://scripture.api.bible)
2. Click **"Get Started Free"** or **"Sign Up"**
3. Create an account using your email
4. Verify your email address

### Step 2: Get Your API Key

1. Log in to your API.Bible account
2. Go to the **Dashboard**
3. Click **"Create Application"** or view your existing applications
4. Copy your **API Key** (it looks like: `abcd1234efgh5678ijkl9012mnop3456`)

### Step 3: Add the API Key to the App

You have **TWO options** to add your API key:

#### Option A: Add it in the App Settings (Recommended for users)

1. Open the app in your browser
2. Click **⚙️ Settings** in the navigation
3. Select **📖 Bible Verses** as your quote source
4. Paste your API key in the **Bible API Key** field
5. The key will be saved in your browser's localStorage
6. ✅ Done! You should now see Bible verses

#### Option B: Add it in the Code (Recommended for developers)

1. Open the file: `src/config/apiConfig.js`
2. Find this line:
   ```javascript
   BIBLE_API_KEY: '',  // <-- PUT YOUR API KEY HERE
   ```
3. Paste your API key between the quotes:
   ```javascript
   BIBLE_API_KEY: 'abcd1234efgh5678ijkl9012mnop3456',
   ```
4. Save the file
5. Restart the dev server if running
6. ✅ Done! Bible verses are now enabled

## Testing Bible Verses

1. Go to **⚙️ Settings**
2. Under **Quote Source**, select **📖 Bible Verses**
3. Go back to **🏠 Home**
4. Click the refresh button to get a new verse
5. You should see a Bible verse with reference (e.g., "John 3:16")

## Troubleshooting

### Error: "Bible API key not set"
- Make sure you entered the key correctly (no extra spaces)
- The key should be a long string of letters and numbers
- Try refreshing the page after entering the key

### Error: "Bible verse fetch failed: 401"
- Your API key is invalid or expired
- Go to API.Bible dashboard and generate a new key
- Make sure you copied the entire key

### Error: "Bible verse fetch failed: 403"
- Your API key doesn't have permission
- Check your API.Bible account limits (free tier allows 500 requests/day)
- Make sure your application is approved in the API.Bible dashboard

### Fallback Behavior
If Bible API fails for any reason, the app will automatically fall back to showing general inspirational quotes instead. This ensures you always see a quote even if there's an API issue.

## Free Tier Limits

- **500 requests per day**
- If you exceed this, the app will show general quotes until the limit resets
- Limit resets at midnight UTC

## Alternative Bible APIs

If you prefer a different Bible API, you can modify the code:

1. Update `BIBLE_API_ENDPOINT` in `src/config/apiConfig.js`
2. Modify the `fetchBibleVerse()` function in `src/services/quoteService.js` to match the new API format

Popular alternatives:
- **ESV API**: https://api.esv.org
- **Bible Gateway**: https://www.biblegateway.com/api/
- **Bible.org**: https://labs.bible.org/api/ (no key required, but limited features)
