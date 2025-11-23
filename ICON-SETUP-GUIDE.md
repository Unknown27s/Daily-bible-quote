# Daily Bible Quote App - Custom Icon Setup

## 📱 Custom App Icon Instructions

Your app currently uses the default Capacitor icon. Here's how to change it:

### 🎨 Icon Requirements:
- **Main Icon**: 1024x1024 PNG (square, no transparency for best results)
- **Theme**: Bible/religious/inspirational 
- **Colors**: Match your app theme (#4F46E5 purple or gold/white)

### 📂 Files to Replace:

Replace these files in `android/app/src/main/res/`:

```
mipmap-hdpi/ic_launcher.png          (72x72)
mipmap-mdpi/ic_launcher.png          (48x48)
mipmap-xhdpi/ic_launcher.png         (96x96) 
mipmap-xxhdpi/ic_launcher.png        (144x144)
mipmap-xxxhdpi/ic_launcher.png       (192x192)
mipmap-hdpi/ic_launcher_round.png    (72x72, rounded)
mipmap-mdpi/ic_launcher_round.png    (48x48, rounded)
mipmap-xhdpi/ic_launcher_round.png   (96x96, rounded)
mipmap-xxhdpi/ic_launcher_round.png  (144x144, rounded)
mipmap-xxxhdpi/ic_launcher_round.png (192x192, rounded)
```

### 🚀 Easy Tools to Generate Icons:

#### Option 1: App Icon Generator
1. Go to [app-icon-generator.com](https://app-icon-generator.com)
2. Upload your 1024x1024 icon
3. Select "Android" 
4. Download and extract
5. Copy files to the mipmap folders

#### Option 2: Favicon.io
1. Go to [favicon.io/favicon-generator](https://favicon.io/favicon-generator)
2. Create text-based icon with "📖" or "Bible" text
3. Download and resize for Android

#### Option 3: Canva
1. Create 1024x1024 design in Canva
2. Use Bible/book/cross themes
3. Export as PNG
4. Use online generator to create all sizes

### 🎨 Icon Design Ideas:

**Simple Text Icons:**
- 📖 (Book emoji on colored background)
- ✝️ (Cross symbol)
- "📜" (Scroll/manuscript)

**Text-Based:**
- "Daily Quote" text
- "DQ" initials  
- "Bible" text

**Colors That Work Well:**
- Purple (#4F46E5) - matches your app theme
- Gold (#FFD700) - classic religious color
- Deep Blue (#1E40AF) - trustworthy
- White text on colored background

### 🔄 After Changing Icons:

1. **Rebuild the app**:
   ```powershell
   npm run build
   npx cap sync android
   ```

2. **Test locally** (if you have Android SDK):
   ```powershell
   cd android
   ./gradlew assembleDebug
   ```

3. **Or push to GitHub** for automatic APK building

### 📱 Quick Icon Creation Script:

I can help you create a simple text-based icon. What would you like on your icon?
- Bible verse reference (e.g., "Psalm 23:1")
- Simple emoji (📖, ✝️, 📜)
- App name "Daily Quote"
- Custom text

Let me know and I'll create the icon files for you!