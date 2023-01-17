import fs from 'fs'
import * as R from 'ramda'

const FILE_NAME = '07.input'

const readFile = (n) => fs.readFileSync(n, 'utf8')

const FILE = readFile(FILE_NAME)

const parseFile = R.pipe(
  R.split('$ '),
  R.map(R.pipe(R.split('\n'), R.chain(R.when(R.isEmpty, R.always([]))))),
  R.reject(R.isEmpty)
)

const currentPath = R.nth(1)
const currentCommand = R.nth(0)
const commandName = R.pipe(currentCommand, R.nth(0), R.split(' '), R.nth(0))
const argName = R.pipe(currentCommand, R.nth(0), R.split(' '), R.nth(1))
const commandIs = (name) => R.pipe(commandName, R.equals(name))
const argIs = (name) => R.pipe(argName, R.equals(name))

const flipTuple = ([a, b]) => [b, a]

const parseFiles = R.pipe(
  R.tail,
  R.map(R.split(' ')),
  R.reject(R.pipe(R.head, R.equals('dir'))),
  R.map(R.pipe(flipTuple, R.adjust(1, parseInt))),
  R.fromPairs
)

const parseNewPath = R.cond([
  [argIs('/'), R.always([])],
  [argIs('..'), R.pipe(currentPath, R.init)],
  [R.T, R.converge(R.append, [argName, currentPath])]
])

const parseCommand = R.cond([
  [
    commandIs('ls'),
    R.pipe(([command, path, dirs]) => [
      path,
      R.over(R.lensPath(path), R.mergeDeepLeft(parseFiles(command)), dirs)
    ])
  ],
  [
    commandIs('cd'),
    R.pipe(([command, path, dirs]) =>
      R.pipe(
        parseNewPath,
        R.juxt([
          R.identity,
          (path) =>
            R.over(R.lensPath(path), R.when(R.isNil, R.always({})), dirs)
        ])
      )([command, path])
    )
  ],
  [R.T, ([_, path, dirs]) => [path, dirs]]
])

const directorySize = R.unless(
  R.is(Number),
  R.pipe(
    R.values,
    R.reduce((sum, val) => {
      if (R.is(Number, val)) {
        return sum + val
      }
      return directorySize(val) + sum
    }, 0)
  )
)


const directorySizeFromPath = (dirs) => (path) => R.pipe(
    R.path(path),
    directorySize
)(dirs)


const isObject = val => {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}

const allDirectoryPaths = (val, currentPath = []) => {
    const entries = Object.entries(val)
    const low = entries.flatMap(([key, value]) => isObject(value) 
        ? [currentPath.concat(key)]
        : []
    )

    const deep = entries.flatMap(([key, value]) => isObject(value) 
        ? allDirectoryPaths(value, currentPath.concat(key))
        : []
    )

    return low.concat(deep)
}


const parseDirectoryTree = R.pipe(
  R.reduce(
    ([path, dirs], command) => {
      const parsed = parseCommand([command, path, dirs])
      return parsed
    },
    [[], []]
  ),
  R.nth(1)
)

const part1 = (file) => {
    const parsedFile = parseFile(file)
    const dirs = parseDirectoryTree(parsedFile)
    const paths = R.uniq(allDirectoryPaths(dirs))
    const dirSizes = paths.map(directorySizeFromPath(dirs))
    const lt100000 = dirSizes.filter(n => n <= 100000)
    return R.sum(lt100000)
}

const TOTAL_AVAILABLE = 70000000
const NEEDED_AMOUNT = 30000000

const part2 = (file) => {
    const parsedFile = parseFile(file)
    const dirs = parseDirectoryTree(parsedFile)
    const used = directorySizeFromPath(dirs)([])
    const paths = R.uniq(allDirectoryPaths(dirs))
    const dirSizes = paths.map(directorySizeFromPath(dirs))
    const requiredSpace = used + NEEDED_AMOUNT - TOTAL_AVAILABLE
    const gtRequired = dirSizes.filter(s => s >= requiredSpace)
    gtRequired.sort((a, b) => a - b)
    return R.head(gtRequired)
}


console.log(part1(FILE), part2(FILE))
