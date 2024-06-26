@echo off
chcp 65001 > nul
echo Hálózati információk:
echo =====================

:: IP konfigurációs adatok
echo IP konfiguráció és hálózati adapterek:
echo --------------------
ipconfig /all
echo =====================

:: Aktív TCP és UDP kapcsolatok
echo Aktív TCP és UDP kapcsolatok:
echo --------------------
netstat -a
echo =====================

:: Részletes TCP kapcsolatok
echo Részletes TCP kapcsolatok:
echo --------------------
netstat -an | find "TCP"
echo =====================

:: Aktív portok és folyamatok
echo Aktív portok és folyamatok:
echo --------------------
netstat -ab
echo =====================

:: Routing tábla
echo Útvonal táblázat:
echo --------------------
route print
echo =====================

:: ARP tábla
echo ARP tábla:
echo --------------------
arp -a
echo =====================

:: DNS gyorsítótár
echo DNS gyorsítótár tartalma:
echo --------------------
ipconfig /displaydns
echo =====================

:: Hálózati interfész statisztikák
echo Aktuális hálózati interfész statisztikák:
echo --------------------
netstat -e
echo =====================

:: Részletes hálózati interfész statisztikák
echo Részletes hálózati interfész statisztikák:
echo --------------------
netstat -s
echo =====================

:: Hálózati megosztások
echo Hálózati megosztások listázása:
echo --------------------
net share
echo =====================

:: Hálózati útvonal tesztelése
echo Útvonal tesztelése (tracert) google.com:
echo --------------------
tracert google.com
echo =====================

:: Hálózati diagnosztika
echo Hálózati diagnosztika:
echo --------------------
netsh diag show all
echo =====================

:: Windows tűzfal állapot
echo Windows tűzfal állapota:
echo --------------------
netsh advfirewall show allprofiles
echo =====================

:: Wi-Fi hálózatok listázása (csak ha van Wi-Fi adapter)
echo Wi-Fi hálózatok listázása:
echo --------------------
netsh wlan show networks
echo =====================

:: Wi-Fi profilok listázása
echo Wi-Fi profilok listázása:
echo --------------------
netsh wlan show profiles
echo =====================

:: Wi-Fi profil részletei
for /f "tokens=*" %%i in ('netsh wlan show profiles ^| findstr "Profile"') do (
    set "profile=%%i"
    set "profile=!profile:~25!"
    echo Wi-Fi profil részletei: !profile!
    netsh wlan show profiles name="!profile!" key=clear
    echo =====================
)

pause
