# download_all_assets.ps1
# Comprehensive Asset Downloader for tempo.xyz

$ErrorActionPreference = "Continue"
$baseUrl = "https://tempo.xyz"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Starting Complete Asset Download for Tempo.xyz" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Collect all known and extracted URLs
$assetUrls = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

# Add 3D models & textures
$assetUrls.Add("/models/shape.glb") | Out-Null
$assetUrls.Add("/models/tempo.glb") | Out-Null
$assetUrls.Add("/textures/uv.jpg") | Out-Null

# Add Fonts
$assetUrls.Add("/fonts/HB_Set/HBSetv0.96-Light.woff2") | Out-Null
$assetUrls.Add("/fonts/Pilat/Pilat-Book.woff2") | Out-Null

# Add Videos & Media
$assetUrls.Add("/videos/homepage/tempo-case-studies-preview.mp4") | Out-Null
$assetUrls.Add("/videos/homepage/tempo-case-studies.mp4") | Out-Null
$assetUrls.Add("/images/homepage/video-thumbnails/tempo-case-studies-thumb-02-cash-detail.jpg") | Out-Null
$assetUrls.Add("/site.webm") | Out-Null

# Add Site Logos & Icons
$assetUrls.Add("/content/tempo-full-logo.svg") | Out-Null
$assetUrls.Add("/images/logo.svg") | Out-Null
$assetUrls.Add("/images/icons/accordion_down.svg") | Out-Null
$assetUrls.Add("/images/icons/arrow_right.svg") | Out-Null
$assetUrls.Add("/images/icons/arrow_linkout.svg") | Out-Null
$assetUrls.Add("/images/icons/play.svg") | Out-Null
$assetUrls.Add("/favicon.svg") | Out-Null
$assetUrls.Add("/favicon-32x32.png") | Out-Null
$assetUrls.Add("/favicon-16x16.png") | Out-Null
$assetUrls.Add("/apple-touch-icon.png") | Out-Null

# Add Partner SVGs
$partners = @(
    "altitude", "anthropic", "arq", "atob", "brex", "coastal", "coupang", "cross-river",
    "deel", "deutsche-bank", "doordash", "el-dorado", "faire", "felix", "figure", "gusto",
    "kalshi", "karta", "kast", "klarna", "kraken", "lead-bank", "link", "mastercard",
    "meow", "mercury", "moneygram", "nubank", "okx", "onepay", "openai", "payoneer",
    "persona", "ramp", "revolut", "shopify", "standard-chartered", "stripe", "ubs", "visa"
)
foreach ($p in $partners) {
    $assetUrls.Add("/content/partners/$p.svg") | Out-Null
}

# Add Contentful / external static images
$externalUrls = @(
    "https://images.ctfassets.net/wy06omns870e/5E129T8HayYF39jOqPI4fM/eabc8c9faff482507ce607dc06a69fc6/Stay_In_Touch.png"
)

# Parse tempo_raw.html for more URLs
if (Test-Path "tempo_raw.html") {
    $html = Get-Content -Path "tempo_raw.html" -Raw
    
    # CSS files
    [regex]::Matches($html, 'href="(/_astro/[^"]+\.css[^"]*)"') | ForEach-Object {
        $assetUrls.Add($_.Groups[1].Value) | Out-Null
    }
    
    # JS files
    [regex]::Matches($html, 'src="(/_astro/[^"]+\.js[^"]*)"') | ForEach-Object {
        $assetUrls.Add($_.Groups[1].Value) | Out-Null
    }
    
    # Island components
    [regex]::Matches($html, 'component-url="(/_astro/[^"]+\.js[^"]*)"') | ForEach-Object {
        $assetUrls.Add($_.Groups[1].Value) | Out-Null
    }
    [regex]::Matches($html, 'renderer-url="(/_astro/[^"]+\.js[^"]*)"') | ForEach-Object {
        $assetUrls.Add($_.Groups[1].Value) | Out-Null
    }
    
    # All other media in HTML
    [regex]::Matches($html, '(src|href)="(/[^"]+\.(svg|png|jpg|jpeg|webp|gif|mp4|webm|glb|gltf|woff2?|json))[^"]*"') | ForEach-Object {
        $assetUrls.Add($_.Groups[2].Value) | Out-Null
    }
}

