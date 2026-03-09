$loginBody = @{
    email = "admin@aiconsultant.com"
    password = "Admin@123"
} | ConvertTo-Json

Write-Host "Authenticating..."
$loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -UseBasicParsing -Body $loginBody
$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Creating blogs..."

$blog1 = @{
    title = "Getting Started with AI Banking Solutions"
    content = "Learn how artificial intelligence is revolutionizing the banking industry. From fraud detection to customer service, AI is transforming every aspect of modern banking."
    category = "AI Banking"
    tags = @("AI", "Banking", "Technology")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/blogs" -Method Post -Headers $headers -Body $blog1 -UseBasicParsing | Out-Null
Write-Host "- Blog 1 created"

$blog2 = @{
    title = "Digital Transformation in Leasing"
    content = "The leasing industry is undergoing digital transformation. Traditional processes are being replaced with automation and data-driven systems."
    category = "Leasing"
    tags = @("Leasing", "Digital", "Automation")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/blogs" -Method Post -Headers $headers -Body $blog2 -UseBasicParsing | Out-Null
Write-Host "- Blog 2 created"

$blog3 = @{
    title = "Machine Learning for Risk Assessment"
    content = "Risk assessment is critical in banking. Machine learning models can identify complex patterns and predict risks more accurately than traditional systems."
    category = "Machine Learning"
    tags = @("ML", "Risk", "Finance")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/blogs" -Method Post -Headers $headers -Body $blog3 -UseBasicParsing | Out-Null
Write-Host "- Blog 3 created"

Write-Host "Creating videos..."

$video1 = @{
    title = "AI in Banking - Industry Overview"
    description = "Comprehensive overview of AI in banking and finance sector"
    youtubeUrl = "https://www.youtube.com/watch?v=jNgP6d9HraI"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/videos" -Method Post -Headers $headers -Body $video1 -UseBasicParsing | Out-Null
Write-Host "- Video 1 created"

$video2 = @{
    title = "Machine Learning for Credit Risk"
    description = "Learn how ML algorithms assess credit risk and make lending decisions"
    youtubeUrl = "https://www.youtube.com/watch?v=gI0wk1F19Zw"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/videos" -Method Post -Headers $headers -Body $video2 -UseBasicParsing | Out-Null
Write-Host "- Video 2 created"

$video3 = @{
    title = "Digital Transformation Case Study"
    description = "Real case study of digital transformation in financial institutions"
    youtubeUrl = "https://www.youtube.com/watch?v=nw6smmCyNrY"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/videos" -Method Post -Headers $headers -Body $video3 -UseBasicParsing | Out-Null
Write-Host "- Video 3 created"

Write-Host "Done!"
