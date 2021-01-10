function setDescription(name) {
    var names = []
    var descriptions = []

    names[0] = "Math Club Meeting"
    descriptions[0] = "Math Club is designed for students from all grades who like fun, mathematics, games and puzzles, and competing in mathematics. " +
    "The members also provide peer tutoring to students in need of math help on a weekly basis. Meetings are " +
    "held on a bi-weekly basis."
    names[1] = "Christmas Break"
    descriptions[1] = "Morris Knolls is closed for the holidays"



    for (d in descriptions) {
        if (names[d] == name) {
            return descriptions[d]
            break
        }
    }
}
