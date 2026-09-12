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
