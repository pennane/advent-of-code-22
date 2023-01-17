import fs from 'fs'
import * as R from 'ramda'

const FILE_NAME = "01.input"

const readFile = n => fs.readFileSync(n, 'utf8')

const FILE = readFile(FILE_NAME)

const parseFile = R.pipe(
    R.split('\n\n'),
    R.map(
        R.pipe(
            R.split('\n'),
            R.map(parseFloat)
        )
    )
)

const chunkSums = R.map(R.sum)
const arrMax = R.reduce(R.max, 0)

const largestChunkSum = R.pipe(
    parseFile,
    chunkSums,
    arrMax
)

const sortDec = R.sort(( a, b ) => b - a)

const sumOfLargest3chunks = R.pipe(
    parseFile,
    chunkSums,
    sortDec,
    R.take(3),
    R.sum
)

console.log(largestChunkSum(FILE), sumOfLargest3chunks(FILE))
