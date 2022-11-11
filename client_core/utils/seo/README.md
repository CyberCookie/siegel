## SEO

Some crawlers may execute your client side JS code<br />
Using this SEO function it is easy to update SEO tags providing valuable SEO information to a crawler<br />

Receives **1** parameter: **Objec** with the next fields:
- `title` - **String**. Site tab title
- `keywords` - **String**. Site meta keywords
- `description` - **String**. Site meta description

<br />

```js
import seo from 'siegel/lib/client_core/ui/utils/seo'

seo({
    title: 'new title',
    keywords: 'some, new, keywords',
    description: 'updated description'
})
```