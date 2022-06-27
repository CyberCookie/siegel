/** Determine whether current device has a touch screen */
function isTouchScreen() {
    try { document.createEvent('TouchEvent') }
    catch (e) { return false }

    return true
}


export default isTouchScreen