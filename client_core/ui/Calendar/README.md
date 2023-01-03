# Calendar

Flexible calendar to pick single or range of dates<br />

<br />

## Props:

- `refApi`
    - Component root reference params<br /><br />

- `className`
    - Root element class name
    - **String**<br /><br />

- `theme`
    - `root`
        - Root tag
    - `_in_progress`
        - Root tag state during a range dates selection
    - `month_wrapper`
        - Calendar month wrapper
    - `month_title_wrapper`
        - Calendar month title wrapper
    - `month_title`
        - Month title
    - `icon_month`
        - Month switch icons
    - `icon_year`
        - Year switch icons
    - `icon_prev`
        - Previous month/year icons
    - `icon_next`
        - next month/year icons
    - `month_days_wrapper`
        - Calendar month days wrapper
    - `week`
        - Week days names row
    - `week_day`
        - Week day name
    - `row`
        - Month week days row
    - `day`
        - Month day
    - `day_month_sibling`
        - Side months days of a currently selected month
    - `day__selected`
        - Selected day state
    - `day__first`
        - First day of a currently selected month if `props.hideSiblingMonthsDays` is **true**
    - `day__last`
        - Last day of a currently selected month if `props.hideSiblingMonthsDays` is **true**
    - `day__today`
        - Today day
    - `day__hidden`
        - Applied to a side months days of a currently selected month, if `props.hideSiblingMonthsDays` is **true**
    - `day__range_from`
        - First day of a range dates selection
    - `day__range_to`
        - Last day of a range dates selection<br /><br />

- `initDate`
    - **Required**
    - **Calendar** initial date<br />
    - **Object** with the next fields:
        - `rangeDateStart` - **Required** **Number**. Selected date timestamp or range dates selection start
        - `rangeDateEnd` - **Number**. Range dates selection finish<br /><br />

- `onChange`
    - Triggered on date selection
    - **Function**. Has **3** arguments:
        - **range** - Same object as `props.initDate`
        - **isFinished** - **Boolean**. Whether range dates selection is in progress or has already ended
        - **payload** - `props.payload`<br /><br />

- `onMonthSwitch`
    - Triggered on month switch
    - **Function**. Has **3** arguments:
        - **date** - **Date**. New current month first day timestamp
        - **value** - **1 | -1**. Increment value
        - **event** - **React.MouseEvent<HTMLDivElement>**<br /><br />

- `onYearSwitch`
    - Triggers when current year is changed
    - **Function**. Has **3** arguments:
        - **date** - **Date**. New current year first day timestamp
        - **value** - **1 | -1**. Increment value
        - **event** - **React.MouseEvent<HTMLDivElement>**<br /><br />

- `postProcessCalendarDay`
    - Allows you to return a custom date element and className to be applied to its wrapper
    - **Function**
        - Has **1** **Object** argument with the next fields:
            - `className` - **String**. Date element wrapper className
            - `children` - **React.ReactNode**. Date element
        - Returns an **Object** with the same fields<br /><br />

- `constructCalendarTitle`
    - Allows you to customize default month title markdown
        - **Function**
            - Has **1** **Object** argument with the next fields:
                - `prevMonthIcon` - **React.ReactNode**. Go to previous month icon
                - `nextMonthIcon` - **React.ReactNode**. Go to next month icon
                - `prevYearIcon` - **React.ReactNode**. Go to previous year icon
                - `nextYearIcon` - **React.ReactNode**. Go to next year icon
                - `year` - **Number**. Title year
                - `monhName` - **String**. Title month name
            - Returns **React.ReactNode**<br /><br />

- `hideSiblingMonthsDays`
    - Hides side months days
    - **Boolean**<br /><br />

- `fixedHeight`
    - Always renders fixed number of month days rows
    - **Boolean**
    - Default is **true**<br /><br />

- `noControls`
    - Doesn't place month / year switch controls
    - **Boolean**<br /><br />

- `prevMonthIcon`
    - Go to previous month icon
    - **React.ReactNode**
    - Default is **'<'**<br /><br />

- `nextMonthIcon`
    - Go to next month icon
    - **React.ReactNode**
    - Default is **'>'**<br /><br />

- `prevYearIcon`
    - Go to previous year icon
    - **React.ReactNode**
    - Default is **'<<'**<br /><br />

- `nextYearIcon`
    - Go to next year icon
    - **React.ReactNode**
    - Default is **'>>'**<br /><br />

- `monthsBefore`
    - Number of months to render before active month
    - **Number**
    - Default is **0**<br /><br />

- `monthsAfter`
    - Number of months to render after active month
    - **Number**
    - Default is **0**<br /><br />

- `weekStartsFrom`
    - Week day index to start a week from
    - **Number**<br /><br />

- `triggerOnlyWhenFinished`
    - During range date selection, triggers `props.onChange` only when selection has finished<br /><br />

- `payload`
    - Any data to be retrieven when `props.onChange` is triggered
    - **Any**<br /><br />

- `rangePick`
    - Enabled range date selection
    - **Boolean**<br /><br />

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `strings`
    - Names to be used for months and week days names
    - **Function** that returns **Object** or **Object** itself with the next fields:
        - `months` - **String[]**
        - `weekDays` - **String[]**
    - Default **Object** is:
        - `months` - **[ 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december' ]**
        - `weekDays` - **[ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ]**