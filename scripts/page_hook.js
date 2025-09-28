(() => {
    const post = () => window.postMessage({ type: "DG_NAV" }, "*");
    const _ps = history.pushState.bind(history);
    history.pushState = function (...args) {
        const r = _ps(...args);
        queueMicrotask(post);
        return r;
    };

    const _rs = history.replaceState.bind(history);
    history.replaceState = function (...args) {
        const r = _rs(...args);
        queueMicrotask(post);
        return r;
    };

    window.addEventListener("popstate", post, { passive: true });
})();