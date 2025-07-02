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
    "XIIc": "#bc2023",

    "1":"#094a25",
    "2":"#0c6b37",
    "3":"#f8b324",
    "4":"#eb442c",
    "5":"#bc2023"}


const sortRouteByGrades = (a,b) => {
    if(a.difficulty.jump && b.difficulty.jump){
        return JUMP_SCALA.indexOf(a.difficulty.jump) - JUMP_SCALA.indexOf(b.difficulty.jump)
    }else if (a.difficulty.normal && b.difficulty.normal){
        return NORMAL_SCALA.indexOf(a.difficulty.normal) - NORMAL_SCALA.indexOf(b.difficulty.normal)
    }else if (a.difficulty.normal && b.difficulty.jump){
        return 1
    }else if (a.difficulty.jump && b.difficulty.normal){
        return -1
    }else{
        return 0
    }
}

const sortGradeInTable= (a, b, rowA, rowB) => {
    console.log(rowA)
    console.log(rowB)
  const res =  sortRouteByGrades(rowA,rowB)
    console.log(res)
  return res
}
export { getRouteGrade, getGradeColor, NORMAL_SCALA, JUMP_SCALA, sortGradeInTable, sortRouteByGrades as sortSummitByGrades }