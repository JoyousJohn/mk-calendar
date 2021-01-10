var eventRoom = []
var eventStart = []
var eventDate = []

var eventName = [] //The cleaned up event name
var realStartDate = [] //Isn't set to 1st of month if first day is last month. i.e. Jan 1 for Christmas break would be December 23rd or something
var startDate = [] //Integer date of start time
var startTime = [] //Start time
var endTime = [] //End time

var isVirtual = [] //Only true if zoom or virtual found in summary
var isZoom = [] //Only true if zoom found in summary
var isClosed = [] //If no school
var isCancelled = [] //If event canceled
var isHomeWorkFree = [] //If is a homework free weekend

function load() { //Might probably need to use for something later...
    //$(".pEventVirtual").hide()
    $(".eventInfo").hide()
    $(".eWarning").hide()
    $(".eExtraDates").hide()
    $(".eStartTime").hide()
    $(".eRoom").hide()
    $(".eTimes").hide()
}


function appendKnolls(data, currentMonthInt) {
    console.log(data)
    var tempDate = new Date(2020, currentMonthInt - 1)
    const month = tempDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    $(".eventTemplate:not(:first)").remove(); //Clear previous events from DOM, if there are any
    $(".eventTemplate").eq(0).hide() //Hide the first one
    eventName = []
    realStartDate = []
    startDate = []
    isVirtual = []
    isZoom = []
    isClosed = [] //If no school
    isCancelled = []
    isHomeWorkFree = []
    for(var i = 0; i < data.length; i++) {
        var newElement = $(".eventTemplate").eq(0).clone().show().insertAfter(".eventTemplate:last"); //Can also shoiw after line 15
        var d
        if (data[i].start.date != undefined) {
            d = new Date(data[i].start.date)
            red = new Date(data[i].start.date)
        } else {
            d = new Date(data[i].start.dateTime)
            red = new Date(data[i].start.dateTime)
            startTime[i] = d.toLocaleTimeString().replace(":00 ", " ")
            $(".eTimes").eq(i + 1).text(startTime[i])
            $(".eTimes").eq(i + 1).show()
        }
        startDate[i] = d.getDate() //Gets the start date
        //If event spans multiple days
        if (data[i].end.date != undefined) {
            ed = new Date(data[i].end.date) //ed = end date
        } else {
            ed = new Date(data[i].end.dateTime)
            endTime[i] = ed.toLocaleTimeString().replace(":00 ", " ")
            $(".eTimes").eq(i + 1).text($(".eTimes").eq(i + 1).html() + " to " + endTime[i])
        }
        if (d.getMonth() != currentMonthInt - 1) { //Or add one to the former
            d.setDate(1)
        }
        analyzeSummary(data[i].summary, i) //Dissects name

        $(".pEventName").eq(i + 1).text(eventName[i])
        $(".pEventDate").eq(i + 1).text(month + " " + d.getDate())
        if (red.getDate() != ed.getDate()) {
            if (red.getDate() + 1 != ed.getDate()) { //MLKJR, marking periods, etc. that have stupid multiple dates for some reason...
                var eventDates = red.toLocaleString('default', { month: 'long' });
                eventDates += " " + ordinal_suffix_of(red.getDate()) + " to " + ed.toLocaleString('default', { month: 'long' }) + " " + ordinal_suffix_of(ed.getDate())
                $(".eExtraDates").eq(i + 1).text(eventDates)
                $(".eExtraDates").eq(i + 1).show()
            }
        }
        $(".eDesc").eq(i + 1).text(setDescription(eventName[i]))
        if (isVirtual[i] == true) {
            $(".pEventStatus").eq(i + 1).css("visibility", "visible")
            $(".eventTemplate").eq(i + 1).css("background-color", "FFFBF7")
            $(".eventTemplate").eq(i + 1).css("border-color", "FFFBF7")
            $(".pEventStatus").eq(i + 1).text("VIRTUAL")
            $(".eWarning").eq(i + 1).show()
            $(".eWarningLabel").eq(i + 1).text("This event is virtual")
            if (isZoom[i] == true) {
                $(".pEventStatus").eq(i + 1).text("ZOOM")
                $(".eWarningLabel").eq(i + 1).text("This event is virtual via Zoom")
            }
        } if (isClosed[i] == true) {
            $(".pEventStatus").eq(i + 1).css("visibility", "visible")
            $(".eventTemplate").eq(i + 1).css("background-color", "F0F8FF")
            $(".eventTemplate").eq(i + 1).css("border-color", "F0F8FF")
            $(".pEventStatus").eq(i + 1).text("SCHOOL CLOSED")
            $(".eWarning").eq(i + 1).show()
            $(".eWarningLabel").eq(i + 1).text("School is not in session this day")
        } if (isCancelled[i] == true) {
            console.log("yuppers")
            $(".pEventStatus").eq(i + 1).css("visibility", "visible")
            $(".eventTemplate").eq(i + 1).css("background-color", "FFF9DD")
            $(".eventTemplate").eq(i + 1).css("border-color", "FFF9DD")
            $(".pEventStatus").eq(i + 1).text("CANCELLED")
            $(".eWarning").eq(i + 1).show()
            $(".eWarningLabel").eq(i + 1).text("This event has been cancelled")
        } if (isHomeWorkFree[i] == true) {
            $(".eventTemplate").eq(i + 1).css("background-color", "FFF9DD")
            $(".eventTemplate").eq(i + 1).css("border-color", "FFF9DD")
            $(".eWarning").eq(i + 1).show()
            $(".eWarningLabel").eq(i + 1).text("Teachers are not allowed to give homework over this weekend nor have due dates Monday and/or Tuesday")
            $(".eWarning").eq(i + 1).css("grid-column", "1 / 3")
        }
    }
    hover() //Took a whileeee to figure this out! //Update DOM
}

