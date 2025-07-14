import { colors } from 'quasar'
const { getPaletteColor } = colors

const getRouteGrade = (route) => {
  if (route.difficulty.jump) {
    return route.difficulty.jump
  } else if (route.difficulty.normal) {
    return route.difficulty.normal
  } else {
    return undefined
  }
}

const getGradeColor = (grade) => {
  return COLORS[grade]
}

const JUMP_SCALA = ['1', '2', '3', '4', '5']

const NORMAL_SCALA = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VIIa',
  'VIIb',
  'VIIc',
  'VIIIa',
  'VIIIb',
  'VIIIc',
  'IXa',
  'IXb',
  'IXc',
  'Xa',
  'Xb',
  'Xc',
  'XIa',
  'XIb',
  'XIc',
  'XIIa',
  'XIIb',
  'XIIc',
]
const COLORS = {
  I: getPaletteColor('scale-green1'),
  II: getPaletteColor('scale-green2'),
  III: getPaletteColor('scale-green3'),
  IV: getPaletteColor('scale-green4'),
  V: getPaletteColor('scale-red1'),
  VI: getPaletteColor('scale-red2'),
  VIIa: getPaletteColor('scale-red3'),
  VIIb: getPaletteColor('scale-red3'),
  VIIc: getPaletteColor('scale-red3'),
  VIIIa: getPaletteColor('scale-red4'),
  VIIIb: getPaletteColor('scale-red4'),
  VIIIc: getPaletteColor('scale-red4'),
  IXa: getPaletteColor('scale-red5'),
  IXb: getPaletteColor('scale-red5'),
  IXc: getPaletteColor('scale-red5'),
  Xa: getPaletteColor('scale-red6'),
  Xb: getPaletteColor('scale-red6'),
  Xc: getPaletteColor('scale-red6'),
  XIa: getPaletteColor('scale-red7'),
  XIb: getPaletteColor('scale-red7'),
  XIc: getPaletteColor('scale-red7'),
  XIIa: getPaletteColor('scale-red8'),
  XIIb: getPaletteColor('scale-red8'),
  XIIc: getPaletteColor('scale-red8'),

  1: getPaletteColor('scale-green1'),
  2: getPaletteColor('scale-green3'),
  3: getPaletteColor('scale-red1'),
  4: getPaletteColor('scale-red3'),
  5: getPaletteColor('scale-red6'),
}

const sortRouteByGrades = (a, b) => {
  let idxA = 0
  let idxB = 0
  if (a.difficulty.jump) {
    idxA = JUMP_SCALA.indexOf(a.difficulty.jump)
  } else if (a.difficulty.normal) {
    idxA = NORMAL_SCALA.indexOf(a.difficulty.normal) + JUMP_SCALA.length
  }
  if (b.difficulty.jump) {
    idxB = JUMP_SCALA.indexOf(b.difficulty.jump)
  } else if (b.difficulty.normal) {
    idxB = NORMAL_SCALA.indexOf(b.difficulty.normal) + JUMP_SCALA.length
  }
  return idxA - idxB
}

const sortGradeInTable = (a, b, rowA, rowB) => {
  const res = sortRouteByGrades(rowA, rowB)
  return res
}
export {
  getRouteGrade,
  getGradeColor,
  NORMAL_SCALA,
  JUMP_SCALA,
  sortGradeInTable,
  sortRouteByGrades as sortSummitByGrades,
}
