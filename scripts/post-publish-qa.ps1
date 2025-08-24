# Post-Publish QA Checkliste für Card Expandable v1.0.0 (PowerShell)

Write-Host "🔍 Post-Publish QA Checkliste für Card Expandable v1.0.0" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray
Write-Host ""

$allChecksPassed = $true
$results = @()

# Helper: Check ausführen und Ergebnis speichern
function Invoke-QACheck {
    param(
        [string]$Name,
        [scriptblock]$CheckScript
    )
    
    try {
        $result = & $CheckScript
        $results += [PSCustomObject]@{ Name = $Name; Status = "✅ PASS"; Details = $result }
        Write-Host "✅ $Name`: $result" -ForegroundColor Green
    }
    catch {
        $results += [PSCustomObject]@{ Name = $Name; Status = "❌ FAIL"; Details = $_.Exception.Message }
        Write-Host "❌ $Name`: $($_.Exception.Message)" -ForegroundColor Red
        $script:allChecksPassed = $false
    }
}

# 1. NPM Version Check
Invoke-QACheck -Name "NPM Version Check" -CheckScript {
    try {
        $output = npm info card-expandable version 2>$null
        if ($output -eq "1.0.0") {
            return "Version $output ✓"
        } else {
            throw "Unerwartete Version: $output (erwartet: 1.0.0)"
        }
    } catch {
        throw "NPM Check fehlgeschlagen: $($_.Exception.Message)"
    }
}

# 2. Frisches Testprojekt
Invoke-QACheck -Name "Frisches Testprojekt" -CheckScript {
    $testDir = "$env:TEMP\ce-test"
    
    try {
        # Verzeichnis erstellen
        if (Test-Path $testDir) { Remove-Item $testDir -Recurse -Force }
        New-Item -ItemType Directory -Path $testDir | Out-Null
        
        # NPM init
        Set-Location $testDir
        npm init -y | Out-Null
        
        # Package installieren
        npm install card-expandable@1.0.0 | Out-Null
        
        # Modul laden testen
        $output = node -e "require('./node_modules/card-expandable/dist/card-expandable.min.js'); console.log('Loaded OK')" 2>$null
        
        if ($output -match "Loaded OK") {
            return "Modul erfolgreich geladen ✓"
        } else {
            throw "Unerwartete Ausgabe: $output"
        }
    } catch {
        throw "Testprojekt Setup fehlgeschlagen: $($_.Exception.Message)"
    } finally {
        # Zurück zum ursprünglichen Verzeichnis
        Set-Location $PSScriptRoot\..
    }
}

# 3. CDN Verfügbarkeit
Invoke-QACheck -Name "CDN Verfügbarkeit" -CheckScript {
    try {
        $response = Invoke-WebRequest -Uri "https://unpkg.com/card-expandable@1.0.0/dist/card-expandable.min.js" -Method Head -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            return "CDN erreichbar ✓"
        } else {
            throw "CDN nicht erreichbar: Status $($response.StatusCode)"
        }
    } catch {
        throw "CDN Check fehlgeschlagen: $($_.Exception.Message)"
    }
}

# 4. SRI Hash Validierung
Invoke-QACheck -Name "SRI Hash Validierung" -CheckScript {
    try {
        # Aktuellen Hash aus der Build-Datei berechnen
        if (-not (Test-Path "dist/card-expandable.min.js")) {
            throw "Build-Datei nicht gefunden"
        }
        
        $data = Get-Content "dist/card-expandable.min.js" -Raw -Encoding Byte
        $sha384 = [System.Security.Cryptography.SHA384]::Create()
        $hashBytes = $sha384.ComputeHash($data)
        $currentHash = "sha384-" + [Convert]::ToBase64String($hashBytes)
        
        # Hash in README finden
        $readme = Get-Content "README.md" -Raw
        $hashMatch = [regex]::Match($readme, "sha384-[A-Za-z0-9+/=]+")
        
        if (-not $hashMatch.Success) {
            throw "Kein SRI Hash in README gefunden"
        }
        
        $readmeHash = $hashMatch.Value
        
        if ($currentHash -eq $readmeHash) {
            return "SRI Hash stimmt überein ✓ ($($currentHash.Substring(0, 20))...)"
        } else {
            throw "Hash-Mismatch: Build=$($currentHash.Substring(0, 20))... vs README=$($readmeHash.Substring(0, 20))..."
        }
    } catch {
        throw "SRI Validierung fehlgeschlagen: $($_.Exception.Message)"
    }
}

# 5. TODO Check
Invoke-QACheck -Name "TODO Check" -CheckScript {
    try {
        if (Test-Path "src") {
            $todos = Get-ChildItem -Path "src" -Recurse -File | Select-String "TODO" | Measure-Object
            
            if ($todos.Count -eq 0) {
                return "Keine offenen TODOs gefunden ✓"
            } else {
                throw "$($todos.Count) offene TODO(s) gefunden"
            }
        } else {
            return "Kein src-Verzeichnis vorhanden ✓"
        }
    } catch {
        throw "TODO Check fehlgeschlagen: $($_.Exception.Message)"
    }
}

# 6. Git Tag Check
Invoke-QACheck -Name "Git Tag Check" -CheckScript {
    try {
        $output = git tag -l v1.0.0 2>$null
        
        if ($output -eq "v1.0.0") {
            return "Git Tag v1.0.0 existiert ✓"
        } else {
            throw "Git Tag nicht gefunden: $output"
        }
    } catch {
        throw "Git Tag Check fehlgeschlagen: $($_.Exception.Message)"
    }
}

# 7. Bundle Size Check
Invoke-QACheck -Name "Bundle Size Check" -CheckScript {
    try {
        if (-not (Test-Path "dist/card-expandable.min.js")) {
            throw "Build-Datei nicht gefunden"
        }
        
        $fileInfo = Get-Item "dist/card-expandable.min.js"
        $sizeKB = [math]::Round($fileInfo.Length / 1KB, 1)
        
        if ($fileInfo.Length -lt 10KB) {
            return "Bundle Size: $sizeKB KB ✓"
        } else {
            throw "Bundle zu groß: $sizeKB KB (Ziel: <10KB)"
        }
    } catch {
        throw "Bundle Size Check fehlgeschlagen: $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host "📊 QA Ergebnisse Zusammenfassung:" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

foreach ($result in $results) {
    if ($result.Status -eq "✅ PASS") {
        Write-Host "$($result.Status) $($result.Name)" -ForegroundColor Green
    } else {
        Write-Host "$($result.Status) $($result.Name)" -ForegroundColor Red
    }
}

Write-Host ""
if ($allChecksPassed) {
    Write-Host "🎯 Gesamtergebnis: ✅ ALLE CHECKS BESTANDEN" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Release v1.0.0 ist bereit für den Produktiveinsatz!" -ForegroundColor Green
    Write-Host "🚀 Alle Qualitätsstandards erfüllt." -ForegroundColor Green
} else {
    Write-Host "🎯 Gesamtergebnis: ❌ EINIGE CHECKS FEHLGESCHLAGEN" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Nächste Schritte:" -ForegroundColor Yellow
    Write-Host "1. Fehlgeschlagene Checks analysieren"
    Write-Host "2. Probleme beheben"
    Write-Host "3. QA Script erneut ausführen"
    exit 1
}
