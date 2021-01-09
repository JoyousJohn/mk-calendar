var eventStatus = [] //Possible: null, Virtual, Canceled
var eventRoom = []
var eventStart = []
var eventDate = []

var eventName = [] //The cleaned up event name
var startDate = [] //Integer date of start time

var isVirtual = [] //Only true if zoom or virtual found in summary
var isZoom = [] //Only true if zoom found in summary

function load() { //Might probably need to use for something later...
    //$(".pEventVirtual").hide()
}

function appendKnolls(data, currentMonthInt) {
    //console.log(currentMonthInt)
    var tempDate = new Date(2020, currentMonthInt - 1)
    const month = tempDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    $(".eventTemplate:not(:first)").remove(); //Clear previous events from DOM, if there are any
    $(".eventTemplate").eq(0).hide() //Hide the first one
    for(var i = 0; i < data.length; i++) {
        var d
        if (data[i].start.date != undefined) {
            d = new Date(data[i].start.date)
        } else {
            d = new Date(data[i].start.dateTime)
        }
        startDate[i] = d.getDate()
        if (d.getMonth() != currentMonthInt - 1) { //Or add one to the former
            d.setDate(1)
        }
        analyzeSummary(data[i].summary, i) //Dissects name
        var newElement = $(".eventTemplate").eq(0).clone().show().insertAfter(".eventTemplate:last"); //Can also shoiw after line 15
        $(".pEventName").eq(i + 1).text(eventName[i])
        $(".pEventDate").eq(i + 1).text(month + " " + d.getDate())
        if (isVirtual[i] == true) {
            $(".pEventStatus").eq(i + 1).css("visibility", "visible")
            $(".pEventStatus").eq(i + 1).text("VIRTUAL")
            if (isZoom[i] == true) {
                $(".pEventStatus").eq(i + 1).text("ZOOM")
            }
        }
    }
}

function analyzeSummary(summary, e) {
    summary = checkIfVirtual(summary, e)
    eventName[e] = summary
}

function checkIfVirtual(summary, e) { //Sees if event is virtual and returns name after cut
    var isVirtualFront = ["VIRTUAL - ", "Virtual "]
    var isVirtualBack = [" (Zoom)"]
    for (v in isVirtualFront) {
        if(summary.includes(isVirtualFront[v])) {
            //console.log(isVirtualFront[v])
            splitName = summary.split(isVirtualFront[v])
            summary = splitName[1]
            isVirtual[e] = true
        }
        if(summary.includes(isVirtualBack[v])) {
            splitName = summary.split(isVirtualBack[v])
            summary = splitName[0]
            isVirtual[e] = true
            isZoom[e] = true
        }
    }
    return summary
}

//Left and right arrow keys to change months
document.onkeydown = checkKey
function checkKey(e) {
    if (e.keyCode == '37') {
       setDates(-1)
    }
    else if (e.keyCode == '39') {
       setDates(1)
    }
}
