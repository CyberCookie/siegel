## Populate URL params

Replaces URL params with actual param values<br />

Receives **2** parameters
    - **String**. URL to populate
    - **Object** that represents params values where key is URL param key and value is param value

<br />

```ts
import populateURLParams from 'siegel/lib/common/populate_url_params'

populateURLParams('/api/:id/foo/:bar', {
    id: 'some_value',
    bar: 'another_value'
})

// ==>> '/api/some_value/foo/another_value'

```