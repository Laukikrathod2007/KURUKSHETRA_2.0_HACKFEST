<#
.SYNOPSIS
    Downloads all assets, 3D WebGPU visuals, compute shaders, fonts, and dependencies
    from https://www.aaronjcunningham.com/ and exports them as a self-contained ZIP archive.

.DESCRIPTION
    This script downloads:
    1. Complete Next.js HTML page and metadata
    2. All Webpack JavaScript chunks including Chunk 785 (the 3D WebGPU & TSL compute engine)
    3. All secondary Webpack chunks, build manifests, and SSG manifests
    4. All CSS stylesheets and embedded WOFF2 typography font files
    5. High-resolution project visual assets and thumbnails
    6. Bundles an automated local HTTP preview server (WebGPU requires an HTTP origin)
    7. Automatically compresses everything into a timestamped ZIP archive.

.EXAMPLE
    .\Export-AaronCunninghamAssets.ps1
    .\Export-AaronCunninghamAssets.ps1 -OutputDir ".\portfolio_assets" -ZipPath ".\portfolio.zip"
#>

[CmdletBinding()]
param(
    [string]$OutputDir = $(if ($PSScriptRoot) { Join-Path $PSScriptRoot "aaronjcunningham_assets" } else { Join-Path (Get-Location).Path "aaronjcunningham_assets" }),
    [string]$ZipPath = $(if ($PSScriptRoot) { Join-Path $PSScriptRoot "aaronjcunningham_assets.zip" } else { Join-Path (Get-Location).Path "aaronjcunningham_assets.zip" }),
    [switch]$IncludeSanityLocalRewrites = $true
)

$ErrorActionPreference = "Stop"
$siteUrl = "https://www.aaronjcunningham.com"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " Aaron J. Cunningham Portfolio Asset Exporter (WebGPU & 3D Visuals)   " -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "Target URL : $siteUrl" -ForegroundColor Yellow
Write-Host "Output Dir : $OutputDir" -ForegroundColor Yellow
Write-Host "Zip Target : $ZipPath" -ForegroundColor Yellow
Write-Host ""

