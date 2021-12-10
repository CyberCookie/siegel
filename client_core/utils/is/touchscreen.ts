/** Determine whether current device has a touch screen */
export default function() {
    try { document.createEvent('TouchEvent') }
    catch (e) { return false }

    return true
}