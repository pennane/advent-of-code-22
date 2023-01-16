import fs from 'fs'
import * as R from 'ramda'

const FILE_NAME = '02.input'

const readFile = (n) => fs.readFileSync(n, 'utf8')

const FILE = readFile(FILE_NAME)

const eqAny = R.pipe(R.map(R.equals), R.anyPass)
const transform = (fs) => (v) => fs.map(R.applyTo(v))

const parseGames = (normalizer) =>
  R.pipe(
    R.split('\n'),
    R.map(R.split(' ')),
    R.reject((a) => a.length !== 2),
    R.map(normalizer),
  )

const [YOU_ROCK, YOU_PAPER, YOU_SCISSORS, OPP_ROCK, OPP_PAPER, OPP_SCISSORS] = [
  'X',
  'Y',
  'Z',
  'A',
  'B',
  'C'
]

const [STRATEGY_LOSE, STRATEGY_TIE, STRATEGY_WIN] = [
  YOU_ROCK,
  YOU_PAPER,
  YOU_SCISSORS
]

const [ROCK, PAPER, SCISSORS] = ['R', 'P', 'S']

const [ROCK_BEATER, PAPER_BEATER, SCISSORS_BEATER] = [PAPER, SCISSORS, ROCK]

const [
  ROCK_SCORE,
  PAPER_SCORE,
  SCISSORS_SCORE,
  WIN_SCORE,
  TIE_SCORE,
  LOSE_SCORE
] = [1, 2, 3, 6, 3, 0]

const normalizeShape = R.cond([
  [eqAny([YOU_ROCK, OPP_ROCK]), R.always(ROCK)],
  [eqAny([YOU_PAPER, OPP_PAPER]), R.always(PAPER)],
  [eqAny([YOU_SCISSORS, OPP_SCISSORS]), R.always(SCISSORS)]
])

const shapeScore = R.cond([
  [R.equals(ROCK), R.always(ROCK_SCORE)],
  [R.equals(PAPER), R.always(PAPER_SCORE)],
  [R.equals(SCISSORS), R.always(SCISSORS_SCORE)]
])

const winningShape = R.cond([
  [R.equals(ROCK), R.always(ROCK_BEATER)],
  [R.equals(PAPER), R.always(PAPER_BEATER)],
  [R.equals(SCISSORS), R.always(SCISSORS_BEATER)]
])

const losingShape = R.cond([
  [R.equals(ROCK_BEATER), R.always(ROCK)],
  [R.equals(PAPER_BEATER), R.always(PAPER)],
  [R.equals(SCISSORS_BEATER), R.always(SCISSORS)]
])

const secretShape = R.cond([
  [
    R.pipe(R.last, R.equals(STRATEGY_LOSE)),
    R.pipe(R.head, normalizeShape, losingShape)
  ],
  [
    R.pipe(R.last, R.equals(STRATEGY_TIE)),
    R.pipe(R.head, normalizeShape, R.identity)
  ],
  [
    R.pipe(R.last, R.equals(STRATEGY_WIN)),
    R.pipe(R.head, normalizeShape, winningShape)
  ]
])

const didWin = R.pipe(
  transform([R.last, R.pipe(R.head, winningShape)]),
  R.apply(R.includes)
)

const conclusionScore = R.cond([
  [R.apply(R.equals), R.always(TIE_SCORE)],
  [didWin, R.always(WIN_SCORE)],
  [R.T, R.always(LOSE_SCORE)]
])

const roundScore = R.converge(R.add, [
  R.pipe(R.last, shapeScore),
  conclusionScore
])

const rpsScore = R.pipe(
  parseGames(R.map(normalizeShape)),
  R.map(roundScore),
  R.sum
)

const secretScore = R.pipe(
  parseGames(R.juxt([R.pipe(R.head, normalizeShape), secretShape])),
  R.map(roundScore),
  R.sum
)

console.log(rpsScore(file), secretScore(file))
