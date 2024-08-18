function smoothScrollToTop(duration) {
    // Ambil posisi scroll saat ini
    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

    function scroll() {
        const currentTime = 'now' in window.performance ? performance.now() : new Date().getTime();
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, start, -start, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(scroll);
    }

    // Fungsi easing
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(scroll);
}

// Ketika tombol diklik, gulir ke atas dengan smooth
document.getElementById("backToTop").addEventListener("click", function(e) {
    e.preventDefault();
    smoothScrollToTop(1000); // 1000ms = 1 detik untuk durasi animasi
});