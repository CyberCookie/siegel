const assets = serviceWorkerOption.assets;
const assetsSet = new Set()
const origin = self.origin;
assets.forEach(asset => {
    assetsSet.add(origin + asset)
})


// const ASSETS_CACHE_NAME = assets.toString()

// const devCacheRegExp = /\.(woff2|png|jpg|ico)/;
const cacheURLRegExp = /\.(woff2|png|jpg|ico|css|js|json)/;
const cacheMethod = 'GET'
const isCachable = req => {
    const { url, method } = req;
    return method == cacheMethod && cacheURLRegExp.test(url)   
}

self.addEventListener('fetch', e => {
    let req = e.request;
    isCachable(req) && e.respondWith(
        caches.match(req)
            .then(cachedResp => (
                cachedResp || fetch(req)
                    .then(res => {
                        if (res.ok) {
                            caches.open(req.url)
                                .then(cache => cache.put(req, res.clone()))
            
                            return res
                        }
                    })
                    .catch(console.error)
            ))
    )
})


self.addEventListener('activate', () => {
    clients.claim()
        .then(() => {
            caches.keys()
                .then(cachesKeys => {
                    cachesKeys.forEach(cacheName => {
                        assetsSet.has(cacheName) || caches.delete(cacheName)
                    })

                    assetsSet.forEach(asset => {
                        if (!cachesKeys.includes(asset)) {
                            caches.open(asset)
                                .then(cache => {
                                    console.log('add ', asset)
                                    cache.add(asset)
                                })
                        }
                    })
                })
            })
        // .then(() => caches.delete(ASSETS_CACHE_NAME))
        // .then(() => caches.open(ASSETS_CACHE_NAME))
        // .then(cache => cache.addAll(assets))
        // .then(() => { console.log('Client has claimed, new service worker is ready to use') })
        // .catch(console.error)
})

self.addEventListener('install', () => { self.skipWaiting() })