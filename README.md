# Web Application Specification Languages (WASL) 1.0

## Introduction
**WASL** is a specification language for defining web applications. 

This specification is written in [JSON Schema](https://json-schema.org/) and validated using [Ajv](https://ajv.js.org/). Typescript types are generaged using [json-schema-to-typescript](https://www.npmjs.com/package/json-schema-to-typescript). 

**WASL** files inherit heavily from the `package.json` file from Node.js. However, they include a new `graph` key/value pair to declare application logic and associations with other code files.

Each version of `wasl` is archived in the `versions` folder of this repository.

###  WASL Example Syntax
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

## ECMAScript Components (ES Components)
*To Review*

**WASL** introduces the concept of **ES Components**: a way of formatting ES Modules to allow for composability across applications. 

``` javascript
export let nExecutions = 0

export default function(){
    this.nExecutions++
    return this.nExecutions
}
```

Each Component contains one `default` export and any number of `named` exports.

### Default Exports
The `default` export defines the behavior of the Component.

### Named Exports
 `named` exports define the states of the Components. 

### Stateless vs Stateful Components
If the `default` export uses a **standard function** (as opposed to an arrow function), the Component can be **stateful** and will modify its unique state.

On the other hand, **arrow functions** used for `default` exports imply that (1) the Component is **stateless**, or (2) states are shared across all objects that inherit from the Component.

## The Library
The `wasl` library validates and loads **WASL** files into JavaScript.

### Features
- Validation of original JSON files and loaded objects against the JSON Schema
- Automatic merging of ESM imports specified using the `src` key (anywhere in the WASL file!) to their containing objects.

### Errors vs Warnings
Errors mean that the WASL file will not run.

Warnings indicate that there is suboptimal syntax in the files themselves. However, these are corrected to load the file and don't impact loaded object format.

## Contributing
 > **Note:** Use Node v16.15.0 or higher (which support import assertions for JSON files) to run the tests

## Acknowledgments
`wasl` was developed for [brainsatplay], along with [graphscript] and [visualscript], to construct interactive, high-performance web applications as directed acyclic graphs (DAGs).

[brainsatplay]:(https://github.com/brainsatplay)
[graphscript]:(https://github.com/brainsatplay/graphscript)
[visualscript]:(https://github.com/brainsatplay/visualscript)