# wasl
 The Web Application Specification Language (WASL)

## What is WASL?
`wasl` is a specification language for defining web applications. 

`wasl` is written in [JSON Schema](https://json-schema.org/) and validated using [Ajv](https://ajv.js.org/). Typescript types are generaged using [json-schema-to-typescript](https://www.npmjs.com/package/json-schema-to-typescript). It inherits heavily from the `package.json` file from Node.js, though includes a new `graph` key/value pair to declare application logic and associations with other code files.

Each version of `wasl` is archived in the `versions` folder of this repository.

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

## Contributing
 > **Note:** Use Node v16.15.0 or higher (which support import assertions for JSON files) to run the tests

## Acknowledgments
`wasl` was developed for [brainsatplay], along with [graphscript] and [visualscript], to construct interactive, high-performance web applications as directed acyclic graphs (DAGs).

[brainsatplay]:(https://github.com/brainsatplay)
[graphscript]:(https://github.com/brainsatplay/graphscript)
[visualscript]:(https://github.com/brainsatplay/visualscript)