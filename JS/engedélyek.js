let notificationsEnabled = false; // Default value

async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        notificationsEnabled = (permission === "granted");
    } catch (error) {
        console.error("Error requesting notification permission:", error);
    }
}
