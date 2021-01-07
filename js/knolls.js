var eventStatus = [] //Possible: null, Virtual, Canceled
var eventRoom = []
var eventStart = []
var eventDate = []

var eventName = [] //The cleaned up event name
var startDate = [] //Integer date of start time

var isVirtual = [] //Only true if zoom or virtual found in summary
var isZoom = [] //Only true if zoom found in summary

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
        var newElement = $(".eventTemplate").eq(0).clone().show().insertAfter(".eventTemplate:last"); //Can also shoiw after line 15
        $(".pEventName").eq(i + 1).text(getName(data[i].summary))
        $(".pEventDate").eq(i + 1).text(month + " " + d.getDate())

        /*console.log(i)
        var eventDiv = document.createElement("div");
        eventDiv.setAttribute("class", "eventTemplate");
        eventDiv.appendChild(document.createTextNode(i + ": " + data[i].summary + " " + JSON.stringify(data[i].start))); //Temporary obviously
        var element = document.getElementById("eventList");
        element.appendChild(eventDiv);*/
    }
    //$(".eventTemplate").eq(0).remove();
    //$(".eventTemplate").show();
}

function getName(summary) {
    summary = checkIfVirtual(summary)
    return summary
}

function checkIfVirtual(summary) { //Sees if event is virtual and returns name after cut
    var isVirtualFront = ["VIRTUAL - "]
    var isVirtualBack = [" (Zoom)"]
    for (v in isVirtualFront) {
        if(summary.includes(isVirtualFront[v])) {
            //console.log(isVirtualFront[v])
            splitName = summary.split(isVirtualFront[v])
            summary = splitName[1]
            isVirtual[v] = true
            break
        }
        if(summary.includes(isVirtualBack[v])) {
            splitName = summary.split(isVirtualBack[v])
            //summary = splitName[0]
            isVirtual[v] = true
            isZoom[v] = true
            break
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
