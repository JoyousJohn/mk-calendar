var eventName = [] //The cleaned up event name
var realStartDate = [] //Isn't set to 1st of month if first day is last month. i.e. Jan 1 for Christmas break would be December 23rd or something
var startDate = [] //Integer date of start time
var startTime = [] //Start time
var endTime = [] //End time
var rooms = [] //Rooms

var isVirtual = [] //Only true if zoom or virtual found in summary
var isZoom = [] //Only true if zoom found in summary
var isClosed = [] //If no school
isStreamed = [] //If live streamed
var isCancelled = [] //If event canceled
var isHomeWorkFree = [] //If is a homework free weekend

var selectMode = "click"
var theme = "light"

function load() { //Might probably need to use for something later...
    //$(".pEventVirtual").hide()
    $(".eventInfo").hide()
    $(".eWarning").hide()
    $(".eExtraDates").hide()
    $(".eStartTime").hide()
    $(".eRoom").hide()
    $(".eTimes").hide()

    $("#clickSelect").addClass("optionSelected")
    $("#hoverSelect").addClass("optionUnselected")
    //$("#themeSelect").addClass("themeOption")
}

function appendKnolls(data, currentMonthInt) {
    //console.log(data)
    var tempDate = new Date(2020, currentMonthInt - 1)
    const month = tempDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    $(".eventTemplate:not(:first)").remove(); //Clear previous events from DOM, if there are any
    $(".eventTemplate").eq(0).hide() //Hide the first one
    eventName = []
    realStartDate = []
    startDate = []
    isVirtual = []
    isZoom = []
    isStreamed = []
    isClosed = [] //If no school
    isCancelled = []
    isHomeWorkFree = []
    for(var i = 0; i < data.length; i++) {
        var newElement = $(".eventTemplate").eq(0).clone().show().insertAfter(".eventTemplate:last"); //Can also show after line 15 //4/19 what used to be line 15 lol
        var d
        if (data[i].start.date != undefined) {
            d = new Date(data[i].start.date)
            red = new Date(data[i].start.date)
        } else {
            d = new Date(data[i].start.dateTime)
            red = new Date(data[i].start.dateTime)
            startTime[i] = d.toLocaleTimeString().replace(":00 ", " ")
            $(".eTimes").eq(i + 1).text(startTime[i]).show()
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
        $(".eRoom").eq(i + 1).text(rooms[i]).show()

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

        //$(".eventTemplate").eq(1).addClass("eventTemplate-dark")
    }
    if (theme == "dark") { //Have to place these below bc elments are fully removed when theme switch unlike calendar elements, etc.
        $(".eventTemplate").addClass("eventTemplate-dark")
        $(".pEventDate").addClass("pEventDate-dark")
        $(".pEventName").addClass("pEventName-dark")
        $(".pEventStatus").css("color", "C6FFCD") //Avoiding dark class because makes everything visible
    } else { //New theme is light
        $(".eventTemplate").removeClass("eventTemplate-dark")
        $(".pEventDate").removeClass("pEventDate-dark")
        $(".pEventName").removeClass("pEventName-dark")
        $(".pEventStatus").css("color", "696969")
        for (var i = 0; i < $(".eventTemplate").length; i++) {
            setEventTemplateColors(i)
        }
    }
    for (var i = 0; i < $(".eventTemplate").length; i++) {
        setEventStatus(i) //If event is special make status visible
    }
    hover() //Took a whileeee to figure this out! //Update DOM
}

function setEventTemplateColors(i) {
    if (isVirtual[i] == true) {
        $(".eventTemplate").eq(i + 1).addClass("eventTemplate-virtual")
    } if (isClosed[i] == true) {
        $(".eventTemplate").eq(i + 1).css("background-color", "F0F8FF")
    } if (isCancelled[i] == true) {
        $(".eventTemplate").eq(i + 1).css("background-color", "FFF9DD")
    } if (isHomeWorkFree[i] == true) {
        $(".eventTemplate").eq(i + 1).css("background-color", "FFF9DD")
    }
}

function setEventStatus(i) {
    if (isVirtual[i] == true) {
        $(".pEventStatus").eq(i + 1).css("opacity", "1")
        $(".pEventStatus").eq(i + 1).text("VIRTUAL")
        $(".eWarning").eq(i + 1).show()
        $(".eWarningLabel").eq(i + 1).text("This event is virtual")
        if (isZoom[i] == true) {
            $(".pEventStatus").eq(i + 1).text("ZOOM")
            $(".eWarningLabel").eq(i + 1).text("This event is virtual via Zoom")
        }
    } else if (isClosed[i] == true) {
        $(".pEventStatus").eq(i + 1).css("opacity", "1")
        $(".pEventStatus").eq(i + 1).text("CLOSURE")
        $(".eWarning").eq(i + 1).show()
        $(".eWarningLabel").eq(i + 1).text("School is not in session")
    } else if (isCancelled[i] == true) {
        $(".pEventStatus").eq(i + 1).css("opacity", "1")
        $(".pEventStatus").eq(i + 1).text("CANCELLED")
        $(".eWarning").eq(i + 1).show()
        $(".eWarningLabel").eq(i + 1).text("This event has been cancelled")
    } else if (isHomeWorkFree[i] == true) {
        $(".eWarning").eq(i + 1).show()
        $(".eWarningLabel").eq(i + 1).text("Teachers are not allowed to give homework over this weekend nor have due dates Monday and/or Tuesday")
        $(".eWarning").eq(i + 1).css("grid-column", "1 / 3")
    } else if (isStreamed[i] == true) {
        $(".pEventStatus").eq(i + 1).css("opacity", "1")
        $(".pEventStatus").eq(i + 1).text("Live Streamed")
    }
}

function analyzeSummary(summary, e) {
    summary = rephraseName(summary, e)
    summary = checkIfVirtual(summary, e)
    summary = checkIfStreamed(summary, e)
    summary = checkIfCancelled(summary, e)
    summary = checkIfSchoolClosed(summary, e)
    summary = checkIfHomeworkFree(summary, e)
    rooms[e] = ""
    summary = getRooms(summary, e)
    eventName[e] = summary
}

function checkIfVirtual(summary, e) { //Sees if event is virtual and returns name after cut
    var isVirtualFront = ["VIRTUAL - ", "Virtual "]
    var isVirtualBack = [" (Virtual)"]
    var isZoomBack = [" (Zoom)", " via Zoom"]
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

function checkIfStreamed(summary, e) {
    if(summary.includes("(live stream)")) {
        splitName = summary.split("(live stream)")
        summary = splitName[0]
        isStreamed[e] = true
    }
    return summary
}

function checkIfCancelled(summary, e) {
    var isCancelledMessages = ["CANCELLED - ", "CANCELED ", "(Cancelled) ", "(Canceled) ", "(Cancleced) "] //Some teacher had a typo there, lol
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
    if(summary.includes("SCHOOL CLOSED")) {
        summary = "School Closed"
        isClosed[e] = true
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
    "HSA", "CST", " hr ", " PE ", "AMC", "Spec Svcs", "TLC", "Holiday", "PAL", "Rock/Den", "IEP", " Aud ", "NJAC", "JHS", "Ed ", "MLK, ", "Math Club", "Lang",
    "Proj", "Tshirt", " Distr ", ", Musical", " Ind ", " Cert/", "Orch ", " Rm", "(SOPH)", "(JR)", "Practice-", "Guard-"]
    var correction = ["Meeting", " - Auditorium", "National Honors Society ", "Gifted & Talented", "Academy of Performing Arts", "Board of Education",
    "Junior State of America", " Graduation", "Middle School", "Room", " Education ", "Crisis Prevention Institute", "Armed Services Vocational Aptitude Battery",
    "Lacrosse", "Applied Health Sciences", "MHRD Education Association", "Experience", "Auditorium", "Home and School Association", "Child Study Team", " Hour",
    "Physical Education", "American Mathematics Competition", "Special Services", "Teen Leadership Council", "Christmas", "Police Athletic League", "Rockaway and Denville",
    "Individualized Education Program/Plan", " Auditorium ", "NJ Athletic Conference", "Junior High School", "Education ", "Marin Luther King ", "Math Club Meeting",
    "Language", "Project", "T-shirt", " Distribution ", " (Musical)", " Induction ", " Certificate/", "Orchestra ", " Room", "(Sophomore)", "(Junior)", "Practice", "Guard"]
    for (n in wrongName) {
        if(summary.includes(wrongName[n])) {
            summary = summary.replace(wrongName[n], correction[n])
        }
    }
    return summary
}

function getRooms(summary, e) {
    if(summary.includes(" - Auditorium")) {
        summary = summary.replace(" - Auditorium", "")
        rooms[e] += "Auditorium"
    }
    if(summary.includes(", aud")) {
        summary = summary.replace(", aud", "")
        rooms[e] += "Auditorium"
    }
    if(summary.includes(" AUD.")) {
        summary = summary.replace(" AUD.", "")
        rooms[e] += "Auditorium"
    }
    if(summary.includes(", Library")) {
        summary = summary.replace(", Library", "")
        rooms[e] += "Library"
    }
    if(summary.includes(", Dance Studio")) {
        summary = summary.replace(", Dance Studio", "")
        rooms[e] += "Dance Studio"
    }
    return summary
}

function toggleOption(type) {
    if (type == "mode") {
        $("#hoverSelect, #clickSelect").toggleClass("optionUnselected optionSelected")
        if (selectMode == "click") {
            selectMode = "hover";
        } else {
            selectMode = "click";
        }
        hover()
    } else { //Chaning light/bodyDark theme(s)
        if (theme == "light") {
            theme = "dark";
        } else {
            theme = "light";
        }
        setDates(0); //Really wish I took a different route not requiring this method
        //Body and small calendar
        $("body").toggleClass("bodyDark")
        $("#miniCal").toggleClass("miniCal-dark")
        $("#calHeader").toggleClass("calHeader-dark")
        $("#calHeader button").toggleClass("calHeaderArrow-dark")
        $("#calDaysOfWeek").toggleClass("calDaysOfWeek-dark")

        //Buttons under calendar
        $("#themeDiv").toggleClass("themeDiv-dark")
        $("#themeButton").toggleClass("themeButton-dark")
        $("#selectDiv").toggleClass("selectDiv-dark")
        $("#selectButton").toggleClass("selectButton-dark")
    }
}

function hover() { //Expand when hovered upon and show info
        if (selectMode == "hover") {
            $(".eventTemplate").hover(function() {
                var thisElement = $(".eventInfo").eq($(this).index())
                thisElement.slideToggle("swing")
            }, function() {
                $(".eventInfo").eq($(this).index()).slideToggle("slow")
            });
        } else {
            $(".eventTemplate").unbind('mouseenter mouseleave')
        }
}

//Left and right arrow keys to change months
document.onkeydown = checkKey
function checkKey(e) {
    if (e.keyCode == '37') {
       setDates(-1)
    } else if (e.keyCode == '39') {
       setDates(1)
    }
}
