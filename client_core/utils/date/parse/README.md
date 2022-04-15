## Parse

Parse date into date parts

<br />

Receives **1** parameter
- **date** - **Date | Number | String**. Date to parse
- **zeroing** - **Boolean**. Wheher to prefix parsed numbers with **0** if parsed value is less then **10**

Returns an `Object` with parsed date. Object has the next fields:
- `year` - **Number**. Date year
- `month` - **Number**. Date month **index**
- `date` - **Number**. Date month day
- `day` - **Number**. Week day **index**
- `hours` - **Number**. Date hours
- `minutes` - **Number**. Date minutes
- `seconds` - **Number**. Date seconds
- `milliseconds` - **Number**. Date milliseconds

<br />

```js
import dateParse from 'siegel-utils/date/parse'

let {
    year, month, date, day, hours, minutes, seconds, milliseconds
} = dateParse(new Date())
```