# 1. Reset / create folder structure
if (Test-Path $OutputDir) {
    Remove-Item -Recurse -Force $OutputDir
}
$directories = @(
    $OutputDir,
    "$OutputDir\_next\static\css",
    "$OutputDir\_next\static\chunks\pages",
    "$OutputDir\_next\static\_ihgZSojgHdrA4VN3V9EN",
    "$OutputDir\_next\static\media",
    "$OutputDir\images\sanity"
)
foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# 2. Asset Manifest definition
$assets = @(
    # Core Document
    @{ Url = "$siteUrl/"; Path = "index.html" },

    # Favicons & PWA Manifest
    @{ Url = "$siteUrl/favicon.ico"; Path = "favicon.ico" },
    @{ Url = "$siteUrl/apple-touch-icon.png"; Path = "apple-touch-icon.png" },
    @{ Url = "$siteUrl/favicon-32x32.png"; Path = "favicon-32x32.png" },
    @{ Url = "$siteUrl/favicon-16x16.png"; Path = "favicon-16x16.png" },
    @{ Url = "$siteUrl/site.webmanifest"; Path = "site.webmanifest" },
    @{ Url = "$siteUrl/images/meta-image.png"; Path = "images\meta-image.png" },

    # Stylesheet
    @{ Url = "$siteUrl/_next/static/css/4ee05b4f24fef527.css"; Path = "_next\static\css\4ee05b4f24fef527.css" },

    # Webpack Runtime & Next.js Core
    @{ Url = "$siteUrl/_next/static/chunks/polyfills-42372ed130431b0a.js"; Path = "_next\static\chunks\polyfills-42372ed130431b0a.js" },
    @{ Url = "$siteUrl/_next/static/chunks/webpack-c2766456c2a62c55.js"; Path = "_next\static\chunks\webpack-c2766456c2a62c55.js" },
    @{ Url = "$siteUrl/_next/static/chunks/framework-49c6cecf1f6d5795.js"; Path = "_next\static\chunks\framework-49c6cecf1f6d5795.js" },
    @{ Url = "$siteUrl/_next/static/chunks/main-fc56ac81e639fb5e.js"; Path = "_next\static\chunks\main-fc56ac81e639fb5e.js" },
    @{ Url = "$siteUrl/_next/static/chunks/pages/_app-5d86944b060ea461.js"; Path = "_next\static\chunks\pages\_app-5d86944b060ea461.js" },
    @{ Url = "$siteUrl/_next/static/chunks/664-d254d21a6fe56bff.js"; Path = "_next\static\chunks\664-d254d21a6fe56bff.js" },
    @{ Url = "$siteUrl/_next/static/chunks/29-495cdd3fd8cc6291.js"; Path = "_next\static\chunks\29-495cdd3fd8cc6291.js" },
    @{ Url = "$siteUrl/_next/static/chunks/pages/index-87a9fbcb69df88f7.js"; Path = "_next\static\chunks\pages\index-87a9fbcb69df88f7.js" },
    @{ Url = "$siteUrl/_next/static/_ihgZSojgHdrA4VN3V9EN/_buildManifest.js"; Path = "_next\static\_ihgZSojgHdrA4VN3V9EN\_buildManifest.js" },
    @{ Url = "$siteUrl/_next/static/_ihgZSojgHdrA4VN3V9EN/_ssgManifest.js"; Path = "_next\static\_ihgZSojgHdrA4VN3V9EN\_ssgManifest.js" },

    # 3D Visual Engine & Compute Shaders (TSL / Three.js WebGPU)
    @{ Url = "$siteUrl/_next/static/chunks/785.9ddfb959a8e9d7bc.js"; Path = "_next\static\chunks\785.9ddfb959a8e9d7bc.js" },

    # Additional Dynamic Chunks for Components & Subroutes
    @{ Url = "$siteUrl/_next/static/chunks/41.c90b8679abdce93f.js"; Path = "_next\static\chunks\41.c90b8679abdce93f.js" },
    @{ Url = "$siteUrl/_next/static/chunks/95.af7b6e7ab8e8f2c8.js"; Path = "_next\static\chunks\95.af7b6e7ab8e8f2c8.js" },
    @{ Url = "$siteUrl/_next/static/chunks/319.e9088415b2ac0935.js"; Path = "_next\static\chunks\319.e9088415b2ac0935.js" },
    @{ Url = "$siteUrl/_next/static/chunks/499.9db9b446866c108d.js"; Path = "_next\static\chunks\499.9db9b446866c108d.js" },
    @{ Url = "$siteUrl/_next/static/chunks/581.1bddee9c00490edd.js"; Path = "_next\static\chunks\581.1bddee9c00490edd.js" },
    @{ Url = "$siteUrl/_next/static/chunks/654.f7ad6d3427f09cc4.js"; Path = "_next\static\chunks\654.f7ad6d3427f09cc4.js" },
    @{ Url = "$siteUrl/_next/static/chunks/fb7d5399.08abda3ef4eb1cdf.js"; Path = "_next\static\chunks\fb7d5399.08abda3ef4eb1cdf.js" },
    @{ Url = "$siteUrl/_next/static/chunks/750.831525605a96505a.js"; Path = "_next\static\chunks\750.831525605a96505a.js" },
    @{ Url = "$siteUrl/_next/static/chunks/712565b9.93104e80aeb28da8.js"; Path = "_next\static\chunks\712565b9.93104e80aeb28da8.js" },
    @{ Url = "$siteUrl/_next/static/chunks/91794568.ac0f4b1d86bcc088.js"; Path = "_next\static\chunks\91794568.ac0f4b1d86bcc088.js" },
    @{ Url = "$siteUrl/_next/static/chunks/1bfc9850-52fd61b7d6ac261a.js"; Path = "_next\static\chunks\1bfc9850-52fd61b7d6ac261a.js" },
    @{ Url = "$siteUrl/_next/static/chunks/920-5518e2812379de92.js"; Path = "_next\static\chunks\920-5518e2812379de92.js" },
    @{ Url = "$siteUrl/_next/static/chunks/914-1b3622503753e671.js"; Path = "_next\static\chunks\914-1b3622503753e671.js" },

    # Fonts (WOFF2)
    @{ Url = "$siteUrl/_next/static/media/ebfc19422cfb71ba-s.p.woff2"; Path = "_next\static\media\ebfc19422cfb71ba-s.p.woff2" },
    @{ Url = "$siteUrl/_next/static/media/e4af272ccee01ff0-s.p.woff2"; Path = "_next\static\media\e4af272ccee01ff0-s.p.woff2" },
    @{ Url = "$siteUrl/_next/static/media/ebd906058017e87b-s.woff2"; Path = "_next\static\media\ebd906058017e87b-s.woff2" },
    @{ Url = "$siteUrl/_next/static/media/2d603fd52a8bc0a6-s.woff2"; Path = "_next\static\media\2d603fd52a8bc0a6-s.woff2" },
    @{ Url = "$siteUrl/_next/static/media/182407ced381c101-s.woff2"; Path = "_next\static\media\182407ced381c101-s.woff2" },
    @{ Url = "$siteUrl/_next/static/media/c1329a5972589dee-s.woff2"; Path = "_next\static\media\c1329a5972589dee-s.woff2" },
    @{ Url = "$siteUrl/_next/static/media/26f2259d8522a173-s.woff2"; Path = "_next\static\media\26f2259d8522a173-s.woff2" },
    @{ Url = "$siteUrl/_next/static/media/ba9851c3c22cd980-s.woff2"; Path = "_next\static\media\ba9851c3c22cd980-s.woff2" },
    @{ Url = "$siteUrl/_next/static/media/21350d82a1f187e9-s.woff2"; Path = "_next\static\media\21350d82a1f187e9-s.woff2" },
    @{ Url = "$siteUrl/_next/static/media/c5fe6dc8356a8c31-s.woff2"; Path = "_next\static\media\c5fe6dc8356a8c31-s.woff2" },
    @{ Url = "$siteUrl/_next/static/media/19cfc7226ec3afaa-s.woff2"; Path = "_next\static\media\19cfc7226ec3afaa-s.woff2" },
    @{ Url = "$siteUrl/_next/static/media/df0a9ae256c0569c-s.woff2"; Path = "_next\static\media\df0a9ae256c0569c-s.woff2" },
    @{ Url = "$siteUrl/_next/static/media/8e9860b6e62d6359-s.woff2"; Path = "_next\static\media\8e9860b6e62d6359-s.woff2" },

    # Sanity Case Study Project Images
    @{ Url = "https://cdn.sanity.io/images/574ue3bq/production/a9be938e658714e78bfe3900b9086cd8cfc96564-1600x900.webp"; Path = "images\sanity\spirit-realm.webp" },
    @{ Url = "https://cdn.sanity.io/images/574ue3bq/production/358dbabbe4a3c81cdec699805f03d64c44e715f7-1200x630.jpg"; Path = "images\sanity\spirit-realm-preview.jpg" },
    @{ Url = "https://cdn.sanity.io/images/574ue3bq/production/3ab9cec6a7872cf049c9c3cf212754f81cbae1b3-1600x900.webp"; Path = "images\sanity\basedai-nexus.webp" },
    @{ Url = "https://cdn.sanity.io/images/574ue3bq/production/b7424e439441076b613881363b097e9d1304d5a0-1200x630.jpg"; Path = "images\sanity\basedai-nexus-preview.jpg" },
    @{ Url = "https://cdn.sanity.io/images/574ue3bq/production/991585e7bc31ce3939e5c1b6eb26424243e51d7a-1600x900.webp"; Path = "images\sanity\defi-launchpad.webp" },
    @{ Url = "https://cdn.sanity.io/images/574ue3bq/production/802fa7c4c9618f0a2b93fff146747c787fb4f32a-1200x630.jpg"; Path = "images\sanity\defi-launchpad-preview.jpg" }
)

