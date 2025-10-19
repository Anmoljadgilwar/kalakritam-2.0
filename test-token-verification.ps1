# Test Token Verification with a real token
# First login, then test if /api/auth/me works

$baseUrl = "https://api.kalakritam.in"

Write-Host "`n=== Testing User Authentication Flow ===" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl`n" -ForegroundColor Gray

# Test 1: Login
Write-Host "1. Testing Login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "testuser@example.com"
        password = "test123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    
    if ($loginResponse.success) {
        $token = $loginResponse.token
        Write-Host "SUCCESS: Login successful!" -ForegroundColor Green
        Write-Host "Token (first 20 chars): $($token.Substring(0, [Math]::Min(20, $token.Length)))..." -ForegroundColor Gray
        Write-Host "User: $($loginResponse.user.name) ($($loginResponse.user.email))" -ForegroundColor Gray
        
        # Test 2: Verify token with /api/auth/me
        Write-Host "`n2. Testing Token Verification (/api/auth/me)..." -ForegroundColor Yellow
        try {
            $headers = @{
                "Authorization" = "Bearer $token"
                "Content-Type" = "application/json"
            }
            
            $meResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method GET -Headers $headers -ErrorAction Stop
            
            if ($meResponse.success) {
                Write-Host "SUCCESS: Token verified!" -ForegroundColor Green
                Write-Host "User ID: $($meResponse.data.id)" -ForegroundColor Gray
                Write-Host "User Name: $($meResponse.data.name)" -ForegroundColor Gray
                Write-Host "User Email: $($meResponse.data.email)" -ForegroundColor Gray
                Write-Host "Is Active: $($meResponse.data.isActive)" -ForegroundColor Gray
            } else {
                Write-Host "FAILED: $($meResponse.error)" -ForegroundColor Red
            }
        } catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            $errorBody = $_.ErrorDetails.Message
            Write-Host "FAILED: Token verification failed with status $statusCode" -ForegroundColor Red
            Write-Host "Error: $errorBody" -ForegroundColor Red
            
            if ($statusCode -eq 403) {
                Write-Host "`nThis means the authenticateUser middleware is not working correctly." -ForegroundColor Yellow
                Write-Host "The deployment may not have completed or there's a middleware issue." -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "FAILED: $($loginResponse.error)" -ForegroundColor Red
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorBody = $_.ErrorDetails.Message
    Write-Host "FAILED: Login failed with status $statusCode" -ForegroundColor Red
    Write-Host "Error: $errorBody" -ForegroundColor Red
    
    if ($statusCode -eq 404) {
        Write-Host "`nUser not found. Creating a test user..." -ForegroundColor Yellow
        
        # Try to signup
        try {
            $signupBody = @{
                name = "Test User"
                email = "testuser@example.com"
                password = "test123"
            } | ConvertTo-Json
            
            $signupResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/signup" -Method POST -Body $signupBody -ContentType "application/json" -ErrorAction Stop
            
            if ($signupResponse.success) {
                Write-Host "SUCCESS: User created!" -ForegroundColor Green
                Write-Host "Now run this script again to test login." -ForegroundColor Cyan
            }
        } catch {
            Write-Host "Signup failed: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n=== Test Complete ===`n" -ForegroundColor Cyan
