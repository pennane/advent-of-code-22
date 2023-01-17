import fs from 'fs'

const FILE_NAME = '06.input'

const readFile = (n) => fs.readFileSync(n, 'utf8')

const FILE = readFile(FILE_NAME)

const MARKER_LENGTH = 4

const pipe = fs => v => fs.reduce((v, f) => f(v), v)
const converge = cf => bfs => v => cf(...bfs.map(f => f(v)))
const length = v => v.length
const eqBy = f => (a, b) => f(a,b)
const eq = eqBy((a, b) => a === b ) 
const find = f => iter => {
    for (const v of iter) {
        if (f(v)) {
            return v
        }
    }
}
const uniq = a => a.filter((v, i, a) => a.indexOf(v) === i) 
const allUniq = converge(eq)([
    length, pipe([uniq, length])
])

const windowsIndexed = size => function* (arr) {
    let i = 0;
    while (i+size-1< arr.length) {
        yield [arr.slice(i,i+size), i]
        i++;
    }
}

const markerEndIndex = pipe([
    windowsIndexed(MARKER_LENGTH),
    find(([window, i]) => allUniq(Array.from(window))),
    ([window, i]) => i + MARKER_LENGTH
]) 

console.log(markerEndIndex(FILE))

