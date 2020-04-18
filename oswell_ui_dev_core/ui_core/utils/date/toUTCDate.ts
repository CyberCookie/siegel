import { msIn } from './date_const'


function toUTCDate(date: Date) {
  const timestamp = date.getTime()
  const GMTOffset = date.getTimezoneOffset() * msIn.minute;

  return new Date(timestamp + GMTOffset)
}


export default toUTCDate