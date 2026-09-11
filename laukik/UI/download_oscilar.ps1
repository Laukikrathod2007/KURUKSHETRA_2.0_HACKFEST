$ErrorActionPreference = "Continue"
$destDir = Join-Path (Get-Location).Path "oscilar_site"
$zipPath = Join-Path (Get-Location).Path "oscilar.zip"

Write-Host "Reading index.html from $destDir..."
$html = [System.IO.File]::ReadAllText((Join-Path $destDir "index.html"))

# Match all external and relative assets (CSS, JS, images, fonts, icons)
$matches = [regex]::Matches($html, '(?i)(https?://[^\s"''<>()]+?\.(?:css|js|svg|png|jpe?g|webp|gif|woff2?|ico))')
$urls = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)

foreach ($m in $matches) {
    $u = $m.Value
    # Skip trackers
    if ($u -notmatch 'google|segment|analytics|clarity|hs-scripts|facebook|hotjar|linkedin') {
        $urls.Add($u) | Out-Null
    }
}

Write-Host "Found $($urls.Count) unique asset URLs to download."

$userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
$downloaded = 0
$failed = 0

foreach ($u in $urls) {
    try {
        $uri = [System.Uri]$u
        $subPath = $uri.Host + $uri.AbsolutePath.Replace('/', '\')
        $localFile = Join-Path $destDir (Join-Path "assets" $subPath)
        $parentDir = [System.IO.Path]::GetDirectoryName($localFile)
        
        if (-not (Test-Path $parentDir)) {
            New-Item -ItemType Directory -Force -Path $parentDir | Out-Null
        }

        if (-not (Test-Path $localFile)) {
            Invoke-WebRequest -Uri $u -OutFile $localFile -UserAgent $userAgent -TimeoutSec 15 -UseBasicParsing
            $sz = (Get-Item $localFile).Length
            if ($sz -gt 0) {
                $downloaded++
                Write-Host "  [OK] $($uri.Segments[-1]) ($([Math]::Round($sz/1KB, 1)) KB)" -ForegroundColor Green
            }
        }
    } catch {
        $failed++
    }
}

Write-Host "`nTotal assets downloaded: $downloaded (Failed/Skipped: $failed)"
Write-Host "Packaging into $zipPath ..."

if (Test-Path $zipPath) {
    Remove-Item -Path $zipPath -Force | Out-Null
}

Compress-Archive -Path "$destDir\*" -DestinationPath $zipPath -Force

$zipSize = (Get-Item $zipPath).Length
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host " ZIP File: $zipPath" -ForegroundColor White
Write-Host " Size: $([Math]::Round($zipSize / 1MB, 2)) MB ($zipSize bytes)" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
