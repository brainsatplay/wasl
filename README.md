# wasl
 The Web Application Specification Language (WASL)

## What is WASL?
`wasl` is a specification language for defining web applications.

It inherits heavily from the `package.json` file from Node.js, though includes a new `graph` key/value pair to declare application logic and associations with other code files.

> **Note:** Before we develop a [VSCode Language Server extension](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide), you'll need to [manually associate](https://code.visualstudio.com/docs/languages/overview) `.wasl` files with `.json` format.

## Basic WASL Syntax
### nodes
```json
{
    "nodes": {
        "first": {
            "src": "first.wasl", // The location of the associated code
            "offload": false // The location to offload this code to (e.g. "https://..." or "worker")
        } ,
        "second": {
            // ...
        } 
    }
}
```

### edges
```json
{
    "edges": {
        "test": {
            "second" :{
                "protocol": "none" // The communication protocol to use to send events (e.g. "websocket" or "webrtc")
            }
        } 
    }
}
```

## Acknowledgments
`wasl` was developed for [brainsatplay], along with [graphscript] and [visualscript], to construct interactive, high-performance web applications as directed acyclic graphs (DAGs).

[brainsatplay]:(https://github.com/brainsatplay)
[graphscript]:(https://github.com/brainsatplay/graphscript)
[visualscript]:(https://github.com/brainsatplay/visualscript)