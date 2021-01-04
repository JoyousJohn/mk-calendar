var eventName = []
var eventStatus = [] //Possible: null, Virtual, Canceled
var eventRoom = []
var eventStart = []
var eventDate = []

let month
let year

function appendKnolls(data) {
    console.log(data.length)
    console.log(data)

    for(i = 1; i < data.length; i++) {
        var eventDiv = document.createElement("div");
        eventDiv.setAttribute("class", "eventTemplate");
        eventDiv.appendChild(document.createTextNode(i + ": " + data[i].summary + " " + JSON.stringify(data[i].start)));
        var element = document.getElementById("eventList");
        element.appendChild(eventDiv);
    }
}
