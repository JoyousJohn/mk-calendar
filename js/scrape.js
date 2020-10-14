function knollsSelected() {
    $(".schoolOptions").fadeOut()
    document.getElementById("knollsCalendar").style.visibility = "visible" //Hides MK/MH buttons
    scrapeKnolls()
}

async function scrapeKnolls() {
    try {
        response = await axios.get("https://cors-anywhere.herokuapp.com/calendar.google.com/calendar/u/0/htmlembed?src=mhrd.org_ccteiaobdj0su75og9mc2u6h4g@group.calendar.google.com")
    } catch (err) { console.log(err)
    }
    //console.log(response.data)
    var eventName = []
    var eventWhere = []
    var eventStatus = [] //Might use eventCancelled boolean instead

    var tempEvents = []
    for (i = 0; i < $(response.data).find(".event-summary").length; i++) { //Loops through events
        tempEvents.push($(response.data).find(".event-summary").eq(i).text()) //Adds events to array

        var event = tempEvents[i] //Simplicity Note: can't use toLowerCase here. Must repeat in if statements. :(
        //If virtual
        if(event.toLowerCase().includes("virtual")) { //.includes is case sensitive for some reason
            //console.log("true") //Checking to see if retrieved correctly
            if(event.includes("VIRTUAL - ")) {
                splitEvent = event.split("VIRTUAL - ")
                eventName[i] = splitEvent[1]
            } else if(event.includes(", (Virtual)")) { //Unique for "NHS Meeting,"
                splitEvent = event.split(", (Virtual)")
                eventName[i] = splitEvent[0]
            } else if(event.includes(" (Virtual)")) {
                splitEvent = event.split(" (Virtual)")
                eventName[i] = splitEvent[0]
            }
            eventWhere[i] = "Virtual"
        }

        //If cancelled
        if(event.toLowerCase().includes("canceled")) {
            if(event.includes("CANCELED -")) {
                splitEvent = event.split("CANCELED -")
                eventName[i] = splitEvent[1]
            }
            eventStatus[i] = "Canceled"
        }

        //Else name is entire event
        if(eventName[i] == null) { //If name wasn't altered with set name to event-summary
            eventName[i] = event
        }
    }
    //console.log(tempEvents); //Logging
    for(i = 0; i < 15; i++) { //Looping labels/events
        var extraInfo = ""
        if(eventStatus[i] != null) { //Is cancelled
            extraInfo = " Status: Canceled"
        } else if(eventWhere[i] == "Virtual") { //Is virtual
            extraInfo = extraInfo + " Status: Virtual"
        }
        $("#event" + [i]).text("Name: " + eventName[i] + "      " + extraInfo);
    }
}
