@echo off
cd %CD%

set SCRIPT="%CD%\tmp\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"


echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = "%CD%\NodeJs Coub Downloader.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "cmd" >> %SCRIPT%
echo oLink.Arguments = "/C %CD%\run.bat" >> %SCRIPT%
echo oLink.WorkingDirectory = "%CD%\" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT%
del %SCRIPT%


redist\node-v12.17.0-x64.msi
npm i