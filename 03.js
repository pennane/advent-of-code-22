import fs from 'fs'
import * as R from 'ramda'

const FILE_NAME = "03.input"

const readFile = n => fs.readFileSync(n, 'utf8')
const FILE = readFile(FILE_NAME)

const parseFile = R.pipe(R.split('\n'),R.reject(R.isEmpty))

const ceil = n => Math.ceil(n)
const middleIndex = R.pipe(R.length, R.divide(R.__, 2), ceil)
const splitAtMiddle = R.converge(R.splitAt, [middleIndex, R.identity])


const sharedCharacters = strs => R.uniq(strs.reduce(
    (set, str) => R.filter(R.flip(R.includes)(str), set)
))

const compartmentIntersection = R.pipe(splitAtMiddle,sharedCharacters)

const isInclusiveBetween = (a,b) => R.both(R.gte(R.__, a), R.lte(R.__, b))

const KEYCODES = {
    a: "a".charCodeAt(0),
    z: "z".charCodeAt(0),
    A: "A".charCodeAt(0),
    Z: "Z".charCodeAt(0)
}

const LOWERCASE_STARTING_PRIORITY = 1
const UPPERCASE_STARTING_PRIORITY = LOWERCASE_STARTING_PRIORITY + KEYCODES.z - KEYCODES.a + 1 


const charcodePriority = R.cond([
    [
        isInclusiveBetween(KEYCODES.a, KEYCODES.z),
        R.pipe(R.subtract(R.__, KEYCODES.a), R.add(LOWERCASE_STARTING_PRIORITY))
    ],
    [
        isInclusiveBetween(KEYCODES.A, KEYCODES.Z),
        R.pipe(R.subtract(R.__, KEYCODES.A), R.add(UPPERCASE_STARTING_PRIORITY))
    ],
    [
        R.T,
        R.always(0)
    ]
])

const toCharcode = s => s.charCodeAt(0)

const priority = R.pipe(toCharcode, charcodePriority)

const pipeline = R.pipe(
    parseFile,
    R.tap(R.pipe(R.length, console.log)),
    R.chain(compartmentIntersection),
    R.map(priority),
    R.sum
)

const ELF_GROUP_SIZE = 3


const pipeline2 = R.pipe(
    parseFile,
    R.splitEvery(ELF_GROUP_SIZE),
    R.chain(sharedCharacters),
    R.map(priority),
    R.sum
)

console.log(pipeline(FILE), pipeline2(FILE))
