function setDescription(name) {
    var names = []
    var descriptions = []

    names[0] = "Math Club Meeting"
    descriptions[0] = "Math Club is designed for students from all grades who like fun, mathematics, games and puzzles, and competing in mathematics. " +
    "The members also provide peer tutoring to students in need of math help on a weekly basis. Meetings are " +
    "held on a bi-weekly basis."
    names[1] = "Christmas Break"
    descriptions[1] = "Morris Knolls is closed for the holidays"
    names[2] = "Board of Education Meeting"
    descriptions[2] = "The Board of Education will be meeting on this date"
    names[3] = "NJ Math League"
    descriptions[3] = "The New Jersey Math League will be having a competition on this date. This statewide math contest consists of six" +
    "problems of varying difficulty. Certificates of merit are awarded to high scoring students."
    names[4] = "Academy of Performing Arts"
    descriptions[4] = "The APA offers a major in Theatre. Students with this major will be ready for almost any college major or career path encountered in the 21st Century, having acquired enhanced and developed imaginative capacity, flexible ways of thinking, self-discipline, and sophisticated presentation skills."
    names[5] = "Gifted & Talented"
    descriptions[5] = "Designed to challenge and inspire, the GT program of the MHRD is thriving on providing alternatives in acceleration and enrichment to students nominated, screened, and selected in all of the six federally-recognized categories of giftedness."
    names[6] = "End of Marking Period"
    descriptions[6] = "The marking period is ending on this date."

    for (d in descriptions) {
        if (name.includes(names[d])) {
            return descriptions[d]
            break
        }
    }
}
