let timers = new Set();
let isCleanupActive = false;

export const registerTimer = (id) => {
    if (isCleanupActive) {
        clearTimeout(id);
        clearInterval(id);
        return;
    }
    timers.add(id);
};

export const clearAllTimers = () => {
    isCleanupActive = true;

    timers.forEach((id) => {
        clearTimeout(id);
        clearInterval(id);
    });

    timers.clear();

    // Allow timers again (after a short delay)
    setTimeout(() => {
        isCleanupActive = false;
    }, 50);
};
