const CACHE_NAME = '1';


let cacheRegExp = /\.(woff2|png|ico|html|css|js|json)/;
let devCacheRegExp = /\.(woff2|png|jpg|ico)/;
function isShouldFetch(req) {
    // return cacheRegExp.test(req.url)
    return devCacheRegExp.test(req.url)
}

self.addEventListener('fetch', e => {
    let req = e.request;

    console.log(req)
    if (req.method == 'GET' && isShouldFetch(req)) {
        e.respondWith(
            caches.match(req).then(resp => (
                resp || fetch(req).then(res => (
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(req, res.clone())
                        return res
                    })
                ))
                .catch(console.error)
            ))
            // caches.open(CACHE_NAME)
            //     .then(cache => cache.match(req))
            //     .then(cachedData => 
            //         cachedData || fetch(req).then(res => {
            //             cache.put(req, res.clone())
            //             return res
            //         })
            //     )
            //     .catch(console.log)
        )
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

            caches.open(CACHE_NAME)
                .then(cache => cache.addAll(serviceWorkerOption.assets))

            console.log('Client has claimed, new service worker is ready to use')
        })
})

self.addEventListener('install', () => { self.skipWaiting() })