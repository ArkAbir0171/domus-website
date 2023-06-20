function getBangladeshTime()
{
    let currentTime = new Date().getTime();
    let offsetSixHours = 0;
    let bangladeshTime = currentTime + offsetSixHours;
    return bangladeshTime;
}
function getTimeDateString(millis)
{
    return new Date(millis).toLocaleTimeString() + " - " + new Date(millis).toLocaleDateString();
}
export {getBangladeshTime, getTimeDateString}