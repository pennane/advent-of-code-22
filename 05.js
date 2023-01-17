import fs from 'fs'
import * as R from 'ramda'

const FILE_NAME = "05.input"

const readFile = n => fs.readFileSync(n, 'utf8')
const FILE = readFile(FILE_NAME)

const headLens = R.lensProp(0)
const lastLens = R.lensProp(-1)

const viewHead = R.view(headLens)
const viewLast = R.view(lastLens)

const parseStacks = R.pipe(
    R.pipe(viewHead, R.init),
    R.map(R.splitEvery(4)),
    R.transpose,
    R.map(R.filter(R.test(/\w/g))),
    R.map(R.chain(R.match(/\w/g))),
)

const parseMoves = R.pipe(
    R.pipe(viewLast, R.tail, R.init),
    R.map(R.pipe(
        R.slice("move ".length, Infinity),
        R.split(" from "),
        R.chain(R.split(" to ")),
        R.map(parseInt)
    )),
)

const parseStacksAndMoves = R.juxt([parseStacks, parseMoves])

const parseFile = R.pipe(
    R.split('\n'),
    R.splitWhen(R.isEmpty),
    parseStacksAndMoves
)

const applyMove = (stacks, [count, from, target]) => {
    const [moving, newFrom] = R.splitAt(count, stacks[from - 1])
    const newTarget = moving.reverse().concat(stacks[target - 1])
    
    return R.pipe(
        R.update(from - 1, newFrom),
        R.update(target - 1, newTarget)
    )(stacks)
}

const pipeline = R.pipe(
    parseFile,
    R.apply(R.reduce(applyMove)),
    R.map(R.head),
    R.join("")
)

console.log(pipeline(FILE))
