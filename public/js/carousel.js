let currentBannerIdx = 0;
const totalBanners = 3;
let bannerTimer = null;

function setBanner(index) {
    currentBannerIdx = index;
    const wrapper = document.getElementById('banner-wrapper');
    if (wrapper) {
        wrapper.style.transform = `translateX(-${currentBannerIdx * 100}%)`;
    }
    const dots = document.querySelectorAll('.carousel-dots .dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentBannerIdx);
    });
    resetBannerTimer();
}

function moveBanner(direction) {
    let nextIndex = currentBannerIdx + direction;
    if (nextIndex >= totalBanners) nextIndex = 0;
    if (nextIndex < 0) nextIndex = totalBanners - 1;
    setBanner(nextIndex);
}

function startBannerAutoSlide() {
    bannerTimer = setInterval(() => {
        moveBanner(1);
    }, 4000);
}

function resetBannerTimer() {
    clearInterval(bannerTimer);
    startBannerAutoSlide();
}
