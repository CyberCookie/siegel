/** Determine whether current device has a touch screen */
function isTouchScreen() {
    try { document.createEvent('TouchEvent') }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    catch (e) { return false } //eslint-ignoreline

    return true
}


export default isTouchScreen