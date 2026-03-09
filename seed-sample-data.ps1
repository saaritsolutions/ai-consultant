# Get admin token
$loginBody = @{
    email = "admin@aiconsultant.com"
    password = "Admin@123"
} | ConvertTo-Json

Write-Host "Authenticating as admin..."
$loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -UseBasicParsing `
  -Body $loginBody

$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.token

Write-Host "✓ Admin authenticated`n"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# ──── Blog Posts ────────────────────────────────────────────────────────────

Write-Host "Creating blog posts..."

# Blog 1
$blog1 = @{
    title = "Getting Started with AI Banking Solutions"
    content = "Learn how artificial intelligence is revolutionizing the banking industry. From fraud detection to customer service, AI is transforming every aspect of modern banking.`n`nThis comprehensive guide covers the key technologies, best practices, and implementation strategies for financial institutions. AI-powered banking solutions can process vast amounts of data in real-time, helping banks identify patterns, manage risks, and provide personalized services to customers.`n`nWhether you're a bank executive, IT manager, or aspiring fintech professional, understanding AI in banking is essential for success in today's digital-first financial landscape."
    category = "AI Banking"
    tags = @("AI", "Banking", "Technology", "Finance")
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/blogs" -Method Post -Headers $headers -Body $blog1 -UseBasicParsing
$blog1Data = $response.Content | ConvertFrom-Json
Write-Host "  ✓ '$($blog1Data.title)' (slug: $($blog1Data.slug))"

# Blog 2
$blog2 = @{
    title = "Digital Transformation in Leasing Industry"
    content = "The leasing industry is undergoing a major digital transformation. Traditional manual processes are being replaced with intelligent automation and data-driven decision-making systems.`n`nThis article explores how digital technologies like blockchain, IoT, and AI are reshaping vehicle leasing, equipment financing, and asset management. Learn about the benefits of modernization, including improved efficiency, reduced costs, and enhanced customer experience.`n`nDiscover real-world case studies of successful digital transformation initiatives and understand the challenges and best practices for implementing these technologies in your organization."
    category = "Leasing"
    tags = @("Leasing", "Digital", "Automation", "Industry4.0")
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/blogs" -Method Post -Headers $headers -Body $blog2 -UseBasicParsing
$blog2Data = $response.Content | ConvertFrom-Json
Write-Host "  ✓ '$($blog2Data.title)' (slug: $($blog2Data.slug))"

# Blog 3
$blog3 = @{
    title = "Machine Learning Models for Risk Assessment"
    content = "Risk assessment is critical in banking and leasing. Traditional rule-based systems are increasingly being complemented or replaced by machine learning models that can identify complex patterns and predict risks more accurately.`n`nThis guide explores various ML algorithms used for credit risk, operational risk, and fraud detection. Learn how to build, train, and deploy machine learning models in production banking environments.`n`nWe cover data preparation, feature engineering, model evaluation, and ethical considerations in AI-driven risk assessment."
    category = "Machine Learning"
    tags = @("ML", "Risk", "Finance", "Analytics")
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/blogs" -Method Post -Headers $headers -Body $blog3 -UseBasicParsing
$blog3Data = $response.Content | ConvertFrom-Json
Write-Host "  ✓ '$($blog3Data.title)' (slug: $($blog3Data.slug))`n"

# ──── Videos ────────────────────────────────────────────────────────────────

Write-Host "Creating videos..."

# Video 1
$video1 = @{
    title = "AI in Banking - Industry Overview"
    description = "A comprehensive overview of how artificial intelligence is transforming the banking sector. Learn about the key applications, benefits, and challenges of implementing AI in financial institutions."
    youtubeUrl = "https://www.youtube.com/watch?v=jNgP6d9HraI"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/videos" -Method Post -Headers $headers -Body $video1 -UseBasicParsing
$video1Data = $response.Content | ConvertFrom-Json
Write-Host "  ✓ '$($video1Data.title)'"

# Video 2
$video2 = @{
    title = "Machine Learning for Credit Risk"
    description = "Learn how machine learning algorithms are used to assess credit risk and make lending decisions. This video covers data preparation, feature selection, and model evaluation."
    youtubeUrl = "https://www.youtube.com/watch?v=gI0wk1F19Zw"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/videos" -Method Post -Headers $headers -Body $video2 -UseBasicParsing
$video2Data = $response.Content | ConvertFrom-Json
Write-Host "  ✓ '$($video2Data.title)'"

# Video 3
$video3 = @{
    title = "Digital Transformation Case Study"
    description = "Real-world case study of a major financial institution's digital transformation journey. See how they implemented AI and automation to improve operations and customer experience."
    youtubeUrl = "https://www.youtube.com/watch?v=nw6smmCyNrY"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/videos" -Method Post -Headers $headers -Body $video3 -UseBasicParsing
$video3Data = $response.Content | ConvertFrom-Json
Write-Host "  ✓ '$($video3Data.title)'`n"

Write-Host "Sample data created successfully!"
Write-Host "You can now visit:"
Write-Host "  - Frontend: http://localhost:3000"
Write-Host "  - API Docs: http://localhost:5000/swagger"
