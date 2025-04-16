@echo off
echo ===== GREEN GitHub Pages Deployment =====
echo Building application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo Build failed with error code %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)
echo.
echo Building successful! Running deployment script...
echo.
call node scripts/deploy.js
if %ERRORLEVEL% NEQ 0 (
  echo Deployment failed with error code %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)
echo.
echo ===== Deployment Complete =====
echo Remember to verify your GitHub Pages settings at:
echo https://github.com/RorriMaesu/GREEN/settings/pages
echo.
echo Set the following options:
echo Source: Deploy from a branch
echo Branch: gh-pages / (root)
echo.
