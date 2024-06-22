document.addEventListener('DOMContentLoaded', function() {
    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    const currentYear = new Date().getFullYear();
    const date = new Date(`June 30 ${currentYear} 09:00:00`);

    // Update countdown time
    function updateCountdown() {
        const currentTime = new Date();
        const diff = date - currentTime;

        const d = Math.floor(diff / 1000 / 60 / 60 / 24);
        const h = Math.floor(diff / 1000 / 60 / 60) % 24;
        const m = Math.floor(diff / 1000 / 60) % 60;
        const s = Math.floor(diff / 1000) % 60;

        days.innerHTML = d + 1;
        hours.innerHTML = h < 10 ? '0' + h : h;
        minutes.innerHTML = m < 10 ? '0' + m : m;
        seconds.innerHTML = s < 10 ? '0' + s : s;
    }

    // Elindítjuk az időzítőt csak a dokumentum betöltődése után
    updateCountdown(); // Azonnal frissítsük az időt
    setInterval(updateCountdown, 1000); // Majd minden másodpercben frissítsük
});