function analyzeSummary(summary, e) {
    summary = rephraseName(summary, e)
    summary = checkIfVirtual(summary, e)
    summary = checkIfCancelled(summary, e)
    summary = checkIfSchoolClosed(summary, e)
    summary = checkIfHomeworkFree(summary, e)
    eventName[e] = summary
}

function checkIfVirtual(summary, e) { //Sees if event is virtual and returns name after cut
    var isVirtualFront = ["VIRTUAL - ", "Virtual "]
    var isVirtualBack = [" (Virtual)"]
    var isZoomBack = [" (Zoom)"]
    for (v in isVirtualFront) {
        if(summary.includes(isVirtualFront[v])) {
            //console.log(isVirtualFront[v])
            splitName = summary.split(isVirtualFront[v])
            summary = splitName[1]
            isVirtual[e] = true
        } if(summary.includes(isVirtualBack[v])) {
            splitName = summary.split(isVirtualBack[v])
            summary = splitName[0]
            isVirtual[e] = true
        } if(summary.includes(isZoomBack[v])) {
            splitName = summary.split(isZoomBack[v])
            summary = splitName[0]
            isVirtual[e] = true
            isZoom[e] = true
        }
    }
    return summary
}

function checkIfCancelled(summary, e) {
    var isCancelledMessages = ["CANCELLED - ", "CANCELED ", "(Cancelled) "] //Some teacher had a typo there, lol
    for (c in isCancelledMessages) {
        if(summary.includes(isCancelledMessages[c])) {
            splitName = summary.split(isCancelledMessages[c])
            summary = splitName[1]
            isCancelled[e] = true
        }
    }
    return summary
}

function checkIfSchoolClosed(summary, e) {
    var isClosedMessages = ["School Closed - "]
    for (c in isClosedMessages) {
        if(summary.includes(isClosedMessages[c])) {
            splitName = summary.split(isClosedMessages[c])
            summary = splitName[1]
            isClosed[e] = true
        }
    }
    return summary
}

function checkIfHomeworkFree(summary, e) {
    if(summary.includes("HOMEWORK FREE WEEKEND")) {
        summary = "Homework Free Weekend"
        isHomeWorkFree[e] = true
    }
    return summary
}

function rephraseName(summary, e) {
    var wrongName = ["Mtg", ", Aud", "NHS ", "GT", "APA", "BOE", "JSA", " Grad", "MS", "Rm", " Ed ", "CPI", "ASVAB", "LAX", "AHS", "MHRDEA", "Exp.", ". Aud",
    "HSA", "CST", " hr ", " PE ", "AMC", "Spec Svcs", "TLC", "Holiday", "PAL", "Rock/Den", "IEP", " Aud ", "NJAC", "JHS", "Ed ", "MLK, ", "Math Club"]
    var correction = ["Meeting", " - Auditorium", "National Honors Society ", "Gifted & Talented", "Academy of Performing Arts", "Board of Education",
    "Junior State of America", " Graduation", "Middle School", "Room", " Education ", "Crisis Prevention Institute", "Armed Services Vocational Aptitude Battery",
    "Lacrosse", "Applied Health Sciences", "MHRD Education Association", "Experience", "Auditorium", "Home and School Association", "Child Study Team", " Hour",
    "Physical Education", "American Mathematics Competition", "Special Services", "Teen Leadership Council", "Christmas", "Police Athletic League", "Rockaway and Denville",
    "Individualized Education Program/Plan", " Auditorium ", "NJ Athletic Conference", "Junior High School", "Education ", "Marin Luther King ", "Math Club Meeting"]
    for (n in wrongName) {
        if(summary.includes(wrongName[n])) {
            summary = summary.replace(wrongName[n], correction[n])
        }
    }
    return summary
}

function hover() { //Expand when hovered upon and show info
    $(".eventTemplate").hover(function() {
        var thisElement = $(".eventInfo").eq($(this).index())
        thisElement.slideToggle("swing")
    }, function() {
        $(".eventInfo").eq($(this).index()).slideToggle("slow")
    });
}

//Left and right arrow keys to change months
document.onkeydown = checkKey
function checkKey(e) {
    if (e.keyCode == '37') {
       setDates(-1)
    }
    else if (e.keyCode == '39') {
       setDates(1)
    }
}
