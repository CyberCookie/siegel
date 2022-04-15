# ErrorBoundary

Wrapps your component to handle unexpected errors<br />
In development mode, you should first close webpack overlay message to see the result


<br />

## Props:

- `children`
    - **Required**
    - Component to wrap<br /><br />

- `onError`
    - **Function**. Triggers when error occurs. Has **1** argument:
        - **error** - **Error**. error message<br /><br />

- `getUIErrorText`
    - **Function**. Constructs UI error message out of occurred one
        - Has **1** argument:
            - **error** - **Error**. error message
        - Returns `React.ReactNode`