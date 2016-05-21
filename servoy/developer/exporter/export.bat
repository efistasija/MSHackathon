@echo off
rem ## sample launch: export.bat -s _START_HERE -o D:\temp -data C:\Users\user\servoy_workspace -verbose -sd -i18n -users -modules

rem ## set path to eclipse folder. If local folder, use '.'; otherwise, use c:\path\to\eclipse
set ECLIPSEHOME=..
 
rem ## get path to equinox jar inside ECLIPSEHOME folder
for /f "delims= tokens=1" %%c in ('dir /B /S /OD %ECLIPSEHOME%\plugins\org.eclipse.equinox.launcher_*.jar') do set EQUINOXJAR=%%c

rem ## LAUNCH
java -Xms40m -Xmx512m -XX:MaxPermSize=256M -Djava.awt.headless=true -jar "%EQUINOXJAR%" -application com.servoy.eclipse.exporter.solution.application %*