// Define constants
const LIB_VERSION = "0.8";
const DEVELOPERS = ["NetBy"];
const STORAGE_KEY = "NetBy-Lib";

// Function to get current date and time as a formatted string
function getCurrentDateTime() {
    return new Date().toLocaleString();
}

// Function to log and store library information
function logAndStoreLibraryInfo() {
    const dateTime = getCurrentDateTime();
    const logMessage = `${dateTime} v${LIB_VERSION} DEV: ${DEVELOPERS.join(", ")}`;

    // Log to console
    console.log(logMessage);

    // Store in local storage
    try {
        localStorage.setItem(STORAGE_KEY, logMessage);
    } catch (e) {
        console.error("Failed to save to localStorage:", e);
    }
}

// Call the function to execute logging and storage
logAndStoreLibraryInfo();
