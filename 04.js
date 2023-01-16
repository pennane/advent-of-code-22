import fs from 'fs'
import * as R from 'ramda'

const FILE_NAME = "04.input"

const readFile = n => fs.readFileSync(n, 'utf8')
const FILE = readFile(FILE_NAME)

const parseFile = R.pipe(
    R.split('\n'),
    R.reject(R.isEmpty),    
    R.map(
        R.pipe(
            R.split(','),
            R.map(R.pipe(R.split('-'), R.map(parseInt)))
        )
    )
)


const aFullyContainsB = ([a,b]) => b[0] >= a[0] && b[1] <= a[1]
const bFullyContainsA = ([a,b]) => aFullyContainsB([b,a])


const fullyContains = R.either(aFullyContainsB, bFullyContainsA)

const anyOverlap = R.ifElse(
    ([a,b]) => b[0] <= a[0],
    ([a,b]) => b[1] >= a[0],
    ([a,b]) => b[0] <= a[1]
) 

const pipeline = R.pipe(
    parseFile,
    R.filter(fullyContains),
    R.length
)

const pipeline2 = R.pipe(
    parseFile,
    R.filter(anyOverlap),
    R.length
)

console.log(pipeline(FILE), pipeline2(FILE))
