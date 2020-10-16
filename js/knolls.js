var eventName = []
var eventStatus = []
var eventRoom = []

function getKnolls(data) { //Gets event info
    var defaultEventSummaries = [] //Just to see array in console
    for (i = 0; i < $(data).find(".event-summary").length; i++) { //Loops through events
        eventName.push($(data).find(".event-summary").eq(i).text()) //Adds events to array
        defaultEventSummaries.push($(data).find(".event-summary").eq(i).text()) //Adds events to array

        testVirtual(eventName[i], i) //Checks if virtual
        testCanceled(eventName[i], i) //Checks if canceled
        testRooms(eventName[i], i) //Looks for room numbers
    }
    console.log(defaultEventSummaries)
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
    else if(event.includes(" (Zoom)")) { //At end of event-summary //Took me a while to realize this doesn't have "virtual" in it!
        //console.log(eventNum)
        splitEvent = event.split(" (Zoom)")
        eventName[eventNum] = splitEvent[0]
    }
}

function testCanceled(event, eventNum) { //Sees if canceled
    if(event.toLowerCase().includes("canceled")) { //.includes is case sensitive for some reason
        if(event.includes("CANCELED -")) { //At beginning of event-summary
            splitEvent = event.split("CANCELED -")
            eventName[eventNum] = splitEvent[1]
            //console.log(eventName[eventNum])
        }
        eventStatus[eventNum] = "Canceled"
    }
}

function testRooms(event, eventNum) { //Checks event-summary for room numbers
    //console.log(eventNum)
    if(event.includes("- B")) { //If in a B wing room //Not sure why I have to use toLowerCase here. I'll figure it out later!
        for(a = 60; a > 0; a--) { //Future proofing even though there are only a few B rooms in the calendar list! //Using i really messed stuff up... //Backwards since doens't consider one digit rooms
            //console.log(eventNum + " " + a)
            if(event.includes("- B" + a)) { // Ex. "- B59" @ end of event-summary
                splitEvent = event.split("- B" + a)
                eventName[eventNum] = splitEvent[0]
                eventRoom[eventNum] = "B" + a //Sets room number
                a = 0 //Stops loop, can't place this above. Note: doesn't terminate what's below before the closing bracket of the if statement.
            }
        }
    //Two Rooms
    } else if(event.includes(", B")) { //Don't have to do toLowerCase here?...
        //Two rooms, i.g. "B55/B57"
        if(event.includes("/B")) { //Removed a bunch of unnecessary info
            eventRoom[eventNum] = event.substring(event.indexOf(", B") + 2, event.indexOf("/B")) + "," //Adds first room, second below. Wish I could make an array index its own array easily!
            eventRoom[eventNum] += event.substring(event.indexOf("/B") + 1, event.indexOf("/B") + 4) //Will have to test if the room after / is only one number
            splitEvent = event.split(", B")  //Removes the two rooms from the back
            eventName[eventNum] = splitEvent[0] //Sets new name
        } else { //Multiple many rooms- this SUCKS! //Actually it was a lot easier than I thought!
            var rooms
            if(event.includes("-B")) { //Just realized my first large loop with testRooms is so unnecessary!
                rooms = event.substring(event.indexOf(", B") + 2, event.lastIndexOf(", "))
                rooms = rooms.replace("-", ",")
            } if(event.includes("School Counseling Office")) { //Should I really do if statements like this? :thinking:
                rooms += ",School Counseling Office"
            }
            eventRoom[eventNum] = rooms
            splitEvent = event.split(", B")
            eventName[eventNum] = splitEvent[0] //Sets new name        }

    } else if(event.toLowerCase().includes(", c")) { //If in a C wing room
        for(a = 3; a > 0; a--) { //Trying all 3 C wing rooms (Are there more? Idk, the highest on the calendar so far was 3!)
            if(event.toLowerCase().includes(", c" + a)) { // Ex. "- B59" @ end of event-summary
                splitEvent = event.split(", C" + a)
                eventName[eventNum] = splitEvent[0]
                eventRoom[eventNum] = "C" + a //Sets room number
                a = 0 //Stops loop, can't place this above. Note: doesn't terminate what's below before the closing bracket of the if statement.
            }
        }
    } else if(event.toLowerCase().includes(", library classroom")) { //If in library (I think?)
        splitEvent = event.split(", Library Classroom") //At end of event-summary
        eventName[eventNum] = splitEvent[0]
        eventRoom[eventNum] = "Library" //Sets room number
    }
}

function tempSetLabels() { //Sets website labels with event info
    for(i = 1; i < 60; i++) {
        $("#event" + [i]).text("Name: " + eventName[i])
    }
}
