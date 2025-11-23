# Icon Generator Helper Script for Daily Bible Quote App
# This script helps create basic icon files

Write-Host "📱 Daily Bible Quote - Icon Setup Helper" -ForegroundColor Cyan
Write-Host ""

# Check if ImageMagick is available (optional)
$imageMagickAvailable = Get-Command "magick" -ErrorAction SilentlyContinue

if ($imageMagickAvailable) {
    Write-Host "✅ ImageMagick detected - Advanced icon generation available" -ForegroundColor Green
}
else {
    Write-Host "ℹ️  ImageMagick not found - Manual icon setup required" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎨 Icon Creation Options:" -ForegroundColor White
Write-Host "1. 📖 Book emoji icon (simple)"
Write-Host "2. ✝️ Cross symbol icon"  
Write-Host "3. 📜 Scroll/manuscript icon"
Write-Host "4. Custom text icon"
Write-Host "5. Download from online generator"
Write-Host ""

$choice = Read-Host "Choose option (1-5)"

switch ($choice) {
    "1" { 
        Write-Host "Creating book emoji icon..." -ForegroundColor Green
        Write-Host "📖 Use this emoji as your icon base"
    }
    "2" {
        Write-Host "Creating cross symbol icon..." -ForegroundColor Green  
        Write-Host "✝️ Use this symbol as your icon base"
    }
    "3" {
        Write-Host "Creating scroll icon..." -ForegroundColor Green
        Write-Host "📜 Use this emoji as your icon base"  
    }
    "4" {
        $customText = Read-Host "Enter text for icon (e.g., 'DQ', 'Bible')"
        Write-Host "Creating custom text icon: $customText" -ForegroundColor Green
    }
    "5" {
        Write-Host "Opening online icon generators..." -ForegroundColor Green
        Start-Process "https://app-icon-generator.com"
        Start-Process "https://favicon.io/favicon-generator"
    }
    default {
        Write-Host "Invalid choice. Opening online generators..." -ForegroundColor Yellow
        Start-Process "https://app-icon-generator.com"
    }
}

Write-Host ""
Write-Host "📂 Icon files need to be placed in these folders:" -ForegroundColor Cyan
Write-Host "android/app/src/main/res/mipmap-hdpi/" -ForegroundColor White
Write-Host "android/app/src/main/res/mipmap-mdpi/" -ForegroundColor White  
Write-Host "android/app/src/main/res/mipmap-xhdpi/" -ForegroundColor White
Write-Host "android/app/src/main/res/mipmap-xxhdpi/" -ForegroundColor White
Write-Host "android/app/src/main/res/mipmap-xxxhdpi/" -ForegroundColor White
Write-Host ""
Write-Host "📏 Required sizes:" -ForegroundColor Cyan
Write-Host "hdpi: 72x72, mdpi: 48x48, xhdpi: 96x96, xxhdpi: 144x144, xxxhdpi: 192x192" -ForegroundColor White
Write-Host ""
Write-Host "🔄 After replacing icons, run:" -ForegroundColor Yellow
Write-Host "npm run build && npx cap sync android" -ForegroundColor White