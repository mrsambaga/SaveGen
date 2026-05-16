# Generates all Android & iOS app icon sizes from assets/app-icon.png (1024x1024 master).
# Run from repo root: powershell -ExecutionPolicy Bypass -File scripts/generate-app-icon.ps1

Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$masterPath = Join-Path $repoRoot 'assets\app-icon.png'

if (-not (Test-Path $masterPath)) {
    Write-Error "Master icon not found at $masterPath"
    exit 1
}

function Resize-Png {
    param(
        [System.Drawing.Image]$Source,
        [int]$Size,
        [string]$OutPath,
        [switch]$Circular
    )
    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    if ($Circular) {
        # Inset slightly so anti-aliasing produces clean edges (no fringing).
        $inset = 0.5
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $path.AddEllipse($inset, $inset, $Size - 2 * $inset, $Size - 2 * $inset)
        $g.SetClip($path)
        $g.DrawImage($Source, 0, 0, $Size, $Size)
        $path.Dispose()
    } else {
        $g.DrawImage($Source, 0, 0, $Size, $Size)
    }

    $g.Dispose()
    $dir = Split-Path -Parent $OutPath
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "  wrote $Size x $Size -> $OutPath"
}

$master = [System.Drawing.Image]::FromFile($masterPath)
Write-Host "Master: $($master.Width) x $($master.Height)" -ForegroundColor Cyan

# Android: mipmap densities -> px size
$android = @{
    'mipmap-mdpi'     = 48
    'mipmap-hdpi'     = 72
    'mipmap-xhdpi'    = 96
    'mipmap-xxhdpi'   = 144
    'mipmap-xxxhdpi'  = 192
}

Write-Host "`nAndroid launcher icons (circular)" -ForegroundColor Yellow
foreach ($folder in $android.Keys) {
    $size = $android[$folder]
    $dir = Join-Path $repoRoot "android\app\src\main\res\$folder"
    Resize-Png -Source $master -Size $size -OutPath (Join-Path $dir 'ic_launcher.png') -Circular
    Resize-Png -Source $master -Size $size -OutPath (Join-Path $dir 'ic_launcher_round.png') -Circular
}

# iOS: per the AppIcon.appiconset Contents.json
$iosSpecs = @(
    @{ name='Icon-20@2x.png';   size= 40 },
    @{ name='Icon-20@3x.png';   size= 60 },
    @{ name='Icon-29@2x.png';   size= 58 },
    @{ name='Icon-29@3x.png';   size= 87 },
    @{ name='Icon-40@2x.png';   size= 80 },
    @{ name='Icon-40@3x.png';   size=120 },
    @{ name='Icon-60@2x.png';   size=120 },
    @{ name='Icon-60@3x.png';   size=180 },
    @{ name='Icon-1024.png';    size=1024 }
)

Write-Host "`niOS app icon set" -ForegroundColor Yellow
$iosDir = Join-Path $repoRoot 'ios\SaveGen\Images.xcassets\AppIcon.appiconset'
foreach ($spec in $iosSpecs) {
    Resize-Png -Source $master -Size $spec.size -OutPath (Join-Path $iosDir $spec.name)
}

# Write the matching Contents.json
$iosJson = @'
{
  "images" : [
    { "idiom" : "iphone", "scale" : "2x", "size" : "20x20",   "filename" : "Icon-20@2x.png" },
    { "idiom" : "iphone", "scale" : "3x", "size" : "20x20",   "filename" : "Icon-20@3x.png" },
    { "idiom" : "iphone", "scale" : "2x", "size" : "29x29",   "filename" : "Icon-29@2x.png" },
    { "idiom" : "iphone", "scale" : "3x", "size" : "29x29",   "filename" : "Icon-29@3x.png" },
    { "idiom" : "iphone", "scale" : "2x", "size" : "40x40",   "filename" : "Icon-40@2x.png" },
    { "idiom" : "iphone", "scale" : "3x", "size" : "40x40",   "filename" : "Icon-40@3x.png" },
    { "idiom" : "iphone", "scale" : "2x", "size" : "60x60",   "filename" : "Icon-60@2x.png" },
    { "idiom" : "iphone", "scale" : "3x", "size" : "60x60",   "filename" : "Icon-60@3x.png" },
    { "idiom" : "ios-marketing", "scale" : "1x", "size" : "1024x1024", "filename" : "Icon-1024.png" }
  ],
  "info" : { "author" : "xcode", "version" : 1 }
}
'@
Set-Content -Path (Join-Path $iosDir 'Contents.json') -Value $iosJson -Encoding UTF8
Write-Host "  wrote Contents.json"

$master.Dispose()
Write-Host "`nDone." -ForegroundColor Green
