## To UTC date

Adjust hours in date object to match UTC date

<br />

Receives **1** parameter:
- **date** - **Date**. Date to adjust

<br />

```js
import toUTCDate from 'siegel/lib/common/date/toUTCDate'

const date = new Date() // Fri Jan 01 2020 04:00:00 GMT+0300 (Eastern European Summer Time)

toUTCDate(date)

console.log(date)
// Fri Jan 01 2020 01:00:00 GMT+0300 (Eastern European Summer Time)
```