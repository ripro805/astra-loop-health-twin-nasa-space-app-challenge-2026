$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$baseDir = "D:\KnowledgeVault\Project\astra-loop-health-twin-nasa-space-app-challenge-2026\docs\screenshots"
$tempDir = "C:\Users\rifat\AppData\Local\Temp\chrome_shot"

$pages = @(
  @{ name = "landing-desktop"; url = "http://localhost:3000/"; size = "1280,900" },
  @{ name = "landing-mobile"; url = "http://localhost:3000/"; size = "390,844" },
  @{ name = "body-view"; url = "http://localhost:3000/body"; size = "1280,900" },
  @{ name = "body-mobile"; url = "http://localhost:3000/body"; size = "390,844" },
  @{ name = "dashboard-v2"; url = "http://localhost:3000/today"; size = "1280,900" },
  @{ name = "dashboard-mobile"; url = "http://localhost:3000/today"; size = "390,844" },
  @{ name = "learn-hub"; url = "http://localhost:3000/learn"; size = "1280,900" },
  @{ name = "routine"; url = "http://localhost:3000/routine"; size = "1280,900" },
  @{ name = "guidance-wizard"; url = "http://localhost:3000/guidance"; size = "1280,900" },
  @{ name = "gamification"; url = "http://localhost:3000/progress"; size = "1280,900" },
  @{ name = "radiation-v2"; url = "http://localhost:3000/radiation"; size = "1280,900" },
  @{ name = "what-if-v2"; url = "http://localhost:3000/what-if"; size = "1280,900" },
  @{ name = "surgeon-report"; url = "http://localhost:3000/report"; size = "1280,900" }
)

foreach ($page in $pages) {
  $file = "$baseDir\$($page.name).png"
  $args = "--headless=new --disable-gpu --user-data-dir=`"$tempDir`" --window-size=$($page.size) --virtual-time-budget=2000 --screenshot=`"$file`" $($page.url)"
  Write-Host "Capturing $($page.name)..."
  Start-Process -FilePath $chrome -ArgumentList $args -Wait
}

Write-Host "Screenshots captured successfully."

