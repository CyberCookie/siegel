/**
 * Determine whether current device has a touch screen
 * @return {boolean}
 */
function isTouchScreen(): boolean {
    try { document.createEvent("TouchEvent") } 
    catch (e) { return false }

    return true
}


export default isTouchScreen