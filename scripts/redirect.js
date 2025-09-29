function isDisallowedPath(pathname) {
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
    
    window.addEventListener('message', (ev) => {
        if (ev.source !== windows)
            return;
        if (!ev.data || ev.data.type !== 'DG_NAV')
            return;
        enforce(DIRECT_URL)
    })

    document.addEventListener('click', (ev) => {
        const link_clicked = ev.target && ev.target.closest && ev.target.closest('a[href]');
        if (!link_clicked)
            return;

        const url = new URL(link_clicked.href, location.href);
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