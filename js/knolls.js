var eventName = []
var eventStatus = [] //Possible: null, Virtual, Canceled
var eventRoom = []
var eventStart = []
var eventDate = []

let month
let year

function getKnolls(data) { //Gets event info
    var defaultEventSummaries = [] //Just to see array in console
    for (i = 0; i < $(data).find(".item-content event-singleday, .event-summary").length; i++) { //Loops through events
        eventName.push($(data).find(".event-summary").eq(i).text()) //Adds events to array
        defaultEventSummaries.push($(data).find(".event-summary").eq(i).text()) //Adds events to array

        //console.log(eventName[i])
        testVirtual(eventName[i], i) //Checks if virtual
        testCanceled(eventName[i], i) //Checks if canceled
        testRooms(eventName[i], i) //Looks for room numbers
        removeAcronyms(eventName[i], i) //Replaces acronyms like "mtg" with "meeting"
    }
    console.log(defaultEventSummaries)
    $("#eventQuantity").text(eventName.length + " events found:") //Displays events found (temp)
    tempSetLabels() //Sets (temp) labels to event info

    //console.log(data);
    var periodRange = $(data).filter('.period-range').text().split(" ") //Spent an hour trying to figure this out: https://stackoverflow.com/questions/400197/extracting-ajax-return-data-in-jquery
    month = periodRange[0]
    year = periodRange[1]
    $("#calendarTime").text(month + " " + year)

    for (i = 0; i < $(data).find(".event-time").length; i++) { //Loops through events
        eventStart.push($(data).find(".event-time").eq(i).text()) //Adds event start time to array
    }
    console.log(eventStart)
    //console.log(periodRange)
}

function testVirtual(event, eventNum) { //Checks if virtual
    var virtualMessagesFront = ["VIRTUAL (Zoom) - ", "VIRTUAL - "]
    var virtualMessagesEnd = [" (Zoom)", ", (Virtual)", " (Virtual)"]
    if(event.toLowerCase().includes("virtual")||event.toLowerCase().includes("zoom")) { //Ugh I had the or statement in the wrong place for like 20 minutes!
        //console.log(eventNum);
        eventStatus[eventNum] = "Virtual"
        var skip
        for(var i = 0; i < virtualMessagesFront.length; i++) {
            if(event.includes(virtualMessagesFront[i])) { //If the event-summary includes a virtual/zoon keyword in front
                splitEvent = event.split(virtualMessagesFront[i])
                eventName[eventNum] = splitEvent[1]
                skip = true //Skips attempting checking other keywords at end (below)
                break
            }
        }
        if(skip != true) { //If not told to skip
            for(var i = 0; i < virtualMessagesEnd.length; i++) { //Loops each keyword
                if(event.includes(virtualMessagesEnd[i])) { //If the event-summary includes a virtual/zoon keyword at end
                    splitEvent = event.split(virtualMessagesEnd[i])
                    eventName[eventNum] = splitEvent[0]
                    break
                }
            }
        }
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
    if(event.includes("- B")) { //If in a B wing room //I was using sooo many loops here originally, ouch!
        eventRoom[eventNum] = event.substring(event.indexOf("- B") + 2, event.indexOf("- B") + 5) //Sets room number
        splitEvent = event.split("- B")
        eventName[eventNum] = splitEvent[0]
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
                //rooms = rooms.replace("-", ",") What was I thinking? I can't do this!
            } if(event.includes("School Counseling Office")) { //Should I really do if statements like this? :thinking:
                rooms += ",School Counseling Office"
            }
            eventRoom[eventNum] = rooms
            splitEvent = event.split(", B")
            eventName[eventNum] = splitEvent[0] //Sets new name
        }
    //C wing
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
    } else if(event.includes(", Aud")) { //If in library (I think?)
        splitEvent = event.split(", Aud") //At end of event-summary
        eventName[eventNum] = splitEvent[0]
        eventRoom[eventNum] = "Auditorium" //Sets room number
    } else if(event.includes(", Dance Studio")) { //If in library (I think?)
        splitEvent = event.split(", Dance Studio") //At end of event-summary
        eventName[eventNum] = splitEvent[0]
        eventRoom[eventNum] = "Dance Studio" //Sets room number
    }
}

function removeAcronyms (event, eventNum) {
    eventName[eventNum] = event.replace("Mtg", "Meeting")
}

function tempSetLabels() { //Sets website labels with event info
    for(i = 0; i < 61; i++) {
        var extra = ""
        if(eventStatus[i] != null) {
            extra = " - Status: " + eventStatus[i]
        } if(eventRoom[i] != null) {
            extra += " - Room(s): " + eventRoom[i]
        }
        $("#event" + [i + 1]).text("Name: " + eventName[i] + " " + extra)
    }
}
