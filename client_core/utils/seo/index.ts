type SEOParams = {
    /** New title tag value */
    title?: string

    /** New meta description tag content */
    description?: string

    /** New meta keywords tag content */
    keywords?: string
}

type SEOParamKeys = keyof SEOParams

type SEOHeadHTMLTags = HTMLMetaElement | HTMLTitleElement


const paramFlowMap = {
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
} as const

/**
 * Updates HTML SEO tags
 *
 * @param seoParams seo params
 */
function updateSEOParams(seoParams: SEOParams) {
    for (const param in seoParams) {
        const { selector, prop } = paramFlowMap[param as SEOParamKeys]

        const seoElement: SEOHeadHTMLTags | null = document.querySelector(selector)
        if (seoElement) {
            (seoElement as UnionToIntersection<SEOHeadHTMLTags>)[prop] = seoParams[param as SEOParamKeys]!
        }
    }
}


export default updateSEOParams
export type { SEOParams }