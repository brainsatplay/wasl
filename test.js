import * as wasl from "./dist/index.esm.js"
import { getTestData } from "./utils/get.js"
import version from "./utils/latest.js"

const data = await getTestData(version)
wasl.validate(data)