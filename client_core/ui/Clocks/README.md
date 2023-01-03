# Clocks

Configurable clocks<br />
It returns string by default<br />

<br />

## Props:

- `initDate`
    - Clocks initial value<br /><br />
    - **Date**

- `zeroing`
    - Makes builder's parsed date values prefixed with zero
    - **Boolean**
    - Default is **true**<br /><br />

- `tickEveryMinute`
    - Recalculates clocks value every clock minute
    - **Boolean**
    - Default is **true**<br /><br />

- `speedCoef`
    - Changed clock ticking speed. Default is 1
    - **Number**
    - Default is **1**<br /><br />

- `backward`
    - Whether to tick backward
    - **Boolean**<br /><br />

- `builder`
    - Callback to construct clocks display value
    - **Function**
        - Has **1** argument:
            - **dateParsed** - result of [dateParse](https://github.com/CyberCookie/siegel/blob/master/client_core/utils/date/parse.ts) util function
        - Returns **React.ReactNode**