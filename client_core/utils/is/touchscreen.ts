/** Determine whether current device has a touch screen */
export default () => {
    try { document.createEvent('TouchEvent') }
    catch (e) { return false }

    return true
}