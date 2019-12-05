const CACHE_NAME = 'cache_v3';


let cacheRegExp = /\.(woff2|woff|png|ico|html|css|js)/;
let devCacheRegExp = /\.(woff2|png|jpg|ico)/;
function isShouldFetch(req) {
    // return cacheRegExp.test(req.url)
    return req.url.includes('/image?') || devCacheRegExp.test(req.url)
}

self.addEventListener('fetch', e => {
    let req = e.request;

    if (req.method == 'GET' && isShouldFetch(req)) {
        e.respondWith(
            caches.open(CACHE_NAME)
                .then(cache => cache.match(req)
                    .then(cachedData => 
                        cachedData || fetch(req).then(res => {
                            cache.put(req, res.clone())
                            return res
                        })
                    )
                .catch(console.log)
        ))
    }
})

self.addEventListener('activate', () => {
    clients.claim()
        .then(() => {
            caches.keys().then(keys => {
                keys.forEach(key => {
                    key != CACHE_NAME && caches.delete(key)
                })
            })
            console.log('Client has claimed, new service worker is ready to use')
        })
        .catch(console.log)
})

self.addEventListener('install', () => { self.skipWaiting() })
