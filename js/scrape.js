var date = new Date() //Date object of now. NEED global to span more than one month either direction

function knollsSelected() {
    $(".schoolOptions").fadeOut() //Hides MK/MH buttons
    setTimeout(function(){
        $("#knollsDiv").fadeIn() //Shows temp labels
    }, 300);
    setDates(0)
    scrapeKnolls() //Begins entire process
}

async function scrapeKnolls() {
    const month = date.getMonth() + 1 //Without + 1 line 16 returns 400 error
    let site = "https://www.googleapis.com/calendar/v3/calendars/mhrd.org_ccteiaobdj0su75og9mc2u6h4g@group.calendar.google.com/events?key=AIzaSyA3Fshq5WSPcvNe8zQTXnbCe6VUArfo13w&timeMin=2021-" + month + "-01T00:00:00-00:00"
    try {
        response = await axios.get(site)
    } catch (error) { console.log(error) }
    //console.log(response.data)
}

function setDates(direction) { //Updates and sets the dates on the calendar during initiation or month change
    var d = date //Avoids hoisting with correct scope. Thanks https://stackoverflow.com/a/25559623/13297669!. Never mind, removed window... started working on its own? Guess it isn't necessary now...
    d.setMonth(d.getMonth() + direction) //Sets new month. This is important not to forget I already did this first!. Wow, this changes the original object?...
    const monthYear = d.toLocaleString('default', { month: 'long' }).toUpperCase() + " " + d.getFullYear();
    $("#calSelectHeader > label").text(monthYear) //Sets month header with year

    d.setDate(1) //Sets to 1st of the month
    var firstDay = d.getDay() + 1 //First weekday integer (1-7) day of month. i.e. 6 = Friday and is 1st day of month

    var lastDate = new Date(d.getFullYear(), d.getMonth() + 1, 0) //Creates object of the last day of the new month. Had to replace diretion + 1 with just + 1, took forever to realize!!! Line 23...

    lastDate = lastDate.getDate() //Gets final date. i.e. 30 or 31. Starts at 1, not 0, so returned is the actual day
    //Current month dates on calendar
    var dateCount = 1 //Counter for date to put in calendar slots
    for(var a = firstDay; dateCount <= lastDate; a++) {
        $("#slot" + a).text(dateCount) //Sets current month dates
        $("#slot" + a).css("color", "68C678"); //Forgot to set colors back, lol
        $("#slot" + a).css("font-weight", "bold");
        dateCount++ //Adds 1 to the date to put in calendar slot
    }

    //Previous month dates on calendar
    var prevMonth = new Date(d.getFullYear(), d.getMonth(), 0)
    lastDayPrevMonth = prevMonth.getDate() //Gets last day of previous month
    for(var b = firstDay - 1; b > 0; b--) {
        $("#slot" + b).text(lastDayPrevMonth); //Sets previous month dates
        $("#slot" + b).css("color", "DBDBDB"); //Changes color since not really important...
        $("#slot" + b).css("font-weight", "normal");
        lastDayPrevMonth--;
    }

    //Next month dates on calendar
    dateCount = 1
    for(var c = lastDate + firstDay; c < 36; c++) {
        $("#slot" + c).text(dateCount); //Sets next month dates
        $("#slot" + c).css("color", "DBDBDB"); //Changes color to gray
        $("#slot" + c).css("font-weight", "normal");
        dateCount++
    }
}
