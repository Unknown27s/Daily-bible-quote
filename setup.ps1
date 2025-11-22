# Daily Quote PWA - Setup Script
# Run this script to set up the complete development environment

Write-Host "🚀 Setting up Daily Quote PWA..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Build the app once
Write-Host "🔨 Building the application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Build failed, but you can still run dev server" -ForegroundColor Yellow
} else {
    Write-Host "✅ Build successful" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Run 'npm run dev' to start development server"
Write-Host "   2. Open http://localhost:3000 in your browser"
Write-Host "   3. Test the PWA features"
Write-Host ""
Write-Host "📱 For mobile development:" -ForegroundColor Cyan
Write-Host "   1. Run 'npx cap add android' (for Android)"
Write-Host "   2. Run 'npx cap add ios' (for iOS, macOS only)"
Write-Host "   3. Run 'npm run android' or 'npm run ios'"
Write-Host ""
Write-Host "📖 Read README.md for full documentation" -ForegroundColor Cyan
Write-Host ""
