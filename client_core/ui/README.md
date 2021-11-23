<h1>UI</h1>


Siegel provides a big set of widely used components that can be easily themed.<br /><br />

Any component can receive `className` prop. Those one that consists of more than one DOM element receives `theme` property.<br />
`theme` is a map where key is tied to component DOM element and value is a className.<br /><br />

Every component receives `attributes` prop which is a valid set of attributes for a component's root DOM element.<br /><br />

Siegel provides a `withDefaults` HOC to theme components and set default props:

```jsx
import Button from 'siegel-ui/Button'
import withDefaults from 'siegel-ui/with_defaults'

const ThemedButton = withDefaults(Button, {
    className: 'some-class',
    value: 42
})

<ThemedButton />

//the same as:
<Button className='some-class' value={42} />
```

Examples of component theming and usage you may find in demo project:<br />
[How to theme](https://github.com/CyberCookie/siegel/tree/demo_app/main/components/theme)<br/>
[How to use](https://github.com/CyberCookie/siegel/tree/demo_app/main/pages/DemoComponents/components)<br />



<h3>Ref api</h3>
Each component receives optional ref params to provide better controll over component during the renders

<ul>
    Props.refApi is an object with the next properties:
    <li>
        getRef: (ref) => void - callback that triggers after each render<br />
        with component's ref as a first argument and component props as a second
    </li>
    <li>
        getOnPropsUpdate: (props) => [ Array of props to track ] - optional callback with component props as a first argument<br />
        that returns an array of props to track for updates.<br />
        If there were no updates among trackable props - `getRef` callback won't be fired
    </li>
</ul>


```js
import Button, { Props: ButtonProps } from 'siegel-ui/Button'

<Button value={42} disabled={false}
    refApi={{
        getRef(ref: HTMLButtonElement, props: ButtonProps) {
            if (props.disabled) {
                ref.style.setProperty('--color', 'grey')
            }
        },
        getOnPropsUpdate: (props: ButtonProps) => [ props.disabled ]
    }}
/>
```