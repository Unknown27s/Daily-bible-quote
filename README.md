# 📱 Daily Quote PWA

A beautiful Progressive Web App built with React, Vite, and Capacitor that delivers inspiring quotes to users every day.

## ✨ Features

- 📬 **Daily Notifications** - Get a new quote delivered at your chosen time
- 💾 **Offline Support** - Works without internet connection
- ❤️ **Favorites** - Save and manage your favorite quotes
- 📤 **Share** - Share quotes via social media or copy to clipboard
- 🌓 **Dark Mode** - Automatic theme switching
- 📱 **Cross-Platform** - Web, iOS, and Android
- 🚀 **PWA** - Installable on all devices
- ⚡ **Fast** - Built with Vite for optimal performance

## 🛠 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Capacitor 5** - Native mobile wrapper
- **Vite PWA Plugin** - Service worker and PWA features
- **Quotable API** - Quote data source

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm
- For iOS: macOS with Xcode
- For Android: Android Studio

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
npm install
```

### 2. Run Development Server

```powershell
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Build for Production

```powershell
npm run build
```

### 4. Preview Production Build

```powershell
npm run preview
```

## 📱 Mobile Development

### Initialize Capacitor (First Time Only)

After installing dependencies, Capacitor is already configured. To add platforms:

```powershell
npx cap add android
npx cap add ios
```

### Build and Run on Android

```powershell
npm run android
```

This will:
1. Build the web app
2. Sync to Android
3. Open Android Studio

### Build and Run on iOS (macOS only)

```powershell
npm run ios
```

This will:
1. Build the web app
2. Sync to iOS
3. Open Xcode

### Sync Changes to Mobile

After making changes to web code:

```powershell
npm run sync
```

## 🔧 Configuration

### Quote API

The app uses the free [Quotable API](https://api.quotable.io). No API key required.

To change the quote source, edit `src/services/quoteService.js`.

### Notification Time

Users can configure notification time in Settings. Default is 9:00 AM.

### App Icons

Place your app icons in the `public` folder:
- `pwa-192x192.png` - 192x192 PWA icon
- `pwa-512x512.png` - 512x512 PWA icon
- `apple-touch-icon.png` - Apple touch icon
- `favicon.ico` - Favicon

### Theme Colors

Edit theme colors in `src/index.css` under `:root` and `[data-theme="dark"]`.

## 📂 Project Structure

```
daily-quote-pwa/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── QuoteCard.jsx
│   │   ├── Settings.jsx
│   │   └── QuoteHistory.jsx
│   ├── services/          # Business logic
│   │   ├── quoteService.js
│   │   ├── notificationService.js
│   │   └── storageService.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── android/               # Android project (generated)
├── ios/                   # iOS project (generated)
├── capacitor.config.json  # Capacitor configuration
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

## 🔑 Key Features Explained

### PWA Features
- **Service Worker**: Caches app shell and API responses
- **Offline Mode**: Displays cached quotes when offline
- **Install Prompt**: Can be installed like a native app
- **App Manifest**: Defines app appearance and behavior

### Capacitor Plugins Used
- **@capacitor/local-notifications** - Daily quote notifications
- **@capacitor/preferences** - Persistent storage
- **@capacitor/share** - Native share dialog
- **@capacitor/app** - App lifecycle management

### State Management
Uses React hooks (useState, useEffect) for state management. For larger apps, consider Redux or Zustand.

## 🐛 Troubleshooting

### Notifications not working on iOS

iOS requires explicit permission. Users must:
1. Enable notifications in Settings
2. Allow notifications when prompted

### Build fails on Android

- Ensure Android Studio is installed
- Check Java JDK version (11+ required)
- Run `npx cap sync android` to regenerate Android project

### PWA not installing

- Must be served over HTTPS (localhost is OK)
- Service worker must register successfully
- Check browser console for errors

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run android` - Build and open Android app
- `npm run ios` - Build and open iOS app
- `npm run sync` - Sync web changes to mobile platforms

## 🎨 Customization Ideas

- Add quote categories/filters
- Implement quote search
- Add quote of the week
- User authentication
- Social features (like, comment)
- Quote submission
- Multiple languages
- Custom fonts
- Animation effects

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ and inspiration**

Enjoy your daily dose of wisdom! ✨
