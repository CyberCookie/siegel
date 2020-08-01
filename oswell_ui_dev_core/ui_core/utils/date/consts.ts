const msIn = {
    day: 86400000,
    hour: 3600000,
    minute: 60000,
    second: 1000
} as const

const calendarNames = {
    months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    monthsShort: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    daysShort: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
} as const



export { msIn, calendarNames }