# Known 3D bundle scripts
$extraScripts = @(
    "/_astro/preload-helper.L5lOfJxi.js?dpl=dpl_Ayfj3ws9uKabZjsikBKM3vVbccQC",
    "/_astro/main.BWQdUeit.js?dpl=dpl_Ayfj3ws9uKabZjsikBKM3vVbccQC",
    "/_astro/gsap.Bi_c5vh2.js?dpl=dpl_Ayfj3ws9uKabZjsikBKM3vVbccQC",
    "/_astro/SmoothMouse.DDz9qNYp.js?dpl=dpl_Ayfj3ws9uKabZjsikBKM3vVbccQC",
    "/_astro/ShapeScene.Db3z1nlR.js?dpl=dpl_Ayfj3ws9uKabZjsikBKM3vVbccQC",
    "/_astro/ScrollTrigger.brc2lzcB.js?dpl=dpl_Ayfj3ws9uKabZjsikBKM3vVbccQC",
    "/_astro/lenis.BLzYG_9N.js?dpl=dpl_Ayfj3ws9uKabZjsikBKM3vVbccQC"
)
foreach ($es in $extraScripts) {
    $assetUrls.Add($es) | Out-Null
}

Write-Host "Found $($assetUrls.Count) internal assets and $($externalUrls.Count) external assets to download." -ForegroundColor Yellow

# Download helper
$successCount = 0
$failCount = 0
$totalBytes = 0

function Download-FileWithRetry($url, $destPath) {
    $dir = [System.IO.Path]::GetDirectoryName($destPath)
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }

    if (Test-Path $destPath) {
        $existingSize = (Get-Item $destPath).Length
        if ($existingSize -gt 0) {
            Write-Host "  [ALREADY EXISTS] $destPath ($([Math]::Round($existingSize / 1KB, 1)) KB)" -ForegroundColor DarkGray
            return $existingSize
        }
    }

    for ($attempt = 1; $attempt -le 3; $attempt++) {
        try {
            Invoke-WebRequest -Uri $url -OutFile $destPath -UserAgent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' -TimeoutSec 30
            $size = (Get-Item $destPath).Length
            Write-Host "  [OK] $destPath ($([Math]::Round($size / 1KB, 1)) KB)" -ForegroundColor Green
            return $size
        } catch {
            Write-Host "  [ATTEMPT $attempt FAILED] ${url}: $_" -ForegroundColor Yellow
            Start-Sleep -Milliseconds 500
        }
    }
    Write-Host "  [ERROR] Failed to download $url after 3 attempts." -ForegroundColor Red
    return -1
}

# Download internal assets
foreach ($item in $assetUrls) {
    $cleanPath = $item.Split('?')[0].TrimStart('/')
    $localFile = Join-Path (Get-Location).Path $cleanPath.Replace('/', '\')
    $fullUrl = "$baseUrl$item"

    $size = Download-FileWithRetry $fullUrl $localFile
    if ($size -ge 0) {
        $successCount++
        $totalBytes += $size
    } else {
        $failCount++
    }
}

# Download external assets
foreach ($url in $externalUrls) {
    $fileName = [System.IO.Path]::GetFileName($url.Split('?')[0])
    $localFile = Join-Path (Get-Location).Path "content\ctfassets\$fileName"

    $size = Download-FileWithRetry $url $localFile
    if ($size -ge 0) {
        $successCount++
        $totalBytes += $size
    } else {
        $failCount++
    }
}

# Also inspect all downloaded CSS files for any additional @font-face or url()
Write-Host "`nScanning CSS files for additional font / image references..." -ForegroundColor Cyan
$cssFiles = Get-ChildItem -Path "_astro" -Filter "*.css" -Recurse -ErrorAction SilentlyContinue
foreach ($css in $cssFiles) {
    $content = Get-Content -Path $css.FullName -Raw
    $urlMatches = [regex]::Matches($content, 'url\(([^)]+)\)')
    foreach ($um in $urlMatches) {
        $u = $um.Groups[1].Value.Trim("'", '"', " ")
        if ($u -notmatch '^(data:|http)' -and $u.Length -gt 1) {
            # Normalize path
            $cleanU = $u.Split('?')[0].TrimStart('/')
            $localF = Join-Path (Get-Location).Path $cleanU.Replace('/', '\')
            $fUrl = "$baseUrl/$cleanU"
            if (-not (Test-Path $localF)) {
                Write-Host "Discovered CSS asset: $cleanU" -ForegroundColor Yellow
                $size = Download-FileWithRetry $fUrl $localF
                if ($size -ge 0) { $successCount++; $totalBytes += $size }
            }
        }
    }
}

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host " DOWNLOAD SUMMARY" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Successfully Downloaded: $successCount files" -ForegroundColor Green
Write-Host "Failed: $failCount files" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host "Total Download Size: $([Math]::Round($totalBytes / 1MB, 2)) MB" -ForegroundColor Green
Write-Host "Assets Directory Structure Created:" -ForegroundColor Cyan
Get-ChildItem -Directory | ForEach-Object {
    $count = (Get-ChildItem -Path $_.FullName -File -Recurse).Count
    Write-Host "  - $($_.Name): $count files" -ForegroundColor White
}
