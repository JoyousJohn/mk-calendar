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

    var tempEvents = []
    for (i = 0; i < $(response.data).find(".event-summary").length; i++) { //Loops through events
        tempEvents.push($(response.data).find(".event-summary").eq(i).text()) //Adds events to array

        if(tempEvents[i].includes("VIRTUAL - ")) {
            eventWhere[i] = "Virtual"
            splitEvent = tempEvents[i].split("VIRTUAL - ")
            eventName[i] = splitEvent[1]
        } else if(tempEvents[i].includes(" (Virtual)")) {
            eventWhere[i] = "Virtual"
            splitEvent = tempEvents[i].split(" (Virtual)")
            eventName[i] = splitEvent[0]
        } else {
            eventName[i] = tempEvents[i]
        }
    }
    console.log(tempEvents);
    for(i = 1; i < 16; i++) {
        $("#event" + [i]).text("Name: " + eventName[i]);
    }

}
