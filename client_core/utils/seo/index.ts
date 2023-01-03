type SEOParams = {
    /** New title tag value */
    title?: string

    /** New meta description tag content */
    description?: string

    /** New meta keywords tag content */
    keywords?: string
} & Obj


const paramFlowMap: Obj = {
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

/**
 * Updates HTML SEO tags
 *
 * @param seoParams seo params
 */
function updateSEOParams(seoParams: SEOParams) {
    for (const param in seoParams) {
        const { selector, prop } = paramFlowMap[param]

        const seoElement = document.querySelector(selector)
        seoElement && (seoElement[prop] = seoParams[param])
    }
}


export default updateSEOParams
export type { SEOParams }