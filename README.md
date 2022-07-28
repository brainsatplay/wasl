# wasl
 The Web Application Specification Language

## What It Is
`wasl` is a specification language for defining web applications.

It inherits heavily from the `package.json` file from Node.js, though includes a new `graph` key/value pair to declare application logic and associations with other code files.

> **Note:** Before we develop a [VSCode Language Server extension](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide), you'll need to [manually associate](https://code.visualstudio.com/docs/languages/overview) `.wasl` files with `.json` format.

## Notable Projects
[brainsatplay] combines `wasl` with the [graphscript] and [visualscript] libraries to construct interactive web applications from directed acyclic graphs (DAGs).

## Acknowledgements
`wasl` is a core library of the [brainsatplay] project.

[brainsatplay]:(https://github.com/brainsatplay)
[graphscript]:(https://github.com/brainsatplay/graphscript)
[visualscript]:(https://github.com/brainsatplay/visualscript)