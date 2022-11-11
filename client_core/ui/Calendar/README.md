# Calendar

Flexible calendar to pick single or range of dates<br />

<br />

## Props:

- `rootTagAttributes`
    - **div** tag attributes<br /><br />

- `refApi`

- `className`

- `theme`
    - `root`
    - `_in_progress`
        - Applied to the root tag if range dates selection is in progress
    - `month_wrapper`
    - `month_title_wrapper`
    - `month_title`
    - `icon_month`
    - `icon_year`
    - `icon_prev`
    - `icon_next`
    - `month_days_wrapper`
    - `week`
    - `week_day`
    - `row`
    - `day`
    - `day_month_sibling`
    - `day__selected`
        - Applied to selected days
    - `day__first`
        - First day in selected month
    - `day__last`
        - Last day in selected month
    - `day__today`
    - `day__hidden`
        - Applied to current and next month's days if **hideSiblingMonthsDays** prop is **true**
    - `day__range_from`
        - First selected day
    - `day__range_to`
        - Last selected day<br /><br />

- `initDate`
    - **Required**
    - Represents **Calendar** date selection state<br />
        Field **rangeDateEnd** can be omited for single date selection mode
    - **Object** with the next fields:
        - `rangeDateStart` - **Required** **Number**. Selection start date timestamp
        - `rangeDateEnd` - **Number**. Selection end date timestamp<br /><br />

- `onChange`
    - **Function**. Has **3** arguments:
        - **range** - **initDate** like
        - **isFinished** - **Boolean**. Whether date selection is in progress or has just finished
        - **payload** - **props.payload**<br /><br />

- `rangePick`
    - Enables range pick mode
    - **Boolean**<br /><br />

- `triggerOnlyWhenFinished`
    - Triggers **props.onChange** only when date selection is finished<br /><br />

- `onMonthSwitch`
    - Triggers when current monts is changed 
    - **Function**. Has **3** arguments:
        - **date** - **Date**. First day of newly selected current month
        - **value** - **1 | -1**. Increment value
        - **event** - **React.MouseEvent<HTMLDivElement>**<br /><br />

- `onYearSwitch`
    - Triggers when current year is changed
    - Same signature as **React.MouseEvent<HTMLDivElement>**<br /><br />

- `postProcessCalendarDay`
    - Postprocesses calendar day element
    - **Function**
        - Has **1** **Object** argument with the next fields:
            - `className` - **String**. Class name applied to this day
            - `children` - **React.ReactNode**. Day element
        - Returns an **Object** with the same fields<br /><br />

- `constructCalendarTitle`
    - Allowing construction of calendar month title
        - **Function**
            - Has **1** **Object** argument with the next fields:
                - `prevMonthIcon` - **React.ReactNode**
                - `nextMonthIcon` - **React.ReactNode**
                - `prevYearIcon` - **React.ReactNode**
                - `nextYearIcon` - **React.ReactNode**
                - `year` - **Number**
                - `monhName` - **String**
            - Returns **React.ReactNode**<br /><br />

- `hideSiblingMonthsDays`
    - Whether to hide previous and next month days by side of current selected month
    - **Boolean**<br /><br />

- `fixedHeight`
    - Always fixed number of day rows in calendar month
    - **Boolean**
    - Default is **true**<br /><br />

- `noControls`
    - Hide month and year switch control icons
    - **Boolean**<br /><br />

- `prevMonthIcon`
    - Icon for previous month selection
    - **React.ReactNode**
    - Default is **'<'**<br /><br />

- `nextMonthIcon`
    - Icon for next month selection
    - **React.ReactNode**
    - Default is **'>'**<br /><br />

- `prevYearIcon`
    - Icon for previous year selection
    - **React.ReactNode**
    - Default is **'<<'**<br /><br />

- `nextYearIcon`
    - Icon for next year selection
    - **React.ReactNode**
    - Default is **'>>'**<br /><br />

- `monthsBefore`
    - Count of months showing before current month
    - **Number**
    - Default is **0**<br /><br />

- `monthsAfter`
    - Count of months showing after current month
    - **Number**
    - Default is **0**<br /><br />

- `weekStartsFrom`
    - Select week start day
    - **Number**<br /><br />

- `payload`
    - Data to be passed to **props.onChange** handler
    - **Any**<br /><br />

- `strings`
    - Month and week day names
    - **Function** that returns **Object** or **Object** itself with the next fields:
        - `months` - **String[]**
        - `weekDays` - **String[]**
    - Default **Object** is:
        - `months` - **[ 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december' ]**
        - `weekDays` - **[ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ]**