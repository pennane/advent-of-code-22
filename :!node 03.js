import fs from 'fs'
import * as R from 'ramda'

const FILE_NAME = "01.input"

const readFile = n => fs.readFileSync(n, 'utf8')
const FILE = readFile(FILE_NAME)
console.log(FILE)
