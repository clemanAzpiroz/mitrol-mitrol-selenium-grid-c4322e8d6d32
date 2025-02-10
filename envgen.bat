@ECHO OFF

SETLOCAL ENABLEDELAYEDEXPANSION 
SET dir=AUDIODIR=%~d0%~p0
SET dir=%dir:\=/%

SET ENV_DIR=%~d0%~p0

SET dir=%dir:/webpad2-test/=/webpad2-test/voice.wav%
SET ENV_DIR=%ENV_DIR:\webpad2-test\=\webpad2-test\.env%

IF NOT EXIST %ENV_DIR% GOTO NoExiste

Findstr AUDIODIR= %ENV_DIR% >> temp_file.temp
IF %errorlevel% == 1 GOTO ERROR
IF %errorlevel% == 0 GOTO OK

:OK
findstr /v AUDIODIR  %ENV_DIR% > temp.txt
ECHO. >> temp.txt
ECHO %dir% >> temp.txt
COPY temp.txt %ENV_DIR%
GOTO Fin

:ERROR
ECHO.
ECHO %dir% >> %ENV_DIR%
GOTO Fin

:NoExiste
ECHO WEBPAD_URL= > %ENV_DIR%
ECHO AGENT_COUNT=1 >> %ENV_DIR%
ECHO MAX=1 >> %ENV_DIR%
ECHO %dir% >> %ENV_DIR%
GOTO Fin

:Fin
DEL /q temp_file.temp
DEL /q temp.txt
exit
