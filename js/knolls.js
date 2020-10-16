var eventName = []
var eventWhere = [] //Might use eventVirtual or isVirtual
var eventStatus = [] //Might use eventCancelled boolean instead //Status could contradict with canceled/virtual?

function getKnolls(data) { //Gets event info

    var tempEvents = [] //Holds event names
    for (i = 0; i < $(data).find(".event-summary").length; i++) { //Loops through events
        tempEvents.push($(data).find(".event-summary").eq(i).text()) //Adds events to array

        testVirtual(tempEvents[i], i) //Checks if virtual
        testCanceled(tempEvents[i], i) //Checks if canceled

        if(eventName[i] == null) { //If none of conditions were met and the event-summary is the event name
            eventName[i] = tempEvents[i] //Sets the event name to the event-summary
        }
    }
    //console.log(tempEvents)
    tempSetLabels()
}

function testVirtual(event, eventNum) {
    if(event.toLowerCase().includes("virtual")) { //.includes is case sensitive for some reason

        if(event.includes("VIRTUAL - ")) { //At end of event-summary
            splitEvent = event.split("VIRTUAL - ")
            eventName[eventNum] = splitEvent[1]

        } else if(event.includes(", (Virtual)")) { //At beginning of event-summary //Unique for "NHS Meeting,"
            splitEvent = event.split(", (Virtual)")
            eventName[eventNum] = splitEvent[0]

        } else if(event.includes(" (Virtual)")) { //At beginning of event-summary
            splitEvent = event.split(" (Virtual)")
            eventName[eventNum] = splitEvent[0]
        }
        eventWhere[eventNum] = "Virtual"
    }
}

function testCanceled(event, eventNum) {
    if(event.toLowerCase().includes("canceled")) { //.includes is case sensitive for some reason

        if(event.includes("CANCELED -")) { //At beginning of event-summary
            splitEvent = event.split("CANCELED -")
            eventName[eventNum] = splitEvent[1]
        }
        eventStatus[eventNum] = "Canceled"
    }
}

function tempSetLabels() { //Sets website labels with event info
    for(i = 0; i < 20; i++) {
        $("#event" + [i]).text("Name: " + eventName[i])
    }
}
