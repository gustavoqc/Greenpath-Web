@echo off

:: Check if "server" folder exists
if not exist "server" (
    echo The "server" folder does not exist. Exiting.
    pause
    exit /b
)

:: Navigate to the "server" folder
cd server

:: Check if node_modules folder exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Error during npm install. Exiting.
        pause
        exit /b
    )
) else (
    echo Dependencies are already installed. Skipping npm install.
)

:: Check if axios is installed (in node_modules)
if not exist "node_modules\axios" (
    echo Installing axios...
    npm install axios
    if errorlevel 1 (
        echo Error during npm install axios. Exiting.
        pause
        exit /b
    )
) else (
    echo Axios is already installed. Skipping npm install axios.
)

:: Start development server
echo Starting the development server...
npm run dev
if errorlevel 1 (
    echo Error during npm run dev. Exiting.
    pause
    exit /b
)

:: Pause to prevent window from closing
pause
