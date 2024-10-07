## Parse jwt

Parses tocken string and extract a data from it<br />

Receives **1** parameter: **String**. JSON web token string

<br />

```ts
import parseJWT from 'siegel/lib/common/parse_jwt'

parseJWT(someString)
/*
    {
        ...parsed data
    }
*/

```