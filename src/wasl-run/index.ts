import GraphNode from "./GraphNode"

const start = (wasl) => {

    const graph = Object.assign(wasl.graph)
    graph.nodes = Object.assign(graph.nodes)

    // Transform into graph nodes
    for (let name in graph.nodes) {
        const node = graph.nodes[name]
        graph.nodes[name] = new GraphNode(name, node, wasl.graph)
    }

    // Run
    for (let name in graph.edges) graph.nodes[name].run(1).then(res => console.log('run res', name, res))

    return graph
}

export default start