Write-Host ">>> Fetching $($assets.Count) assets..." -ForegroundColor Cyan
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

$index = 0
foreach ($item in $assets) {
    $index++
    $targetPath = Join-Path $OutputDir $item.Path
    $folder = Split-Path -Parent $targetPath
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
    }

    try {
        $wc.DownloadFile($item.Url, $targetPath)
        $bytes = (Get-Item $targetPath).Length
        Write-Host " [$index/$($assets.Count)] OK ($([math]::Round($bytes/1KB, 1)) KB) -> $($item.Path)" -ForegroundColor DarkGray
    } catch {
        Write-Warning " [$index/$($assets.Count)] Failed: $($item.Url) ($_)"
    }
}

# 3. Optional Sanity CDN rewrites for 100% offline standalone capability
if ($IncludeSanityLocalRewrites) {
    $indexPath = Join-Path $OutputDir "index.html"
    if (Test-Path $indexPath) {
        $htmlContent = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
        $htmlContent = $htmlContent.Replace("https://cdn.sanity.io/images/574ue3bq/production/a9be938e658714e78bfe3900b9086cd8cfc96564-1600x900.webp", "/images/sanity/spirit-realm.webp")
        $htmlContent = $htmlContent.Replace("https://cdn.sanity.io/images/574ue3bq/production/358dbabbe4a3c81cdec699805f03d64c44e715f7-1200x630.jpg", "/images/sanity/spirit-realm-preview.jpg")
        $htmlContent = $htmlContent.Replace("https://cdn.sanity.io/images/574ue3bq/production/3ab9cec6a7872cf049c9c3cf212754f81cbae1b3-1600x900.webp", "/images/sanity/basedai-nexus.webp")
        $htmlContent = $htmlContent.Replace("https://cdn.sanity.io/images/574ue3bq/production/b7424e439441076b613881363b097e9d1304d5a0-1200x630.jpg", "/images/sanity/basedai-nexus-preview.jpg")
        $htmlContent = $htmlContent.Replace("https://cdn.sanity.io/images/574ue3bq/production/991585e7bc31ce3939e5c1b6eb26424243e51d7a-1600x900.webp", "/images/sanity/defi-launchpad.webp")
        $htmlContent = $htmlContent.Replace("https://cdn.sanity.io/images/574ue3bq/production/802fa7c4c9618f0a2b93fff146747c787fb4f32a-1200x630.jpg", "/images/sanity/defi-launchpad-preview.jpg")
        [System.IO.File]::WriteAllText($indexPath, $htmlContent, [System.Text.Encoding]::UTF8)
        Write-Host ">>> Offline image mappings written to index.html" -ForegroundColor Green
    }
}

