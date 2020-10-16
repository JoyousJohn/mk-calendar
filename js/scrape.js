function knollsSelected() {
    $(".schoolOptions").fadeOut()
    document.getElementById("knollsCalendar").style.visibility = "visible" //Hides MK/MH buttons
    scrapeKnolls()
}

async function scrapeKnolls() {
    try {
        response = await axios.get("https://cors-anywhere.herokuapp.com/calendar.google.com/calendar/u/0/htmlembed?src=mhrd.org_ccteiaobdj0su75og9mc2u6h4g@group.calendar.google.com")
        //response = await axios.get("https://api.allorigins.win/get?url=calendar.google.com/calendar/u/0/htmlembed?src=mhrd.org_ccteiaobdj0su75og9mc2u6h4g@group.calendar.google.com")
        //response = await axios.get("http://corsproxy.nodester.com/?src=pastebin.com/raw/sHP8fzfk")
    } catch (err) { console.log(err)
    }
    getKnolls(response.data)
}
