@echo off
REM Set environment variables dynamically
SET REACT_APP_LOGS_ENV=production

SET REACT_APP_AUTHSERVICE=https://op360.greenware.app:8443/authservice_op360
SET REACT_APP_TASKAPI=https://op360.greenware.app:8443/taskapi_op360
SET REACT_APP_USERMODULE=https://op360.greenware.app:8443/usermodule_op360
SET REACT_APP_ASSETAPI=https://op360.greenware.app:8443/assetapi_op360
SET REACT_APP_USERGROUPS=https://op360.greenware.app:8443/usergroup_op360
SET REACT_APP_LOGBOOK=https://op360.greenware.app:8443/logbook_op360
SET REACT_APP_DASHBOARDAPI=https://op360.greenware.app:8443/dashboardapi_op360
SET REACT_APP_JOBAPI=https://op360.greenware.app:8443/jobapi_op360
SET REACT_APP_MAILAPI=https://op360.greenware.app:8443/mail_op360
SET REACT_APP_HOME=https://op360.greenware.app
SET REACT_APP_PERFORMERPAGE=https://op360.greenware.app/workflow/performer
SET REACT_APP_MONGODBAPI=https://op360.greenware.app:8443/chatbot_op360

echo All API endpoints are configured
REM Delete the previous build folder
if exist build (
    echo Deleting the previous build folder...
    rmdir /s /q build
    echo Previous build deleted.
) else (
    echo No previous build folder found.
)
REM Display the variables for confirmation
echo REACT_APP_LOGS_ENV=%REACT_APP_LOGS_ENV%

REM Run the build command
echo Starting the build process...
npm run build