# 4. Inject a lightweight local WebGPU server script into the bundle
$serverScript = @'
<#
    WebGPU Local HTTP Server Runner
    WebGPU / TSL compute shaders require an HTTP/HTTPS context (e.g. http://localhost)
    because modern browsers disallow GPU features on raw file:// URIs.
#>
param([int]$Port = 8080)

$baseDir = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " Aaron J. Cunningham Portfolio - Local WebGPU Server Active" -ForegroundColor Green
Write-Host " URL: http://localhost:$Port/" -ForegroundColor Yellow
Write-Host " Close window or press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

Start-Process "http://localhost:$Port/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $path = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path)) { $path = "index.html" }

        $file = Join-Path $baseDir $path.Replace('/', '\')
        if (Test-Path $file -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($file)
            $ext = [System.IO.Path]::GetExtension($file).ToLower()
            $res.ContentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".webp" { "image/webp" }
                ".ico"  { "image/x-icon" }
                ".woff2"{ "font/woff2" }
                ".svg"  { "image/svg+xml" }
                default { "application/octet-stream" }
            }
            $res.Headers.Add("Access-Control-Allow-Origin", "*")
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404: Not Found ($path)")
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
        $res.Close()
    }
} finally {
    $listener.Stop()
}
'@

Set-Content -Path (Join-Path $OutputDir "run-local-webgpu.ps1") -Value $serverScript -Encoding UTF8
Write-Host ">>> Created local WebGPU runner: run-local-webgpu.ps1" -ForegroundColor Green

# 5. Compress to ZIP format
if (Test-Path $ZipPath) {
    Remove-Item -Force $ZipPath
}
Write-Host ">>> Compressing package to ZIP ($ZipPath)..." -ForegroundColor Cyan
Compress-Archive -Path "$OutputDir\*" -DestinationPath $ZipPath -Force

$zipItem = Get-Item $ZipPath
Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host " SUCCESS! Zip file generated successfully." -ForegroundColor Green
Write-Host " File : $($zipItem.FullName)" -ForegroundColor Yellow
Write-Host " Size : $([math]::Round($zipItem.Length / 1MB, 2)) MB" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Green
