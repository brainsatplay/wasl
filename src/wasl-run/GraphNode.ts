class GraphNode {
    tag: string;
    node: any;
    graph: any;
    nested: any;
    parent: any;

    constructor(tag, node, parent) {
        this.tag = tag
        this.node = node

        // Catch Nested Graphs
        if (parent.nested) {
            this.parent = parent
            this.graph = this.parent.nested
        } 
        
        // Load Graphs Normally
        else this.graph = parent

        this.nested = this.node.graph

        if (this.nested) {
            for (let name in this.nested.nodes) {
                const node = this.nested.nodes[name]
                this.nested.nodes[name] = new GraphNode(name, node, this)
            }
        }
    }

    run = async (...args) => {

        const results: any = {
            default: undefined,
            children: {}
        }

        if (this.node.graph) {
            const input = this.node.graph.ports?.input
            if (input) {
                const output = this.node.graph.ports?.output
                const node = this.node.graph.nodes[input]
                const res = await node.run(...args)
                results.default = res.children[output].default
            }
        } else {
                results.default = this.node.default(...args) // check if defined
        }

       // Forward Result to ChildrenS
        if (results.default !== undefined) { // run children if defined
            for (let tag in this.graph.edges[this.tag]) {
                results.children[tag] = await this.graph.nodes[tag].run(results.default)
            }
        }

        return results
    }
}

export default GraphNode