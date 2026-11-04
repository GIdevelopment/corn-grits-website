Add-Type -AssemblyName System.Drawing

$srcPath = 'C:\Users\hp\.gemini\antigravity\brain\cebd44f5-a17d-4d2d-8eb5-8d6b53242c7d\.user_uploaded\media_1793600907763_5b3e81d4.jpg'
$srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Clean cropped width (omit right 6 pixels where black border is)
$cleanWidth = 234
$cleanHeight = $srcBmp.Height

# 1. Clean original cropped
$rect = New-Object System.Drawing.Rectangle(0, 0, $cleanWidth, $cleanHeight)
$cleanBmp = $srcBmp.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$cleanBmp.Save('c:\corn_grits\images\about-corn-illustration-clean.png', [System.Drawing.Imaging.ImageFormat]::Png)

# 2. Transparent background version
$transBmp = New-Object System.Drawing.Bitmap($cleanWidth, $cleanHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $cleanHeight; $y++) {
    for ($x = 0; $x -lt $cleanWidth; $x++) {
        $c = $cleanBmp.GetPixel($x, $y)
        $r = $c.R
        $g = $c.G
        $b = $c.B

        # Background is near-neutral ivory (R~253, G~248, B~242)
        # Golden corn has lower Blue (B is 140-200 while R is 245-255)
        $colorDiff = $r - $b
        $brightness = ($r + $g + $b) / 3.0

        if ($colorDiff -lt 15 -and $brightness -gt 238) {
            # Completely background
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } elseif ($colorDiff -lt 28 -and $brightness -gt 230) {
            # Smooth feathered edge
            $alpha = [int]([Math]::Min(255, [Math]::Max(0, (($colorDiff - 15) / 13.0) * 255)))
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))
        } else {
            # Solid corn kernel / leaf husk
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
        }
    }
}

$transBmp.Save('c:\corn_grits\images\about-corn-illustration-trans.png', [System.Drawing.Imaging.ImageFormat]::Png)

$srcBmp.Dispose()
$cleanBmp.Dispose()
$transBmp.Dispose()
Write-Output 'Images processed successfully!'
