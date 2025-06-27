const getRouteGrade = (route) => {
    if(route.difficulty.jump) {
        return route.difficulty.jump
    } else if(route.difficulty.normal) {
        return route.difficulty.normal
    }
}

const getGradeColor = (grade) => {
    return COLORS[grade]
}



const SCALA = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VIIa",
    "VIIb",
    "VIIc",
    "VIIIa",
    "VIIIb",
    "VIIIc",
    "IXa",
    "IXb",
    "IXc",
    "Xa",
    "Xb",
    "Xc",
    "XIa",
    "XIb",
    "XIc",
    "XIIa",
    "XIIb",
    "XIIc"
]
const COLORS = {
    "I": "#094a25",
    "II": "#094a25",
    "III": "#0c6b37",
    "IV": "#0c6b37",
    "V": "#f8b324",
    "VI": "#f8b324",
    "VIIa": "#eb442c",
    "VIIb": "#eb442c",
    "VIIc": "#eb442c",
    "VIIIa": "#bc2023",
    "VIIIb": "#bc2023",
    "VIIIc": "#bc2023",
    "IXa": "#bc2023",
    "IXb": "#bc2023",
    "IXc": "#bc2023",
    "Xa": "#bc2023",
    "Xb": "#bc2023",
    "Xc": "#bc2023",
    "XIa": "#bc2023",
    "XIb": "#bc2023",
    "XIc": "#bc2023",
    "XIIa": "#bc2023",
    "XIIb": "#bc2023",
    "XIIc": "#bc2023"}

export { getRouteGrade, getGradeColor, SCALA }