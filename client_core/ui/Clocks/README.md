# Clocks

Configurable clocks<br />
It returns string by default<br />

<br />

## Props:

- `initDate`
    - **Required**
    - **Date**
    - Time clocks start ticking from<br /><br />

- `zeroing`
    - Whether to prefix parsed date parts with zero if number is < 10
    - **Boolean**
    - Default is **true**<br /><br />

- `tickEveryMinute`
    - Perform tick every minute
    - **Boolean**
    - Default is **true**<br /><br />

- `speedCoef`
    - Change clock ticking speed
    - **Number**
    - Default is **1**<br /><br />

- `backward`
    - Tick backward
    - **Boolean**<br /><br />

- `builder`
    - Allows to build result string
    - **Function**
        - Has 1 argument:
            - **dateParsed** - result of [dateParse](https://github.com/CyberCookie/siegel/blob/master/client_core/utils/date/parse.ts) util function
        - Returns **React.ReactNode**