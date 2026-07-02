@echo off
REM ============================================================
REM  Lanceur local du site BOAS Explorer (app React dans app/)
REM  Double-clique sur ce fichier pour demarrer le site.
REM ============================================================
setlocal
cd /d "%~dp0app"

REM --- Verifier que Node.js / npm est installe ---
where npm >nul 2>nul
if errorlevel 1 (
    echo  npm introuvable.
    echo  Installe Node.js ^(https://nodejs.org^), puis relance ce fichier.
    echo.
    pause
    exit /b 1
)

REM --- Premiere utilisation : installer les dependances ---
if not exist node_modules (
    echo  Premiere utilisation : installation des dependances...
    echo  ^(cela peut prendre une minute^)
    echo.
    call npm install
)

echo.
echo  Demarrage du site sur http://localhost:5173 ...
echo  (laisse cette fenetre ouverte tant que tu utilises le site)
echo.

REM Ouvre le navigateur apres 3 secondes, le temps que le serveur demarre
start "" /min cmd /c "timeout /t 3 >nul && start http://localhost:5173"
call npm run dev
