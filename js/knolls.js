var eventName = []
var eventStatus = [] //Possible: null, Virtual, Canceled
var eventRoom = []
var eventStart = []
var eventDate = []

let month
let year

function appendKnolls(data, currentMonthInt) {
    console.log(currentMonthInt)
    var tempDate = new Date(2020, currentMonthInt - 1)
    const month = tempDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    //$(".eventTemplate").remove(); //Clear previous events, if there are any
    for(var i = 0; i < data.length; i++) {
        var d
        if (data[i].start.date != undefined) {
            d = new Date(data[i].start.date)
        } else {
            d = new Date(data[i].start.dateTime)
        }
        console.log(d.getMonth() + " hi there")
        if (d.getMonth() != currentMonthInt - 1) { //Or add one to the former
            d.setDate(1)
        }
        $(".eventTemplate").eq(0).clone().insertAfter(".eventTemplate:last");
        $(".pEventName").eq(i + 1).text(data[i].summary)
        $(".pEventDate").eq(i + 1).text(month + " " + d.getDate())

        /*console.log(i)
        var eventDiv = document.createElement("div");
        eventDiv.setAttribute("class", "eventTemplate");
        eventDiv.appendChild(document.createTextNode(i + ": " + data[i].summary + " " + JSON.stringify(data[i].start))); //Temporary obviously
        var element = document.getElementById("eventList");
        element.appendChild(eventDiv);*/
    }
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
