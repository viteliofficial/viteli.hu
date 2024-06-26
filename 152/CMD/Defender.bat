@echo off
chcp 65001 > nul
title Okos CMD Vírusirtó v0.1
color 0A
echo Okos CMD Vírusirtó v0.1
echo ==========================
echo.

REM Definiáljuk a keresési kritériumokat
set "virus_patterns=virus malware trojan ransomware"
set "file_extensions=exe bat vbs cmd"

REM Töröljük az előző eredményeket, ha vannak
del /q "%temp%\viruses.txt" 2>nul

REM Számoljuk meg a feldolgozandó fájlok számát
set "total_files=0"
for %%d in (C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
    for %%e in (%file_extensions%) do (
        set /a "total_files+=1"
    )
)

REM Keresés az összes meghajtón és törlés
setlocal enabledelayedexpansion
set "current_file=0"
set "start_time=!TIME!"

for %%d in (C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
    for %%e in (%file_extensions%) do (
        for %%p in (%virus_patterns%) do (
            echo Keresés: %%d:\*%%p*.%%e
            dir /s /b "%%d:\*%%p*.%%e" 2>nul >> "%temp%\viruses.txt"
        )
    )
)

for /f %%f in ('type "%temp%\viruses.txt" ^| find /c /v ""') do set "total_files=%%f"

for /f "tokens=* delims=" %%f in ('type "%temp%\viruses.txt"') do (
    echo Potenciális vírus talált: %%f
    echo Törlés folyamatban: %%f
    del /f /q "%%f" > nul
    echo Törölve: %%f
    set /a "current_file+=1"
    set /a "percentage_completed=(current_file * 100 / total_files)"
    echo Folyamat: !percentage_completed!%%
)

REM Listázás az eredményekről
echo.
echo Összesítés:
echo ==========================
type "%temp%\viruses.txt" | find /c /v ""

REM Töröljük az ideiglenes fájlt
del /q "%temp%\viruses.txt"

REM Számoljuk ki a teljes időtartamot
set "end_time=!TIME!"
call :calculateElapsedTime "%start_time%" "!end_time!"
echo.
echo Keresés befejezve.
echo Teljes időtartam: !elapsed_time!
echo ==========================
pause
exit /b

:calculateElapsedTime
setlocal
set "start=%~1"
set "end=%~2"

rem Konvertáljuk az időket másodpercekbe
for /f "tokens=1-4 delims=:.," %%a in ("%start%") do (
    set /a "start_seconds=((((%%a * 60) + %%b) * 60) + %%c) * 100 + %%d"
)

for /f "tokens=1-4 delims=:.," %%a in ("%end%") do (
    set /a "end_seconds=((((%%a * 60) + %%b) * 60) + %%c) * 100 + %%d"
)

rem Számoljuk ki az eltelt időt másodpercekben
set /a "elapsed_seconds=end_seconds - start_seconds"
set /a "hours=elapsed_seconds / 360000"
set /a "elapsed_seconds%%=360000"
set /a "minutes=elapsed_seconds / 6000"
set /a "elapsed_seconds%%=6000"
set /a "seconds=elapsed_seconds / 100"
set /a "hundredths=elapsed_seconds %% 100"

rem Formázzuk az időt az eredményhez
if %hours% gtr 0 (
    set "elapsed_time=%hours% óra %minutes% perc %seconds%.%hundredths% másodperc"
) else if %minutes% gtr 0 (
    set "elapsed_time=%minutes% perc %seconds%.%hundredths% másodperc"
) else (
    set "elapsed_time=%seconds%.%hundredths% másodperc"
)

endlocal & set "elapsed_time=%elapsed_time%"
exit /b
