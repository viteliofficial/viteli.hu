let értesítések_engedélyezve = false //Alap Érték

function Értesítés_Engedélykérés() {
    Notification.requestPermission().then(perm => {
        if (perm === "granted") {
           értesítések_engedélyezve = true
        }
    })
}
