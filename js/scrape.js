function knollsSelected() {
    $(".schoolOptions").fadeOut()
    document.getElementById("knollsCalendar").style.visibility = "visible"
    scrapeKnolls()
}

async function scrapeKnolls() {
    response = await axios.get("https://cors-anywhere.herokuapp.com/calendar.google.com/calendar/u/0/htmlembed?src=mhrd.org_ccteiaobdj0su75og9mc2u6h4g@group.calendar.google.com&ctz=America/New_York")
    //console.log(response.data)
    var tempSummaries = []
    for (i = 0; i < $(response.data).find(".event-summary").length; i++) {
        tempSummaries.push($(response.data).find(".event-summary").eq(i).text())
    }
    console.log(tempSummaries)
}
