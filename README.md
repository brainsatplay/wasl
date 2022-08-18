# wasl
 The Web Application Specification Language (WASL)

## What is WASL?
`wasl` is a specification language for defining web applications. 

`wasl` is written in [JSON Schema](https://json-schema.org/) and validated using [Ajv](https://ajv.js.org/). Typescript types are generaged using [json-schema-to-typescript](https://www.npmjs.com/package/json-schema-to-typescript). It inherits heavily from the `package.json` file from Node.js, though includes a new `graph` key/value pair to declare application logic and associations with other code files.

Each version of `wasl` is archived in the `versions` folder of this repository.

## Errors vs Warnings
Errors mean that the WASL file will not run.

Warnings indicate that there is suboptimal syntax in the files themselves. However, these are corrected to load the file and don't impact loaded object format.

## Features
- Validation of original JSON files and loaded objects against the JSON Schema
- Automatic importing of code specified using the `src` key (anywhere in the WASL file!)


##  WASL Example Syntax
```json
{
    "graph": {
        "nodes": {
            "first": {
                "src": "first.wasl.json",
                "offload": false,
                "extensions": {
                    "arbitrary": {
                        "x": 1080,
                        "y": 720
                    }
                }
            } ,
            "second": {} 
        },
        "edges": {
            "first": {
                "second" :{
                    "protocol": "none"
                }
            } 
        }
    }
}
```

On activation, exports of files linked through "src" keys (throughout the entire WASL file) are flattened to their object.

## Limitations
With the way that WASL handles remote importing (using `remote-esm`), files that are not directly linked to (e.g. index.wasl.json links to `https://example.com/index.js` which imports `function.js`, our indirect link)  **cannot** share references or modify them during runtime *unless* you use **reference mode**.

## Contributing
 > **Note:** Use Node v16.15.0 or higher (which support import assertions for JSON files) to run the tests

## Acknowledgments
`wasl` was developed for [brainsatplay], along with [graphscript] and [visualscript], to construct interactive, high-performance web applications as directed acyclic graphs (DAGs).

[brainsatplay]:(https://github.com/brainsatplay)
[graphscript]:(https://github.com/brainsatplay/graphscript)
[visualscript]:(https://github.com/brainsatplay/visualscript)