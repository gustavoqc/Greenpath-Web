@echo off

:: Check if "web" folder exists
if not exist "web" (
    echo The "web" folder does not exist. Exiting.
    pause
    exit /b
)

:: Navigate to the "web" folder
cd web

:: Check if node_modules folder exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Error during npm install. Exiting.
        pause
        exit /b
    )
    
    :: Restart the script after npm install
    cd ..
    %~dpnx0
    exit /b
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

:: Start web app
npm start
if errorlevel 1 (
    echo Error during npm start. Exiting.
    pause
    exit /b
)

:: Pause to keep the window open
pause
