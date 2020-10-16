var eventName = []
var eventStatus = []
var eventRoom = []

function getKnolls(data) { //Gets event info
    for (i = 0; i < $(data).find(".event-summary").length; i++) { //Loops through events
        eventName.push($(data).find(".event-summary").eq(i).text()) //Adds events to array

        testVirtual(eventName[i], i) //Checks if virtual
        testCanceled(eventName[i], i) //Checks if canceled
        testRooms(eventName[i], i) //Looks for room numbers
    }
    console.log(eventName)
    $("#eventQuantity").text(eventName.length + " events found:") //Displays events found (temp)
    tempSetLabels() //Sets (temp) labels to event info
}

function testVirtual(event, eventNum) { //Sees if virtual
    if(event.toLowerCase().includes("virtual")) { //.includes is case sensitive for some reason
        if(event.includes("VIRTUAL - ")) { //At beginning of event-summary
            splitEvent = event.split("VIRTUAL - ")
            eventName[eventNum] = splitEvent[1]

        } else if(event.includes(", (Virtual)")) { //At end of event-summary //Unique for "NHS Meeting,"
            splitEvent = event.split(", (Virtual)")
            eventName[eventNum] = splitEvent[0]

        } else if(event.includes(" (Virtual)")) { //At end of event-summary
            splitEvent = event.split(" (Virtual)")
            eventName[eventNum] = splitEvent[0]
        } else if(event.includes("VIRTUAL (Zoom) - ")) { //At beginning of event-summary
            splitEvent = event.split("VIRTUAL (Zoom) - ")
            eventName[eventNum] = splitEvent[1]
        }
        eventStatus[eventNum] = "Virtual"
    }
}

function testCanceled(event, eventNum) { //Sees if canceled
    if(event.toLowerCase().includes("canceled")) { //.includes is case sensitive for some reason
        if(event.includes("CANCELED -")) { //At beginning of event-summary
            splitEvent = event.split("CANCELED -")
            eventName[eventNum] = splitEvent[1]
            console.log(eventName[eventNum])
        }
        eventStatus[eventNum] = "Canceled"
    }
}

function testRooms(event, eventNum) { //Checks event-summary for room numbers
    //console.log(eventNum)
    if(event.toLowerCase().includes("- b")) { //If in a B wing room //Not sure why I have to use toLowerCase here. I'll figure it out later!
        for(a = 60; a > 0; a--) { //Future proofing even though there are only a few B rooms in the calendar list! //Using i really messed stuff up... //Backwards since doens't consider one digit rooms
            //console.log(eventNum + " " + a)
            if(event.toLowerCase().includes("- b" + a)) { // Ex. "- B59" @ end of event-summary
                splitEvent = event.split("- B" + a)
                eventName[eventNum] = splitEvent[0]
                eventRoom[eventNum] = "B" + a //Sets room number
                a = 0 //Stops loop, can't place this above. Note: doesn't terminate what's below before the closing bracket of the if statement.
            }
        }
    } else if(event.toLowerCase().includes(", c")) { //If in a C wing room
        for(a = 3; a > 0; a--) { //Trying all 3 C wing rooms (Are there more? Idk, the highest on the calendar so far was 3!)
            if(event.toLowerCase().includes(", c" + a)) { // Ex. "- B59" @ end of event-summary
                splitEvent = event.split(", C" + a)
                eventName[eventNum] = splitEvent[0]
                eventRoom[eventNum] = "C" + a //Sets room number
                a = 0 //Stops loop, can't place this above. Note: doesn't terminate what's below before the closing bracket of the if statement.
            }
        }
    }
}

function tempSetLabels() { //Sets website labels with event info
    for(i = 1; i < 26; i++) {
        $("#event" + [i]).text("Name: " + eventName[i])
    }
}
