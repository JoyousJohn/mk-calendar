function knollsSelected() {
    $(".schoolOptions").fadeOut() //Hides MK/MH buttons
    setTimeout(function(){
        $("#knollsDiv").fadeIn() //Shows temp labels
    }, 300);
    setDates()
    scrapeKnolls() //Begins entire process
}

async function scrapeKnolls() {
    //let id = "mhrd.org_ccteiaobdj0su75og9mc2u6h4g@group.calendar.google.com"
    //let key = "AIzaSyA3Fshq5WSPcvNe8zQTXnbCe6VUArfo13w"
    var d = new Date()
    const month = d.getMonth()
    console.log("month " + month)
    let site = "https://www.googleapis.com/calendar/v3/calendars/mhrd.org_ccteiaobdj0su75og9mc2u6h4g@group.calendar.google.com/events?key=AIzaSyA3Fshq5WSPcvNe8zQTXnbCe6VUArfo13w&timeMin=2021-" + month + "-01T00:00:00-00:00"
    try {
        response = await axios.get(site)
    } catch (error) { console.log(error) }
    console.log(response.data)
}

function setDates() {
    var d = new Date() //New object
    //var date = d.getDate()
    //var month = d.getMonth() + 1 //+1 since JS counts January as 0
    //console.log("date " + date + " " + month)
    const month = d.toLocaleString('default', { month: 'long' }).toUpperCase() + " " + d.getFullYear();
    $("#calSelectHeader > label").text(month) //Sets month
    var firstDay = new Date(d.getFullYear(), d.getMonth(), 1)
    firstDay = firstDay.getDay() + 1 //First weekday day of month. i.e. 5 = Friday and is 1st day of month
    var lastDate = new Date(d.getFullYear(), d.getMonth()+1, 0)
    lastDate = lastDate.getDate() //Gets final date
    var dateCount = 1
    for(var a = firstDay; dateCount <= lastDate; a++) {
        $("#slot" + a).text(dateCount)
        dateCount++
    }
}
