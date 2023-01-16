import fs from 'fs'
import * as R from 'ramda'

const FILE_NAME = "01.input"

const readFile = n => fs.readFileSync(n, 'utf8')

const FILE = readFile(FILE_NAME)

const chunkSums = R.pipe(
    R.split('\n\n'),
    R.map(R.pipe(
      R.split('\n'),
      R.map(parseFloat),
      R.sum
    )),
)

const largestChunkSum = R.pipe(chunkSums,R.reduce(R.max,0))
const largest3ChunkSums = R.pipe(chunkSums,R.sort(( a, b ) => b - a), R.take(3))
console.log(R.sum(largest3ChunkSums(FILE)))
