function injectPageHook() {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('scripts/page_hook.js')
}


function isDisallowedPath(pathname) {
    console.debug("CHECK RAN?")
    if (pathname === '/')
        return true;
    if (pathname.startsWith('/reels'))
        return true;
    if (pathname.startsWith('/explore'))
        return true;
    return false;
}


function enforce(target_url) {
    try {
        if (!location.hostname.endsWith('instagram.com'))
            return;
        const path = location.pathname || '/';
        if (path.startsWith('/direct/'))
            return;
        if (isDisallowedPath(path)) {
            if (location.href !== target_url) {
                location.replace(target_url);
            }
        }
    } catch { }
}


(() => {
    'use strict';
    const DIRECT_URL = 'https://www.instagram.com/direct/inbox/';
    
    // 
    (function injectPageHook() {
        console.debug("page hooked")
        const s = document.createElement('script');
        s.src = chrome.runtime.getURL('scripts/page_hook.js'); 
        (document.head || document.documentElement).appendChild(s);
        s.remove();
    })();

    window.addEventListener('message', (ev) => {
        if (ev.source !== windows)
            return;
        if (!ev.data || ev.data.type !== 'DG_NAV')
            return;
        enforce(DIRECT_URL)
    })

    document.addEventListener('click', (ev) => {
        // find the the link that was clicked
        const a = ev.target && ev.target.closest && ev.target.closest('a[href]');
        if (!a)
            return;

        const url = new URL(a.href, location.href);
        if (url.origin !== location.origin)
            return;
        
        if (isDisallowedPath(url.pathname)) {
            ev.preventDefault();
            ev.stopPropagation();
            if (location.href !== DIRECT_URL)
                location.replace(DIRECT_URL)
        }
    }, true);
     
    
    enforce(DIRECT_URL);
})();