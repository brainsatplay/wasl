# Web Application Specification Languages (WASL) 1.0

## Introduction
**WASL** is a specification language for defining web applications. 

At its core, `wasl` allows you to specify a JSON tree of source files and custom scripts. This then executes a whole program stored across the web.

**WASL** files inherit heavily from the `package.json` file from Node.js. 

The specification is written in [JSON Schema](https://json-schema.org/) and validated using [Ajv](https://ajv.js.org/). Typescript types are generaged using [json-schema-to-typescript](https://www.npmjs.com/package/json-schema-to-typescript). 

Its defining features are: 
- A new `graph` key/value pair to declare application logic and associations with other code files.
- The adoption of [ES Plugins]('https://github.com/brainsatplay/es-plugins') to instantiate Web Components through a configuration object

Each version of `wasl` is archived in the `versions` folder of this repository.

###  WASL Example Syntax
```json
{
    "graph": {
        "nodes": {
            "first": {
                "src": "first.wasl.json",
                "extensions": {
                    "arbitrary": {
                        "x": 1080,
                        "y": 720
                    }
                }
            } ,
            "second": {
                "href": "https://example.com/second"
            } 
        },
        "edges": {
            "first": {
                "second" :{
                    "protocol": "websockets"
                }
            } 
        }
    }
}
```

## The Libraries
The libraries in this repo validate and load **WASL** files into JavaScript.

### Libraries
1. `wasl` - Load the `src` keys into a **WASL** file.
2. `wasl-validate` - Validation of a **WASL** file using JSON Schema (Ajv)
3. `wasl-run` - Minimal execution of a **WASL** graph loaded using `wasl`

### Features
- Validation of original JSON files and loaded objects against the JSON Schema
- Automatic merging of ESM imports specified using the `src` key (anywhere in the WASL file!) to their containing objects.

### Errors vs Warnings
Errors mean that the WASL file will not run.

Warnings indicate that there is suboptimal syntax in the files themselves. However, these are corrected to load the file and don't impact loaded object format.

## Contributing
 > **Note:** Use Node v16.15.0 or higher (which support import assertions for JSON files) to run the tests


 ### Backlog
 - Validate ports
 - Nested html source tags that determine execution (using a custom component)

## Acknowledgments
`wasl` was developed for [brainsatplay], along with [graphscript] and [visualscript], to construct interactive, high-performance web applications as directed acyclic graphs (DAGs).

[brainsatplay]:(https://github.com/brainsatplay)
[graphscript]:(https://github.com/brainsatplay/graphscript)
[visualscript]:(https://github.com/brainsatplay/visualscript)