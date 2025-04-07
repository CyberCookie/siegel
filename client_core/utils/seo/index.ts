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
    Object.entries(seoParams)
        .forEach(([ seoParamKey, seoParamValue ]) => {
            const { selector, prop } = paramFlowMap[seoParamKey as SEOParamKeys]

            const seoElement: SEOHeadHTMLTags | null = document.querySelector(selector)
            if (seoElement) {
                (seoElement as UnionToIntersection<SEOHeadHTMLTags>)[prop] = seoParamValue
            }
        })
}


export default updateSEOParams
export type { SEOParams }