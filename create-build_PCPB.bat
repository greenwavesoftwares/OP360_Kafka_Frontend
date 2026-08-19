@echo off
REM Set environment variables dynamically
SET REACT_APP_LOGS_ENV=production

SET REACT_APP_AUTHSERVICE=http://10.232.0.27:8090/authservice_op360
SET REACT_APP_TASKAPI=http://10.232.0.27:8090/taskapi_op360
SET REACT_APP_USERMODULE=http://10.232.0.27:8090/usermodule_op360
SET REACT_APP_ASSETAPI=http://10.232.0.27:8090/assetapi_op360
SET REACT_APP_USERGROUPS=http://10.232.0.27:8090/usergroup_op360
SET REACT_APP_LOGBOOK=http://10.232.0.27:8090/logbook_op360
SET REACT_APP_DASHBOARDAPI=http://10.232.0.27:8090/dashboardapi_op360
SET REACT_APP_JOBAPI=http://10.232.0.27:8090/jobapi_op360
SET REACT_APP_MAILAPI=http://10.232.0.27:8090/mail_op360
SET REACT_APP_HOME=http://10.232.0.27
SET REACT_APP_PERFORMERPAGE=http://10.232.0.27:8090/workflow/performer
SET REACT_APP_MONGODBAPI=http://10.232.0.27:8090/chatbot_op360

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
