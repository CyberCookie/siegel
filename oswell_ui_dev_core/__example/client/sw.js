const assets = serviceWorkerOption.assets;
const assetsSet = new Set()
const origin = self.origin;
assets.forEach(asset => {
    assetsSet.add(origin + asset)
})


const cacheURLRegExp = /\.(woff2|png|jpg|ico|css|js|json)/;
const cacheMethod = 'GET'
const isCachable = req => {
    const { url, method } = req;
    return method == cacheMethod && cacheURLRegExp.test(url)   
}

self.addEventListener('fetch', e => {
    const req = e.request;
    isCachable(req) && e.respondWith(
        caches.match(req)
            .then(cachedResp => (
                cachedResp || fetch(req)
                    .then(res => {
                        if (res.ok) {
                            const clonedRes = res.clone()
                            caches.open(req.url)
                                .then(cache => cache.put(req, clonedRes))
            
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
})

self.addEventListener('install', () => { self.skipWaiting() })