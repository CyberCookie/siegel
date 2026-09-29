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
 * @param seoParams - SEO params
 */
function updateSEOParams(seoParams: SEOParams) {
    for (let i = 0, keys = Object.keys(seoParams), l = keys.length; i < l; i++) {
        const seoParamKey = keys[i] as keyof SEOParams

        const { selector, prop } = paramFlowMap[seoParamKey as SEOParamKeys]

        const seoElement: UnionToIntersection<SEOHeadHTMLTags> | null = document.querySelector(selector)
        if (seoElement) {
            seoElement[prop] = seoParams[seoParamKey]!
        }
    }
}


export default updateSEOParams
export type { SEOParams }