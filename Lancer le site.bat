@echo off
REM ============================================================
REM  Lanceur local du site BOAS Explorer
REM  Double-clique sur ce fichier pour demarrer le site.
REM ============================================================
setlocal
cd /d "%~dp0"

set PORT=8000
set PAGE=BOAS%%20Explorer.dc.html

echo.
echo  Demarrage du serveur local sur le port %PORT% ...
echo  (laisse cette fenetre ouverte tant que tu utilises le site)
echo.

REM --- Essai 1 : Python ---
where python >nul 2>nul
if %errorlevel%==0 (
    start "" "http://localhost:%PORT%/%PAGE%"
    python -m http.server %PORT%
    goto :eof
)

REM --- Essai 2 : py launcher ---
where py >nul 2>nul
if %errorlevel%==0 (
    start "" "http://localhost:%PORT%/%PAGE%"
    py -m http.server %PORT%
    goto :eof
)

REM --- Essai 3 : Node / npx ---
where npx >nul 2>nul
if %errorlevel%==0 (
    start "" "http://localhost:%PORT%/%PAGE%"
    npx --yes serve -l %PORT%
    goto :eof
)

echo  AUCUN serveur trouve.
echo  Installe Python (https://www.python.org/downloads/) en cochant
echo  "Add Python to PATH", puis relance ce fichier.
echo.
pause
