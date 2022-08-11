import { compileFromFile } from 'json-schema-to-typescript'
import { getBasePath } from './src/utils/get.js/index.js'
import fs from 'fs'
import version from './utils/latest.js'

// compile from file
const path =  `versions/${version}/plugin.schema.json`
const base = getBasePath(path)

compileFromFile(path)
  .then(ts => fs.writeFileSync(base + '.d.ts', ts))