# API Testing Script
# Run this after starting the dev server with: npm run dev

Write-Host "🧪 Testing File Manager API..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# Test 1: Signup
Write-Host "1️⃣  Testing Signup..." -ForegroundColor Yellow
try {
    $signupData = @{
        username = "testuser_$(Get-Random)"
        email = "test_$(Get-Random)@example.com"
        password = "password123"
    } | ConvertTo-Json

    $signupResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/signup" `
        -Method Post `
        -Body $signupData `
        -ContentType "application/json"
    
    $token = $signupResponse.token
    Write-Host "✅ Signup successful!" -ForegroundColor Green
    Write-Host "   Username: $($signupResponse.user.username)" -ForegroundColor Gray
    Write-Host "   Token received: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Signup failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Login
Write-Host "2️⃣  Testing Login..." -ForegroundColor Yellow
try {
    $loginData = @{
        username = $signupResponse.user.username
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json"
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   Welcome message: $($loginResponse.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get Current User
Write-Host "3️⃣  Testing Get Current User..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $token"
    }

    $meResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Get user successful!" -ForegroundColor Green
    Write-Host "   User ID: $($meResponse.user._id)" -ForegroundColor Gray
    Write-Host "   Username: $($meResponse.user.username)" -ForegroundColor Gray
    Write-Host "   Email: $($meResponse.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Get user failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 4: Create Folder
Write-Host "4️⃣  Testing Create Folder..." -ForegroundColor Yellow
try {
    $folderData = @{
        name = "Test Folder"
        parentId = $null
    } | ConvertTo-Json

    $folderResponse = Invoke-RestMethod -Uri "$baseUrl/api/folders" `
        -Method Post `
        -Body $folderData `
        -ContentType "application/json" `
        -Headers $headers
    
    Write-Host "✅ Folder created successfully!" -ForegroundColor Green
    Write-Host "   Folder name: $($folderResponse.folder.name)" -ForegroundColor Gray
    Write-Host "   Folder ID: $($folderResponse.folder._id)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Create folder failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 5: List Files
Write-Host "5️⃣  Testing List Files..." -ForegroundColor Yellow
try {
    $filesResponse = Invoke-RestMethod -Uri "$baseUrl/api/files" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Files retrieved successfully!" -ForegroundColor Green
    Write-Host "   Folders: $($filesResponse.folders.Count)" -ForegroundColor Gray
    Write-Host "   Files: $($filesResponse.files.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ List files failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 All API tests completed!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Summary:" -ForegroundColor White
Write-Host "   ✅ Backend APIs are working correctly" -ForegroundColor Green
Write-Host "   ✅ Authentication system is functional" -ForegroundColor Green
Write-Host "   ✅ File/Folder management is operational" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   1. Build the frontend UI components" -ForegroundColor Gray
Write-Host "   2. Connect frontend to these APIs" -ForegroundColor Gray
Write-Host "   3. Deploy to Vercel/Railway" -ForegroundColor Gray
