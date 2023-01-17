import fs from 'fs'
import * as R from 'ramda'

const FILE_NAME = '08.input'

const readFile = (n) => fs.readFileSync(n, 'utf8')

const FILE = readFile(FILE_NAME)

const parseFile = R.pipe(
  R.split('\n'),
  R.map(R.pipe(R.split(''), R.map(parseInt))),
  R.reject(R.isEmpty)
)

const visibleAbove = (matrix, x, y) => {
  const height = matrix[y][x]
  return !R.range(0, y).some((i) => matrix[i][x] >= height)
}
const visibleRight = (matrix, x, y) => {
  const height = matrix[y][x]
  return !R.range(x + 1, matrix[0].length).some((i) => matrix[y][i] >= height)
}
const visibleBelow = (matrix, x, y) => {
  const height = matrix[y][x]
  return !R.range(y + 1, matrix.length).some((i) => matrix[i][x] >= height)
}
const visibleLeft = (matrix, x, y) => {
  const height = matrix[y][x]
  return !R.range(0, x).some((i) => matrix[y][i] >= height)
}

const visible = R.anyPass([
  visibleAbove,
  visibleRight,
  visibleBelow,
  visibleLeft
])

const scoreTop = (matrix, x, y) => {
  const height = matrix[y][x]
  let score = 0
  for (let i = y - 1; i >= 0; i--) {
    score++
    if (matrix[i][x] >= height) return score
  }
  return score
}
const scoreRight = (matrix, x, y) => {
  const height = matrix[y][x]
  let score = 0
  for (let i = x + 1; i < matrix[0].length; i++) {
    score++
    if (matrix[y][i] >= height) return score
  }
  return score
}
const scoreBottom = (matrix, x, y) => {
  const height = matrix[y][x]
  let score = 0
  for (let i = y + 1; i < matrix.length; i++) {
    score++
    if (matrix[i][x] >= height) return score
  }
  return score
}
const scoreLeft = (matrix, x, y) => {
  const height = matrix[y][x]
  let score = 0
  for (let i = x - 1; i >= 0; i--) {
    score++
    if (matrix[y][i] >= height) return score
  }
  return score
}

const unnestTreesWith = (f) => (m) =>
  m.flatMap((r, y) => r.flatMap((_, x) => f(m, x, y)))

const countVisibleTrees = R.pipe(
  unnestTreesWith((m, x, y) => (visible(m, x, y) ? [1] : [])),
  R.length
)

const pipeline = R.pipe(parseFile, countVisibleTrees)

const multAll = (...ns) => {
  return ns.reduce((prod, val) => prod * val)
}

const treeScore = R.converge(multAll, [
  scoreTop,
  scoreRight,
  scoreBottom,
  scoreLeft
])

const treeScenicScores = unnestTreesWith(treeScore)

const pipeline2 = R.pipe(parseFile, treeScenicScores, R.reduce(R.max, 0))

console.log(pipeline(FILE), pipeline2(FILE))
