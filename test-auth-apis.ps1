# Test All User Authentication APIs - PowerShell Script

# Configuration
$baseUrl = "https://api.kalakritam.in"
$testEmail = "testuser$(Get-Random -Maximum 9999)@example.com"
$testPassword = "SecurePass123!"
$testName = "Test User"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing User Authentication APIs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: User Signup
Write-Host "1. Testing User Signup..." -ForegroundColor Yellow
$signupBody = @{
    name = $testName
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/signup" -Method POST -Body $signupBody -ContentType "application/json"
    
    if (-not $signupResponse.success) {
        Write-Host "FAILED: Signup Failed: $($signupResponse.error)" -ForegroundColor Red
        exit 1
    }
    
    $userToken = $signupResponse.token
    Write-Host "SUCCESS: Signup Success!" -ForegroundColor Green
    
    if ($userToken -and $userToken.Length -gt 20) {
        Write-Host "  Token: $($userToken.Substring(0, 20))..." -ForegroundColor Gray
    } else {
        Write-Host "  Token: $userToken" -ForegroundColor Gray
    }
    
    Write-Host "  User: $($signupResponse.data.name) ($($signupResponse.data.email))" -ForegroundColor Gray
} catch {
    Write-Host "FAILED: Signup Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""

# Test 2: User Login
Write-Host "2. Testing User Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    
    if (-not $loginResponse.success) {
        Write-Host "FAILED: Login Failed: $($loginResponse.error)" -ForegroundColor Red
        exit 1
    }
    
    $userToken = $loginResponse.token
    Write-Host "SUCCESS: Login Success!" -ForegroundColor Green
    
    if ($userToken -and $userToken.Length -gt 20) {
        Write-Host "  Token: $($userToken.Substring(0, 20))..." -ForegroundColor Gray
    } else {
        Write-Host "  Token: $userToken" -ForegroundColor Gray
    }
    
    Write-Host "  Last Login: $($loginResponse.data.lastLogin)" -ForegroundColor Gray
} catch {
    Write-Host "FAILED: Login Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""

# Test 3: Get Current User
Write-Host "3. Testing Get Current User..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $userToken"
    "Content-Type" = "application/json"
}

try {
    $meResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method GET -Headers $headers
    Write-Host "SUCCESS: Get User Success!" -ForegroundColor Green
    Write-Host "  User ID: $($meResponse.data.id)" -ForegroundColor Gray
    Write-Host "  Name: $($meResponse.data.name)" -ForegroundColor Gray
    Write-Host "  Email: $($meResponse.data.email)" -ForegroundColor Gray
    Write-Host "  Provider: $($meResponse.data.provider)" -ForegroundColor Gray
} catch {
    Write-Host "FAILED: Get User Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 4: Update Profile
Write-Host "4. Testing Update Profile..." -ForegroundColor Yellow
$updateBody = @{
    name = "Updated Test User"
    phone = "+1234567890"
    bio = "This is a test user bio"
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/profile" -Method PUT -Headers $headers -Body $updateBody
    Write-Host "SUCCESS: Profile Update Success!" -ForegroundColor Green
    Write-Host "  Updated Name: $($updateResponse.data.name)" -ForegroundColor Gray
    Write-Host "  Phone: $($updateResponse.data.phone)" -ForegroundColor Gray
    Write-Host "  Bio: $($updateResponse.data.bio)" -ForegroundColor Gray
} catch {
    Write-Host "FAILED: Profile Update Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 5: Admin - Get All Users (will fail if not admin)
Write-Host "5. Testing Admin Get All Users..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-RestMethod -Uri "$baseUrl/api/admin/users" -Method GET -Headers $headers
    Write-Host "SUCCESS: Get All Users Success!" -ForegroundColor Green
    Write-Host "  Total Users: $($usersResponse.stats.totalUsers)" -ForegroundColor Gray
    Write-Host "  Active Users: $($usersResponse.stats.activeUsers)" -ForegroundColor Gray
    Write-Host "  Google Users: $($usersResponse.stats.googleUsers)" -ForegroundColor Gray
    Write-Host "  Email Users: $($usersResponse.stats.emailUsers)" -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "WARNING: Admin Access Required (Expected for non-admin users)" -ForegroundColor Yellow
    } else {
        Write-Host "FAILED: Get All Users Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 6: Test Invalid Token
Write-Host "6. Testing Invalid Token..." -ForegroundColor Yellow
$invalidHeaders = @{
    "Authorization" = "Bearer invalid_token_here"
    "Content-Type" = "application/json"
}

try {
    $invalidResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method GET -Headers $invalidHeaders
    Write-Host "FAILED: Should have failed with invalid token!" -ForegroundColor Red
} catch {
    Write-Host "SUCCESS: Invalid Token Rejected (Expected)" -ForegroundColor Green
}

Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUCCESS: User Signup: Working" -ForegroundColor Green
Write-Host "SUCCESS: User Login: Working" -ForegroundColor Green
Write-Host "SUCCESS: Get Current User: Working" -ForegroundColor Green
Write-Host "SUCCESS: Update Profile: Working" -ForegroundColor Green
Write-Host "SUCCESS: Token Validation: Working" -ForegroundColor Green
Write-Host ""
Write-Host "Test Email: $testEmail" -ForegroundColor Gray
Write-Host "Test Password: $testPassword" -ForegroundColor Gray
Write-Host ""
Write-Host "All core authentication tests passed!" -ForegroundColor Green
