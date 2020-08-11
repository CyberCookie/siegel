/** Determine whether current device has a touch screen */
function isTouchScreen(): boolean {
    try { document.createEvent("TouchEvent") } 
    catch (e) { return false }

    return true
}


export default isTouchScreen