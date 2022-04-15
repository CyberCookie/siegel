type SEOParams = {
    title?: string
    description?: string
    keywords?: string
} & Indexable


const paramFlowMap: Indexable = {
    title: {
        selector: 'title',
        prop: 'innerText'
    },

    keywords: {
        selector: 'meta[name=keywords]',
        prop: 'content'
    },

    description: {
        selector: 'meta[name=description]',
        prop: 'content'
    }
}

function updateSEOParams(seoParams: SEOParams) {
    for (const param in seoParams) {
        const { selector, prop } = paramFlowMap[param]

        const seoElement = document.querySelector(selector)
        seoElement && (seoElement[prop] = seoParams[param])
    }
}


export default updateSEOParams
export type { SEOParams }