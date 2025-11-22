# Quick Start Commands

## Development

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

## Mobile Development

# Add Android platform (first time only)
npx cap add android

# Add iOS platform (first time only, macOS required)
npx cap add ios

# Build and open Android app
npm run android

# Build and open iOS app (macOS only)
npm run ios

# Sync changes to mobile platforms
npm run sync

## Testing PWA Features

# 1. Build the app
npm run build

# 2. Preview with service worker enabled
npm run preview

# 3. Open http://localhost:4173 in Chrome/Edge
# 4. Check for "Install" button in address bar
# 5. Open DevTools > Application > Service Workers
# 6. Test offline mode by checking "Offline" in Network tab

## Common Tasks

# Install new package
npm install <package-name>

# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Check for outdated packages
npm outdated

# Update packages
npm update

## Troubleshooting

# If build fails, try clearing cache
Remove-Item -Recurse -Force node_modules, dist
npm install

# If Capacitor sync fails
npx cap sync

# View Capacitor config
npx cap doctor

## Project Information

# View all npm scripts
npm run

# Check installed versions
node --version
npm --version
npx cap --version
