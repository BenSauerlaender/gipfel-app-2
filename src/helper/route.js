const getRouteGrade = (route) => {
    if(route.difficulty.jump) {
        return route.difficulty.jump
    } else if(route.difficulty.normal) {
        return route.difficulty.normal
    }else{
        return undefined
    }
}

const getGradeColor = (grade) => {
    return COLORS[grade]
}

const JUMP_SCALA = [ "1", "2", "3", "4", "5" ]


const NORMAL_SCALA = [
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
    "I": "#aad576",
    "II": "#73a942",
    "III": "#538d22",
    "IV": "#245501",

    "V": "#faa307",
    "VI": "#f48c06",
    "VIIa": "#e85d04",
    "VIIb": "#e85d04",
    "VIIc": "#e85d04",
    "VIIIa": "#dc2f02",
    "VIIIb": "#dc2f02",
    "VIIIc": "#dc2f02",
    "IXa": "#d00000",
    "IXb": "#d00000",
    "IXc": "#d00000",
    "Xa": "#9d0208",
    "Xb": "#9d0208",
    "Xc": "#9d0208",
    "XIa": "#6a040f",
    "XIb": "#6a040f",
    "XIc": "#6a040f",
    "XIIa": "#370617",
    "XIIb": "#370617",
    "XIIc": "#370617",

    "1":"#aad576",
    "2":"#538d22",
    "3":"#faa307",
    "4":"#e85d04",
    "5":"#9d0208"
}



const sortRouteByGrades = (a,b) => {
    let idxA = 0
    let idxB = 0
    if (a.difficulty.jump){
       idxA = JUMP_SCALA.indexOf(a.difficulty.jump)
    }else if (a.difficulty.normal){
       idxA = NORMAL_SCALA.indexOf(a.difficulty.normal) + JUMP_SCALA.length
    }
    if (b.difficulty.jump){
       idxB = JUMP_SCALA.indexOf(b.difficulty.jump)
    }else if (b.difficulty.normal){
       idxB = NORMAL_SCALA.indexOf(b.difficulty.normal) + JUMP_SCALA.length
    }
    return idxA - idxB
}

const sortGradeInTable= (a, b, rowA, rowB) => {
  const res =  sortRouteByGrades(rowA,rowB)
  return res
}
export { getRouteGrade, getGradeColor, NORMAL_SCALA, JUMP_SCALA, sortGradeInTable, sortRouteByGrades as sortSummitByGrades }