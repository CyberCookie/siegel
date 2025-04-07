# ErrorBoundary

Wraps your component to handle unexpected errors<br />
In development mode, you should first close webpack overlay message to see the result


<br />

## Props:

- `children`
    - **Required**
    - Component to wrap<br /><br />

- `onError`
    - Triggered when error occurs
    - **Function**. Has **1** argument:
        - **error** - **Error**. error message<br /><br />

- `getUIErrorText`
    - Constructs UI error message out of occurred one
    - **Function**
        - Has **1** argument:
            - **error** - **Error**. error message
        - Returns `React.ReactNode`