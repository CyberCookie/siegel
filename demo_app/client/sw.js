//TODO?: caching via etag

const assetsSet = new Set()
const origin = self.origin

// generated by serviceworker-webpack-plugin
// eslint-disable-next-line
buildOutput.forEach(asset => {
    assetsSet.add(`${origin}/${asset}`)
})


const cacheURLRegExp = /\.(woff2|png|jpg|ico|css|js|json)/
const cacheMethod = 'GET'
const isCachable = req => {
    const { url, method } = req
    return method == cacheMethod && cacheURLRegExp.test(url)
}

async function processRequest(req) {
    const cachedResp = await caches.match(req)
    if (cachedResp) return cachedResp
    else try {
        const res = await fetch(req)
        if (res.ok) {
            const clonedRes = res.clone()
            caches.open(req.url)
                .then(cache => cache.put(req, clonedRes))

            return res
        }
    } catch(e) { console.error(e) }
}


self.addEventListener('fetch', e => {
    const req = e.request
    isCachable(req) && e.respondWith( processRequest(req) )
})

self.addEventListener('activate', async () => {
    await self.clients.claim()

    const cachesKeys = await caches.keys()
    cachesKeys.forEach(cacheName => {
        assetsSet.has(cacheName) || caches.delete(cacheName)
    })

    const cachesKeysSet = new Set(cachesKeys)
    assetsSet.forEach(async asset => {
        if (!cachesKeysSet.has(asset)) {
            const cache = await caches.open(asset)
            cache.add(asset)
        }
    })
})

self.addEventListener('install', () => { self.skipWaiting() })